import {gql} from 'apollo-boost';

// cover: property(name:"game4:masterQnaCover"){
//     node: refNode {
//         path
//     }
// }

export const GET_WARMUP = ({workspace}) => {
    let children = `children {
                        nodes {
                            id: uuid
                            type: primaryNodeType{
                                value:name
                            }
                        }
                    },`;
    if (workspace === "LIVE")
        children = `children(propertiesFilter:{
                            filters:[{
                                property:"j:published",
                                value:"true",
                                evaluation:EQUAL
                            }]
                        }){
                        nodes {
                            id: uuid
                            type: primaryNodeType{
                                value:name
                            }
                        }
                    },`;
    const query = `
        query getWarmup($workspace: Workspace!, $id: String!, $language: String!) {
            response: jcr(workspace: $workspace) {
                warmup: nodeById(uuid: $id) {
                    id: uuid
                    title:displayName(language:$language)
                    subtitle: property(language:$language, name:"game4:subtitle"){
                        value
                    }
                    content: property(language:$language,name:"game4:content"){
                        value
                    }
                    duration: property(name:"game4:qnaDuration"){
                        value
                    }
                    videoLink: property(name:"game4:videoLink"){
                        value
                    }
                    videoExtPath: property(language:$language,name:"game4:videoExtPath"){
                        value
                    }
                    videoIntPath: property(language:$language,name:"game4:videoIntPath"){
                        node: refNode {
                            id: uuid
                            type: primaryNodeType{
                                value:name
                            }
                            path
                        }
                    }
                    media: property(language:$language,name:"wden:mediaNode",){
                        node: refNode {
                            id: uuid
                            type: primaryNodeType{
                                value:name
                            }
                            mixins: mixinTypes{
                                value:name
                            }
                            path
                        }
                    }
                    ${children}
                }
            }
        }
    `;
    return gql(query);
}
