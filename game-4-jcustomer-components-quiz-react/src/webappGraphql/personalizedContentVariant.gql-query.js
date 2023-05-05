import {gql} from "@apollo/client";
import {CORE_NODE_FIELDS} from "./fragments"

export const GetPersonalizedContentVariant = gql`
    ${CORE_NODE_FIELDS}
    query getPersonalizedContentVariant($workspace: Workspace!, $id: String!,$profileId: String,$sessionId: String) {
        response: jcr(workspace: $workspace) {
            workspace
            result: nodeById(uuid: $id) {
                ...CoreNodeFields
                jExperience: asExperience{
                    resolve(profileId: $profileId, sessionId: $sessionId) {
                        variant{
                            ...CoreNodeFields
                        }
                    }
                }
            }
        }
    }`
