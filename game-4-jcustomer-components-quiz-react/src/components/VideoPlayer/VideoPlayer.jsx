import React, {useRef} from 'react';
import PropTypes from "prop-types";
import {JahiaCtx} from "contexts";
import ReactPlayer from "react-player";
import {syncVideoStatus} from "misc/trackerWem";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    playerWrapper:{}
}));

export const VideoPlayer = (props)=>{
    const classes = useStyles(props);
    const {ownerID,videoURL,videoId} = props;
    const { quizId,quizPath,quizType, isPreview } = React.useContext(JahiaCtx);

    const player = useRef(null);

    const handleVideoStatus = ({status}) => {
        if(!isPreview)
            syncVideoStatus({
                quiz:{
                    id:quizId,
                    path:quizPath,
                    type:quizType
                },
                parentId:ownerID,
                player,
                status,
                video:{
                    id:videoId,
                    url:videoURL
                }
            })
    }

    // const onReadyHandler = () => {
    //     console.log("onReady seekTo 4.2s")
    //     player.current.seekTo(4.2,"seconds");
    // }
    const onStartHandler = () => {
        // player.current.seekTo(4.2,"seconds");
    }
    const onPlayHandler = () => handleVideoStatus({status:"started"});
    const onEndedHandler = () => handleVideoStatus({status:"end"});
    const onPauseHandler = () => handleVideoStatus({status:"pause"});

    return (
        <div className={classes.playerWrapper}>
            <ReactPlayer
                ref={player}
                className='react-player'
                url={videoURL}
                controls
                width='100%'
                // height='100%'
                // onReady={onReadyHandler}
                onStart={onStartHandler}
                // onProgress={(object)=> console.log("onProgress : ",object)}
                onPlay={onPlayHandler}
                // onSeek={(seconds)=> console.log("onSeek : ",seconds)}
                // onDuration={(seconds)=> console.log("onDuration :",seconds)}
                onPause={onPauseHandler}
                onEnded={onEndedHandler}
            />
        </div>
    )
}

VideoPlayer.propTypes={
    videoURL:PropTypes.string.isRequired,
    ownerID:PropTypes.string.isRequired
}
