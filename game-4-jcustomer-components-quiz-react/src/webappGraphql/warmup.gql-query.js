import {gql} from "@apollo/client";
import {CORE_NODE_FIELDS,MEDIA_PROPERTY} from "./fragments";

export const GetWarmup = gql`
    ${CORE_NODE_FIELDS}
    ${MEDIA_PROPERTY}
    query getWarmup($workspace: Workspace!, $id: String!, $language: String!) {
        response: jcr(workspace: $workspace) {
            workspace
            warmup: nodeById(uuid: $id) {
                ...CoreNodeFields
                title:displayName(language:$language)
                subtitle: property(language:$language, name:"game4:subtitle"){ value }
                content: property(language:$language,name:"game4:content"){ value }
                duration: property(name:"game4:qnaDuration"){ value }
                video: property(language:$language,name:"game4:video"){
                    value
                    node: refNode {...CoreNodeFields }
                }
                children(typesFilter:{types:["game4mix:warmupChild"]}) { nodes { ...CoreNodeFields } }
                ...MediaProperty
            }
        }
    }
`;
