const getTheme = (theme)=>{
    if(typeof theme === 'string'){
        try{
            return JSON.parse(theme);
        }catch(e){
            console.error("the user theme => \n"+theme+"\n => is not a json object : ",e);
        }
    };
    return theme;
}

const getMktoConfig = (config)=>{
    if(!config)
        return;

    if(typeof config === 'string'){
        try{
            return JSON.parse(config);
        }catch(e){
            console.error("the marketo config => \n"+config+"\n => is not a json object : ",e);
        }
    };
}

const getTypes = quizJcrProps => {
    const superTypes = quizJcrProps.primaryNodeType.supertypes?.map(({name}) => name) || [];
    const mixinTypes = quizJcrProps.mixinTypes.map(({name}) => name) || [];
    const primaryNodeType = quizJcrProps.primaryNodeType?.name;
    return [primaryNodeType,...superTypes,...mixinTypes];
}

//TODO organize following the def content / config / ...
const formatQuizJcrProps = (quizJcrProps) => ({
    //NOTE be sure string value like "false" or "true" are boolean I use JSON.parse to cast
    id: quizJcrProps.uuid,
    types: getTypes(quizJcrProps),
    key : quizJcrProps.key.value,
    title: quizJcrProps.title,
    subtitle: quizJcrProps.subtitle?.value || "",
    description: quizJcrProps.description?.value || "",
    duration: quizJcrProps.duration?.value ||"",
    media: quizJcrProps.media?.node || {},

    userTheme: getTheme(quizJcrProps.userTheme?.value || {}),
    transitionIsEnabled: JSON.parse(quizJcrProps.transition?.value || false),
    transitionLabel: quizJcrProps.transitionLabel?.value ||"",
    resetIsEnabled: JSON.parse(quizJcrProps.reset?.value || false),
    browsingIsEnabled: JSON.parse(quizJcrProps.browsing?.value || false),

    mktgForm: quizJcrProps.mktgForm?.value,
    mktoConfig: getMktoConfig(quizJcrProps.mktoConfig?.value),
    consents: quizJcrProps.consents?.nodes.map( node =>({
            id:node.uuid,
            actived:JSON.parse(node.actived?.value)
        })
    ) || [],

    personalizedResult :{
        id:quizJcrProps.personalizedResult?.node?.uuid || null,
        type:quizJcrProps.personalizedResult?.node?.type?.value ||null
    },
    childNodes : quizJcrProps.children?.nodes?.map( node =>({
            id: node.uuid,
            type: node.type?.value
        })
    ) || []
})
export default formatQuizJcrProps;
