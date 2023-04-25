import React from "react";
import PropTypes from "prop-types";
import {VideoPlayer} from "components/VideoPlayer";


export const WidenVideo = ({videoURL, ownerID}) => <VideoPlayer videoURL={videoURL} ownerID={ownerID} />

WidenVideo.propTypes={
    videoURL:PropTypes.string.isRequired,
    ownerID:PropTypes.string.isRequired,
}
