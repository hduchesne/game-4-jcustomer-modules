package org.jahia.se.modules.game.quiz.initializers;

import com.ning.http.client.AsyncCompletionHandler;
import com.ning.http.client.AsyncHttpClient;
import com.ning.http.client.ListenableFuture;
import com.ning.http.client.Response;
import org.apache.jackrabbit.value.StringValue;
import org.jahia.modules.jexperience.admin.ContextServerService;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.decorator.JCRSiteNode;
import org.jahia.services.content.nodetypes.ExtendedPropertyDefinition;
import org.jahia.services.content.nodetypes.ValueImpl;
import org.jahia.services.content.nodetypes.initializers.ChoiceListValue;
import org.jahia.services.content.nodetypes.initializers.ModuleChoiceListInitializer;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.osgi.service.component.annotations.Activate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.PropertyType;
import javax.jcr.RepositoryException;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * <h1>JExpProfilePropertiesInitializer</h1>
 * <p>
 * The JExpProfilePropertiesInitializer class implement a ModuleChoiceListInitializer that simply add a list
 * of values to the field (the field used a choiceList initializer "JExpProfilePropertiesInitializer").
 * The JExpProfilePropertiesInitializer get the list of profile properties from jCustomer and add it to the field
 * choiceList. The initializer has a parameter and according to this parameter we added the required
 * profiles properties to the field choiceList.
 * <p>
 * The JExpProfilePropertiesInitializer parameters<JSONObject> :
 * - occurrence : single || multiple -> to get only profile properties of type single or multivalued (default : single)
 * - type : string || date || integer -> to get only profile properties of selected type (default : all)
 *
 * @author HD
 * @author MF-TEAM
 */

@Component(service = ModuleChoiceListInitializer.class, immediate = true)
public class JExpProfilePropertiesInitializer implements ModuleChoiceListInitializer {

    private static final Logger logger = LoggerFactory.getLogger(JExpProfilePropertiesInitializer.class);
//    private String key;
    private String key="jExpProfilePropertiesInitializer";
    private ContextServerService contextServerService;
    private List<String> cardNames;
    private String occurrence;
    private String type;

    @Activate
    private void onActivate(Map<String,?> config){
        final String configCardNames = (String) config.get("cardNames");
        this.occurrence = (String) config.get("occurrence");
        if(this.occurrence==null || this.occurrence.isEmpty()){
            this.occurrence = "single";
        }
        this.type= (String) config.get("type");
        this.cardNames = Arrays.asList(configCardNames.split(","));
    }

    @Reference(service=ContextServerService.class)
    public void setContextServerService(ContextServerService contextServerService) {
        this.contextServerService = contextServerService;
    }

    @Override
    public List<ChoiceListValue> getChoiceListValues(ExtendedPropertyDefinition epd, String param, List<ChoiceListValue> values, Locale locale, Map<String, Object> context) {
        List<ChoiceListValue> choiceListValues = new ArrayList<>();

        try {
            JCRNodeWrapper node = (JCRNodeWrapper)
                    ((context.get("contextParent") != null)
                            ? context.get("contextParent")
                            : context.get("contextNode"));

            JCRSiteNode site = node.getResolveSite();
            final AsyncHttpClient asyncHttpClient = contextServerService
                    .initAsyncHttpClient(site.getSiteKey());

            if (asyncHttpClient != null) {
                AsyncHttpClient.BoundRequestBuilder requestBuilder = contextServerService
                        .initAsyncRequestBuilder(site.getSiteKey(), asyncHttpClient, "/cxs/profiles/properties",
                                true, true, true);

                ListenableFuture<Response> future = requestBuilder.execute(new AsyncCompletionHandler<Response>() {
                    @Override
                    public Response onCompleted(Response response) {
                        asyncHttpClient.closeAsynchronously();
                        return response;
                    }
                });

                JSONObject responseBody = new JSONObject(future.get().getResponseBody());
                JSONArray profileProperties = responseBody.getJSONArray("profiles");

                for (int i = 0; i < profileProperties.length(); i++) {
                    JSONObject property = profileProperties.getJSONObject(i);
                    String propertyCardName = getCardName(property);

                    boolean occurenceMatch = "single".equals(occurrence)?
                            !property.optBoolean("multivalued") : property.optBoolean("multivalued");
                    boolean typeMatch = type==null || type.isEmpty()? true : property.optString("type").equals(type);
                    //cardNameMatch remove property not associated to a card like *first visit* / *last visit*
                    boolean cardNameMatch = cardNames.isEmpty()?
                            !propertyCardName.isEmpty(): cardNames.contains(propertyCardName);

                    logger.debug("property.optBoolean(\"multivalued\") : "+property.optBoolean("multivalued"));
                    logger.debug("property.optString(\"type\") : "+property.optString("type"));
                    logger.debug("typeMatch : "+typeMatch);
                    logger.debug("occurenceMatch : "+occurenceMatch);

                    if (occurenceMatch && typeMatch && cardNameMatch) {
                        JSONObject metadata = property.getJSONObject("metadata");

                        String itemId = property.optString("itemId");
                        String displayName = metadata.optString("name",itemId)+" ( "+propertyCardName+" )";

                        choiceListValues.add(new ChoiceListValue(displayName, null, new StringValue(itemId)));
                    }
                }

                Collections.sort(choiceListValues, this.choiceListValueComparator);

                //Add in first position a value to quickly create a new user profile property
                //property will be single/string and place in card "Quiz"
                //this is a PreSales test. Ideally the popup used in Profile property manager should appear here...
                HashMap<String, Object> myPropertiesMap = null;
                myPropertiesMap = new HashMap<String, Object>();
                myPropertiesMap.put("addMixin","game4mix:usesNewProfileProperty");

                choiceListValues.add(0,new ChoiceListValue("create", myPropertiesMap, new ValueImpl("_new_", PropertyType.STRING, false)));
            }
        } catch (RepositoryException | InterruptedException | ExecutionException | IOException | JSONException e) {
            logger.error("Error happened", e);
        }

        return choiceListValues;
    }

    @Override
    public void setKey(String key) {
        this.key = key;
    }

    @Override
    public String getKey() {
        return key;
    }

    public static Comparator<ChoiceListValue> choiceListValueComparator = new Comparator<ChoiceListValue>() {
        @Override
        public int compare(ChoiceListValue l1, ChoiceListValue l2) {
            String displayName1 = l1.getDisplayName().toUpperCase();
            String displayName2 = l2.getDisplayName().toUpperCase();

            //ascending order
            return displayName1.compareTo(displayName2);
        }
    };

    private String getCardName(JSONObject property) throws JSONException {
        JSONObject metadata = property.getJSONObject("metadata");
        JSONArray systemTags = metadata.optJSONArray("systemTags");

        logger.debug("systemTags.toString() : "+systemTags.toString());

        Pattern cardPattern = Pattern.compile("\"cardDataTag/(\\w+)/(\\d{1,2}(?:\\.\\d{1,2})?)/(.*?)\"");
        Matcher matcher = cardPattern.matcher(systemTags.toString());
        //matcher.group(1) = cardId (String);
        //matcher.group(2) = cardIndex (String);
        //matcher.group(3) = cardName (String);
        String cardName = "";
        if (matcher.find())
            cardName = matcher.group(3);

        logger.debug("cardName : "+cardName);
        return cardName;
    };
}