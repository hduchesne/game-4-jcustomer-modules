import {gql} from "@apollo/client";
import {CORE_NODE_FIELDS} from "./fragments"

export const GetPersonalizedResult = gql`
    ${CORE_NODE_FIELDS}
    query getPersonalizedResultContent($workspace: Workspace!, $id: String!, $language: String!,$profileId: String,$sessionId: String) {
        response: jcr(workspace: $workspace) {
            workspace
            result: nodeById(uuid: $id) {
                ...CoreNodeFields
                jExperience: asExperience{
                    resolve(profileId: $profileId, sessionId: $sessionId) {
                        variant{
                            ...CoreNodeFields
                            title:displayName(language:$language)
                            text:property(language:$language,name:"text"){value}
                        }
                    }
                }
            }
        }
    }`


//1c3fe3d4-05b8-4e30-acb6-ba3e8366c809
