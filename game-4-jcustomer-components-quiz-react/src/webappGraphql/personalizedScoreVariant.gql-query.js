import {gql} from "@apollo/client";
import {CORE_NODE_FIELDS} from "./fragments"

export const GetPersonalizedScoreVariant = gql`
    ${CORE_NODE_FIELDS}
    query getPersonalizedScoreVariant($workspace: Workspace!, $id: String!, $language: String!,$profileId: String,$sessionId: String) {
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
