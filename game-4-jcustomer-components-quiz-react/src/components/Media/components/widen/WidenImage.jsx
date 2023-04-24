import React from "react";
import PropTypes from "prop-types";

const WidenImage = ({imageURL,title}) => {
    const _SIZE_ = '{size}';
    const _SCALE_ = '{scale}';
    const _QUALITY_ = '{quality}';
    const width = '1024';
    const scale = '1';
    const quality = '72';

    return (
        <img className="d-block w-100"
         src={imageURL.replace(_SIZE_,width).replace(_SCALE_,scale).replace(_QUALITY_,quality)}
         alt={title}/>
    )
}

WidenImage.propTypes={
    imageURL:PropTypes.string.isRequired,
    title:PropTypes.string.isRequired
}

export default WidenImage;
