import React from "react";
import {JahiaCtx, StoreCtx} from "contexts";
import {CxsCtx} from "unomi/cxs";
import {useLazyQuery} from "@apollo/client";
import {GetPersonalizedContentVariant} from "webappGraphql";
import {Typography} from "@material-ui/core";
import {Qna} from "components/Qna";
import {Warmup} from "components/Warmup";
import {Loading} from "components/Loading";
import PropTypes from "prop-types";

export const ContentPerso = (props) => {
    const { workspace, cndTypes, previewCm } = React.useContext(JahiaCtx);
    const cxs = React.useContext(CxsCtx);
    const { state : {currentSlide} } = React.useContext(StoreCtx);

    const { id : persoId, media } = props;


    const [loadVariant, variantQuery] = useLazyQuery(GetPersonalizedContentVariant);
    const show = currentSlide === persoId;

//wait 1s before to call jExp in order to have time to synch user profile with answer
    React.useEffect(() => {
        console.log("loadVariant (1) persoId=",persoId," cxs : ",cxs);
        if(persoId && cxs)
            setTimeout(
                () => {
                    console.log("loadVariant (2) persoId=",persoId," cxs : ",cxs);
                    loadVariant({
                        variables: {
                            workspace,
                            id:persoId,
                            profileId:cxs.profileId,
                            sessionId:cxs.sessionId,

                        },
                        fetchPolicy: "no-cache"
                    })
                },
                1000
            );
    },[loadVariant,workspace, persoId, cxs])

    if (!variantQuery.data || variantQuery.loading){
        if(previewCm)
            return
        return <Loading show={show} media={media} msg="loading.nextQuestion"/>;
    }

    if (variantQuery.error) return <p>Error getting your next question :(</p>;

    const { variant } = variantQuery.data.response?.result?.jExperience?.resolve;

    const getContent = (node) => {
        switch (node.primaryNodeType?.name){
            case cndTypes.QNA:
                return <Qna
                    key={node.uuid}
                    id={node.uuid}
                    persoId={persoId}
                />

            case cndTypes.WARMUP:
                    return <Warmup
                        key={node.uuid}
                        id={node.uuid}
                        persoId={persoId}
                    />
            // case cndTypes.CONTENT_PERSO :
            //         return <ContentPerso
            //             key={node.id}
            //             id={node.id}
            //             media={media}
            //             persoId={}
            //         />
            default:
                return <Typography color="error"
                                   component="p">
                    node type {node.primaryNodeType?.name} is not supported
                </Typography>
        }
    }

    return getContent(variant);
}

ContentPerso.propTypes={
    id : PropTypes.string.isRequired,
    media: PropTypes.object
}
