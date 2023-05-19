import React from "react";
import {cndTypes} from "douane/lib/config";
import {Qna, Quiz, Warmup, ContentPerso, Score} from "components";
import {Typography} from "@material-ui/core";
import {useTranslation} from "react-i18next";

export const Preview = (props) => {
    const {t} = useTranslation();
    const {id, type, media} = props;

    switch (true) {
        case type === cndTypes.QUIZ:
            return <Quiz id={id} {...props} />
        case type === cndTypes.QNA :
            return <Qna id={id}/>
        case type === cndTypes.WARMUP :
            return <Warmup id={id}/>
        case cndTypes.CONTENT_PERSO.includes(type) :
            return <ContentPerso id={id} media={media}/>
        case type === cndTypes.SCORE_PERSO :
            return <Score {...props} />
        default :
            return (<Typography color="error"
                                component="p">
                {t("error.nodeType.notSupported")} : {type}
            </Typography>)

    }
}
