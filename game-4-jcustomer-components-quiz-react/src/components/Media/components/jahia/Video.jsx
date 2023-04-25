import React from "react";
import PropTypes from "prop-types";
import {VideoPlayer} from "components/VideoPlayer";

export const Video = ({url,ownerID}) => <VideoPlayer videoURL={url} ownerID={ownerID}/>

Video.propTypes={
    url:PropTypes.string.isRequired,
    ownerID:PropTypes.string.isRequired,
}
