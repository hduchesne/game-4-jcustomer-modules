import get from "lodash.get";

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


const QuizMapper = (quizData) => ({
    //NOTE be sure string value like "false" or "true" are boolean I use JSON.parse to cast
    id: get(quizData, "id"),
    type: get(quizData, "type.value"),
    key : get(quizData, "key.value", {}),
    title: get(quizData, "title", ""),
    subtitle: get(quizData, "subtitle.value", ""),
    description: get(quizData, "description.value", ""),
    duration: get(quizData, "duration.value", ""),
    userTheme: getTheme(get(quizData, "userTheme.value", {})),
    transitionIsEnabled: JSON.parse(get(quizData, "transition.value", false)),
    transitionLabel: get(quizData, "transitionLabel.value", ""),
    resetIsEnabled: JSON.parse(get(quizData, "reset.value", false)),
    browsingIsEnabled: JSON.parse(get(quizData, "browsing.value", false)),
    //cover: get(quizData, "cover.node.path", ""),
    media: get(quizData, "media.node", {}),
    mktgForm: get(quizData, "mktgForm.value"),
    mktoConfig: getMktoConfig(get(quizData, "mktoConfig.value")),
    consents: get(quizData, "consents.nodes", []).map(node =>{
        return {
            id:get(node,"id"),
            actived:JSON.parse(get(node,"actived.value"))
        }
    }),
    personalizedResult :{
        id:get(quizData, "personalizedResult.node.id", null),
        type:get(quizData, "personalizedResult.node.type.value", null)
    },
    childNodes : get(quizData,"children.nodes",[]).map(node =>{
        return {
            id: get(node, "id"),
            type: get(node, "type.value")
        };
    }),
})
export default QuizMapper;