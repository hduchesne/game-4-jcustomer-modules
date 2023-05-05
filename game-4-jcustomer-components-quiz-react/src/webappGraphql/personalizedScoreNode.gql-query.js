import {gql} from "@apollo/client";
import {CORE_NODE_FIELDS, MEDIA_PROPERTY} from "./fragments"

export const GetPersonalizedScoreNode = gql`
    ${CORE_NODE_FIELDS}
    ${MEDIA_PROPERTY}
    query getPersonalizedScoreNode($workspace: Workspace!, $id: String!, $language: String!) {
        response: jcr(workspace: $workspace) {
            workspace
            persoResultContent: nodeById(uuid: $id) {
                ...CoreNodeFields
                title:property(language:$language, name:"game4:title"){ value }
                subtitle: property(language:$language, name:"game4:subtitle"){ value }
                content: property(language:$language,name:"game4:content"){ value }
                ...MediaProperty
            }
        }
    }`


