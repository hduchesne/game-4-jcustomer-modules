import React from "react";
import {JahiaCtx} from "contexts";
import PropTypes from "prop-types";

export const Image = ({path,alt}) =>{
    const { filesServerUrl } = React.useContext(JahiaCtx);
    return(
        <img className=""
             src={`${filesServerUrl}${encodeURI(path)}`}
             alt={alt}/>
    )
}

Image.propTypes={
    path:PropTypes.string.isRequired,
    alt:PropTypes.string,
}
