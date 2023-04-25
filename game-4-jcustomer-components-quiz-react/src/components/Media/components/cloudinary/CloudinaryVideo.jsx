import {VideoPlayer} from "components/VideoPlayer";
import React from "react";
import PropTypes from "prop-types";

export const CloudinaryVideo = ({videoURL, ownerID}) => <VideoPlayer videoURL={videoURL} ownerID={ownerID} />

CloudinaryVideo.propTypes={
    videoURL:PropTypes.string.isRequired,
    ownerID:PropTypes.string.isRequired,
}
