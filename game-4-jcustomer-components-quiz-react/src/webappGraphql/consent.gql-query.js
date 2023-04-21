import {gql} from "@apollo/client";
import {CORE_NODE_FIELDS} from "./fragments"

export const GetConsent = gql`
    ${CORE_NODE_FIELDS}
    query getConsent($workspace: Workspace!, $id: String!, $language: String!) {
        response: jcr(workspace: $workspace) {
            workspace
            consent: nodeById(uuid: $id) {
                ...CoreNodeFields
                identifier:name
                title:displayName(language:$language)
                description: property(language:$language, name:"jcr:description"){ value }
                actived: property(language:$language,name:"wem:activated"){ value }
            }
        }
    }`


