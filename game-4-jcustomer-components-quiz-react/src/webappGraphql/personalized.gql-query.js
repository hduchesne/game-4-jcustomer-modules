import {gql} from "@apollo/client";
import {CORE_NODE_FIELDS} from "./fragments"

export const GetPersonalizedResult = gql`
    ${CORE_NODE_FIELDS}
    query getPersonalizedResultContent($workspace: Workspace!, $id: String!, $language: String!,$profileId: String,$sessionId: String) {
        response: jcr(workspace: $workspace) {
            workspace
            result: nodeById(uuid: $id) {
                ...CoreNodeFields
                jExperience: jExperience(profileId: $profileId, sessionId: $sessionId) {
                    variant:personalizedVariant{
                        ...CoreNodeFields
                        title:displayName(language:$language)
                        text:property(language:$language,name:"text"){
                            value
                        }
                    }
                }
            }
        }
    }`


