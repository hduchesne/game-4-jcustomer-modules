
const _WEAKREFERENCE_ = "WEAKREFERENCE";

export const getTypes = jcrProps => {
    if(!jcrProps)
        return [];

    const superTypes = jcrProps.primaryNodeType.supertypes?.map(({name}) => name) || [];
    const mixinTypes = jcrProps.mixinTypes.map(({name}) => name) || [];
    const primaryNodeType = jcrProps.primaryNodeType?.name;
    return [primaryNodeType,...superTypes,...mixinTypes];
}

export function getProperties(properties,context){
    if(!properties) return;
    return properties.reduce(function(bundle,property){
        const key = property.name.split(":").pop();
        let value = property.value || property.values;
// console.log("property : ",property);
        if(property.type === _WEAKREFERENCE_ &&
            property.weakreference &&
            property.weakreference.path
        ){
            property.weakreference.url=
                `${context.files_endpoint}${encodeURI(property.weakreference.path)}`;
            value = property.weakreference;
        }

        bundle[key]=value;
        return bundle;
    },{});
};

// function getWeakURL(filesEndpoint,nodePath){
//     return `${filesEndpoint}${encodeURI(nodePath)}`;///encodeURIComponent()
// };

export function getRandomString (length, format){
    let mask = "";
    if (format.indexOf("a") > -1) mask += "abcdefghijklmnopqrstuvwxyz";
    if (format.indexOf("A") > -1) mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (format.indexOf("#") > -1) mask += "0123456789";
    if (format.indexOf("!") > -1) mask += "~`!@#$%^&*()_+-={}[]:\";'<>?,./|\\";
    let result = "";
    for (let i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
};

export function getGQLWorkspace(workspace){
    return workspace==="default"?
        "EDIT":
        workspace.toUpperCase()
}

export function manageTransition({transitionIsEnabled, transitionTimeout,dispatch,payload}){
    if(transitionIsEnabled){
        dispatch({
            case:"TOGGLE_TRANSITION"
        });

        setTimeout(()=>dispatch({
            case:"TOGGLE_TRANSITION"
        }),transitionTimeout);

        setTimeout(()=>dispatch(payload),transitionTimeout);
    }else{
        dispatch(payload)
    }
}

export const resolveJahiaMediaURL = ({host,path, workspace}) => {
    const jahiaFilePath = `/files/${workspace === 'EDIT' ? 'default' : 'live'}`;
    if (!path) {
        return '';
    }
    return `${host}${jahiaFilePath}${encodeURI(path)}`;
};

export const resolveJahiaEmbeddedURL = ({host,path, isPreview,isEdit,locale}) => {
    if (!path) {
        return '';
    }

    const paths = {
        preview: '/cms/render/default',
        edit: '/cms/editframe/default'
    }

    let pagePath;
    switch (true){
        case (isPreview && isEdit) :
            pagePath = `${host}${paths.edit}/${locale}${path}`;
            break;
        case isPreview :
            pagePath = `${host}${paths.preview}/${locale}${path}`;
            break;
        default :
            pagePath = `${host}/${locale}${path}`;
            break;
    }

    return pagePath;
};
