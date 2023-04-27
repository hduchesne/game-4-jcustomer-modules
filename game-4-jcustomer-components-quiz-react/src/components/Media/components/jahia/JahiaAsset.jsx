import React from "react";
import {JahiaCtx} from "contexts";
import {Image} from "components/Media/components/jahia/Image";
import {Video} from "components/Media/components/jahia/Video";
import PropTypes from "prop-types";

export const JahiaAsset = ({id,types,path,alt,sourceID}) => {
    const { cndTypes,filesServerUrl } = React.useContext(JahiaCtx);

    switch (true){
        case Array.isArray(types) && types.length === 0 :
            return <Video url={path} ownerID={sourceID} />

        case types.includes(cndTypes.JNT_FILE) && types.includes(cndTypes.IMAGE):
            return <Image path={path} alt={alt}/>

        case types.includes(cndTypes.JNT_FILE):
            return <Video videoId={id} videoURL={filesServerUrl+encodeURI(path)} ownerID={sourceID} />

        default:
            if(path)
                return <Image path={path} alt={alt}/>
    }
    return <></>
}

JahiaAsset.propTypes={
    types:PropTypes.array.isRequired,
    path:PropTypes.string,
    sourceID:PropTypes.string,
    alt:PropTypes.string
}
