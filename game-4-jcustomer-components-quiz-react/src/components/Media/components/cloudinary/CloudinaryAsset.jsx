import React from "react";
import {JahiaCtx} from "contexts";
import PropTypes from "prop-types";
import {CloudinaryImage} from "components/Media/components/cloudinary/CloudinaryImage";
import {CloudinaryVideo} from "components/Media/components/cloudinary/CloudinaryVideo";

export const CloudinaryAsset = ({types,id,sourceID}) => {
    const { cndTypes } = React.useContext(JahiaCtx);



    let Component = <></>;
    switch (true){
        case types.includes(cndTypes.WIDEN_IMAGE) :
            Component = <CloudinaryImage uuid={id} />
            break;

        case types.includes(cndTypes.WIDEN_VIDEO) :
            Component = <CloudinaryVideo uuid={id} ownerID={sourceID} />
            break;
    }
    return <Component/>
}

CloudinaryAsset.propTypes={
    types:PropTypes.array.isRequired,
    id:PropTypes.string,
    sourceID:PropTypes.string
}
