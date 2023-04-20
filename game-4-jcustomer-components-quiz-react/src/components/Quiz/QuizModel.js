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

const getTypes = jcrProps => {
    const superTypes = jcrProps.primaryNodeType.supertypes?.map(({name}) => name) || [];
    const mixinTypes = jcrProps.mixinTypes.map(({name}) => name) || [];
    const primaryNodeType = jcrProps.primaryNodeType?.name;
    return [primaryNodeType,...superTypes,...mixinTypes];
}

const languageBundleKeys =  [
    "btnStart",
    "btnSubmit",
    "btnQuestion",
    "btnNextQuestion",
    "btnShowResults",
    "btnReset",
    "consentTitle",
    "correctAnswer",
    "wrongAnswer"
]

const initLanguageBundle = quizJcrProps =>
    languageBundleKeys.reduce((bundle,key)=>{
        bundle[key] = quizJcrProps[key]?.value;
        return bundle;
    },{})


export const formatQuizJcrProps = (quizJcrProps) => ({
    //NOTE be sure string value like "false" or "true" are boolean I use JSON.parse to cast
    id: quizJcrProps.uuid,
    types: getTypes(quizJcrProps),
    quizContent: {
        key: quizJcrProps.key.value,
        title: quizJcrProps.title,
        subtitle: quizJcrProps.subtitle?.value || "",
        description: quizJcrProps.description?.value || "",
        duration: quizJcrProps.duration?.value || "",
        media: quizJcrProps.media?.node || {},
        personalizedResult: {
            id: quizJcrProps.personalizedResult?.node?.uuid || null,
            types: getTypes(quizJcrProps.personalizedResult?.node)
        },
        childNodes: quizJcrProps.children?.nodes?.map(node => ({
                id: node.uuid,
                types: getTypes(node)
            })
        ) || []
    },
    quizConfig: {
        userTheme: getTheme(quizJcrProps.userTheme?.value || {}),
        transitionIsEnabled: JSON.parse(quizJcrProps.transition?.value || false),
        transitionLabel: quizJcrProps.transitionLabel?.value || "",
        resetIsEnabled: JSON.parse(quizJcrProps.reset?.value || false),
        browsingIsEnabled: JSON.parse(quizJcrProps.browsing?.value || false),
        mktgForm: quizJcrProps.mktgForm?.value,
        mktoConfig: getMktoConfig(quizJcrProps.mktoConfig?.value),
        consents: quizJcrProps.consents?.nodes.map(node => ({
                id: node.uuid,
                actived: JSON.parse(node.actived?.value)
            })
        ) || [],
    },
    languageBundle: initLanguageBundle(quizJcrProps)
});
