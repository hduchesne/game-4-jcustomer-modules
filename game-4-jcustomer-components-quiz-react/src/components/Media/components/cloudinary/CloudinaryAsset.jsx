import React from "react";
import {JahiaCtx} from "contexts";
import PropTypes from "prop-types";
import {CloudinaryImage} from "components/Media/components/cloudinary/CloudinaryImage";
import {CloudinaryVideo} from "components/Media/components/cloudinary/CloudinaryVideo";
import {useQuery} from "@apollo/client";
import {GetCloudyMedia} from "webappGraphql";

export const CloudinaryAsset = ({types,id,width,sourceID}) => {
    const { workspace, locale, cndTypes } = React.useContext(JahiaCtx);

    const {loading, error, data} = useQuery(GetCloudyMedia, {
        variables:{
            workspace,
            language:locale,
            id
        },
        skip:!id
    });

    if (loading) return <p>Loading...</p>;//<img src={`https://via.placeholder.com/${width}x768/09f/fff?text=Loading`} alt="loading"/>;
    if (error) return <p>Error :(</p>;

    const {title,url :{value : url} = {}, baseUrl: {value : baseUrl} = {}, endUrl: {value : endUrl} = {}} = data.response.media

    switch (true){
        case types.includes(cndTypes.CLOUDINARY_IMAGE) :
            return <CloudinaryImage title={title} baseUrl={baseUrl} endUrl={endUrl} width={width}/>

        case types.includes(cndTypes.CLOUDINARY_VIDEO) :
            return <CloudinaryVideo videoURL={url} ownerID={sourceID} />
    }
    return <></>
}

CloudinaryAsset.propTypes={
    types:PropTypes.array.isRequired,
    id:PropTypes.string,
    width:PropTypes.string,
    sourceID:PropTypes.string
}
