import React from "react";
import {StoreCtx} from "contexts";
import {useQuery} from "@apollo/client";
import {GetWidenMedia} from "webappGraphql";
import get from "lodash.get";
import MediaMapper from './WidenMediaModel';
import PropTypes from "prop-types";
import VideoPlayer from "components/VideoPlayer";


const WidenVideo = ({uuid, ownerID}) => {

    const { state } = React.useContext(StoreCtx);
    const { gql_variables} =  state.jContent;

    const variables = Object.assign(gql_variables,{id:uuid})
    const {loading, error, data} = useQuery(GetWidenMedia, {
        variables: variables,
    });

    const [media, setMedia] = React.useState({});

    React.useEffect(() => {
        if(loading === false && data){
            const media = MediaMapper(get(data, "response.media", {}));
            setMedia(media);
        }
    }, [loading,data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <>
        {media.videoURL &&
            <VideoPlayer
                videoURL={media.videoURL}
                ownerID={ownerID}
            />
        }
        </>
    )
}

WidenVideo.propTypes={
    uuid:PropTypes.string.isRequired,
    ownerID:PropTypes.string.isRequired,
}

export default WidenVideo;
