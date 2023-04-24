import React from "react";
import {JahiaCtx} from "contexts";
import Image from "components/Media/components/jahia/Image";
import Video from "components/Media/components/jahia/Video";
import PropTypes from "prop-types";

export const JahiaAsset = ({types,path,alt,sourceID}) => {
    const { cndTypes,filesServerUrl } = React.useContext(JahiaCtx);
    let Component = <></>;
    switch (true){
        case Array.isArray(types) && types.length === 0 :
            Component = <Video url={path} ownerID={sourceID} />
            break;

        case types.includes(cndTypes.JNT_FILE) && types.includes(cndTypes.IMAGE):
            Component = <Image path={path} alt={alt}/>
            break;

        case types.includes(cndTypes.JNT_FILE):
            Component = <Video url={filesServerUrl+encodeURI(path)} ownerID={sourceID} />
            break;

        default:
            if(path)
                Component = <Image path={path} alt={alt}/>
            break;
    }
    return <Component/>
}

JahiaAsset.propTypes={
    types:PropTypes.array.isRequired,
    path:PropTypes.string,
    sourceID:PropTypes.string,
    alt:PropTypes.string
}
