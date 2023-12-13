import {gql} from "@apollo/client";
import {CORE_NODE_FIELDS,MEDIA_PROPERTY} from "./fragments"

export const GetQnA = gql`
    ${CORE_NODE_FIELDS}
    ${MEDIA_PROPERTY}
    query getQna($workspace: Workspace!, $id: String!, $language: String!) {
        response: jcr(workspace: $workspace) {
            workspace
            qna: nodeById(uuid: $id) {
                ...CoreNodeFields
                title: displayName(language:$language)
                question: property(language:$language, name:"game4:question"){ value }
                help: property(language:$language,name:"game4:help"){ value }
                nbExpectedAnswer: property(name:"game4:nbExpectedAnswer"){ value }
                answers: property(language:$language,name:"game4:answers"){ values }
                randomSelection: property(name:"game4:randomSelection"){ value }
                notUsedForScore: property(name:"game4:notUsedForScore"){ value }
                jExpField2Map: property(name:"seu:jExpProperty"){ value }
                ...MediaProperty
            }
        }
    }`


