import {gql} from "@apollo/client";
import {CORE_NODE_FIELDS,QUIZ_STATIC_LABELS,MEDIA_PROPERTY} from "./fragments"

export const GetQuiz = gql`
    ${CORE_NODE_FIELDS}
    ${MEDIA_PROPERTY}
    ${QUIZ_STATIC_LABELS}
    query getQuiz($workspace: Workspace!, $id: String!, $language: String!) {
        response: jcr(workspace: $workspace) {
            workspace
            quiz: nodeById(uuid: $id) {
                ...CoreNodeFields
                quizKey: property(name:"game4:quizKey"){ value }
                title: displayName(language:$language)
                subtitle: property(language:$language, name:"game4:subtitle"){ value }
                description: property(language:$language,name:"game4:description"){ value }
                duration: property(name:"game4:duration"){ value }
                userTheme: property(name:"game4:webappTheme"){ value }
                transition: property(name:"game4:transition"){ value }
                transitionLabel: property(name:"game4:transitionLabel"){ value }
                reset: property(name:"game4:reset"){ value }
                browsing: property(name:"game4:browsing"){ value }
                mktgForm: property(name:"game4:marketingFormChoice"){ value }
                mktoConfig: property(language:$language,name:"game4:mktoConfig"){ value }
#                personalizedResult: property(name:"game4:personalizedResultContent"){ node: refNode { ...CoreNodeFields } }
                children(typesFilter:{types:["game4mix:quizChild"]}) { nodes { ...CoreNodeFields } }
                ...MediaProperty
                ...QuizStaticLabels
            }
        }
    }`;


