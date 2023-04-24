import React from 'react';
import PropTypes from "prop-types";
import {JahiaCtx} from "contexts";
import {WidenAsset} from "components/Media/components/widen";
import {JahiaAsset} from "components/Media/components/jahia";
import {CloudinaryAsset} from "components/Media/components/cloudinary";

export const Media = ({id,types,path,sourceID,alt}) => {
    const { cndTypes } = React.useContext(JahiaCtx);

    switch(true){
        case types.includes(cndTypes.WIDEN) :
            return <WidenAsset types={types} id={id} sourceID={sourceID} />
        case types.includes(cndTypes.CLOUDINARY) :
            return <CloudinaryAsset types={types} id={id} sourceID={sourceID} />
        default :
            return <JahiaAsset types={types} path={path} sourceID={sourceID} alt={alt}/>
    }
}

Media.propTypes={
    id:PropTypes.string,
    types:PropTypes.string,
    path:PropTypes.string,
    sourceID:PropTypes.string,
    alt:PropTypes.string
}
