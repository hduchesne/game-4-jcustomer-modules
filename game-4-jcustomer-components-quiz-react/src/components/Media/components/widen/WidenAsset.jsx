import WidenImage from "components/Media/components/widen/WidenImage";
import WidenVideo from "components/Media/components/widen/WidenVideo";
import React from "react";
import {JahiaCtx} from "contexts";
import PropTypes from "prop-types";
import {useQuery} from "@apollo/client";
import {GetWidenMedia} from "webappGraphql";

export const WidenAsset = ({types,id,sourceID}) => {
    // const width = '1024';
    const { workspace, locale, cndTypes } = React.useContext(JahiaCtx);

    const {loading, error, data} = useQuery(GetWidenMedia, {
        variables:{
            workspace,
            language:locale,
            id
        },
        skip:!id
    });

    if (loading) return <p>Loading...</p>;//<img src={`https://via.placeholder.com/${width}x768/09f/fff?text=Loading`} alt="loading"/>;
    if (error) return <p>Error :(</p>;

    const {title,imageURL :{value : imageURL} = {}, videoURL: {value : videoURL} = {}} = data.response.media

    let Component = <></>;
    switch (true){
        case types.includes(cndTypes.WIDEN_IMAGE) && imageURL :
            Component = <WidenImage imageURL={imageURL} title={title} />
            break;

        case types.includes(cndTypes.WIDEN_VIDEO) && videoURL :
            Component = <WidenVideo videoURL={videoURL} ownerID={sourceID} />
            break;
    }
    return <Component/>
}

WidenAsset.propTypes={
    types:PropTypes.array.isRequired,
    id:PropTypes.string,
    sourceID:PropTypes.string
}
