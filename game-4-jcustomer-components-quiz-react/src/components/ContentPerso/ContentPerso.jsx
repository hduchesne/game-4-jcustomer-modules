import React from "react";
import {JahiaCtx, StoreCtx} from "contexts";
import {CxsCtx} from "unomi/cxs";
import cssSharedClasses from "components/cssSharedClasses";
import {useLazyQuery} from "@apollo/client";
import {GetPersonalizedContentVariant} from "webappGraphql";
import classnames from "clsx";
import {Typography} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Media} from "components/Media";
import {makeStyles} from "@material-ui/core/styles";
import {Qna} from "components/Qna";
import {Warmup} from "components/Warmup";
import {Loading} from "components/Loading";

const useStyles = makeStyles(theme => ({
    content:{
        // textAlign: 'left',
        maxWidth:'500px',
        margin:`${theme.spacing(4)}px auto 0`,

    },
}));

export const ContentPerso = (props) => {
    const { workspace, cndTypes } = React.useContext(JahiaCtx);
    const cxs = React.useContext(CxsCtx);
    const { state : {currentSlide} } = React.useContext(StoreCtx);

    const sharedClasses = cssSharedClasses(props);
    const classes = useStyles(props);

    const { id : persoId, media } = props;


    const [loadVariant, variantQuery] = useLazyQuery(GetPersonalizedContentVariant);
    const show = currentSlide === persoId;

//wait 1s before to call jExp in order to have time to synch user profile with answer
    React.useEffect(() => {
        if(persoId && cxs)
            setTimeout(
                () => loadVariant({
                    variables: {
                        workspace,
                        id:persoId,
                        profileId:cxs.profileId,
                        sessionId:cxs.sessionId,

                    },
                    fetchPolicy: "no-cache"
                }),
                1000
            );
    },[loadVariant,workspace, persoId, cxs])

    if (!variantQuery.data || variantQuery.loading)
        return <Loading show={show} media={media} msg="Look for the next question..."/>;

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
