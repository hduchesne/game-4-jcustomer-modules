import React from "react";
import {JahiaCtx} from "contexts";

const Image = ({path,alt}) =>{
    const { filesServerUrl } = React.useContext(JahiaCtx);
    return(
        <img className="d-block w-100"
             src={`${filesServerUrl}${encodeURI(path)}`}
             alt={alt}/>
    )
}
export default Image;
