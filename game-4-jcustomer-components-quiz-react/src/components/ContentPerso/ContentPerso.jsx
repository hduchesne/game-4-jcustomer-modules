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
import InfoIcon from "@material-ui/icons/Info";
import classnames from "clsx";
import {Media} from "components/Media";
import {useTranslation} from "react-i18next";
import cssSharedClasses from "components/cssSharedClasses";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles(theme => ({
    content:{
        // textAlign: 'left',
        maxWidth:'500px',
        margin:`${theme.spacing(4)}px auto 0`,

    },
}));

const PreviewContentNotRendered = (props) => {
    const { media,show } = props;
    const { t } = useTranslation();
    const sharedClasses = cssSharedClasses(props);
    const classes = useStyles(props);

    return (
        <div className={classnames(
            sharedClasses.item,
            sharedClasses.showOverlay,
            (show ? 'active':'')
        )}>
            {media &&
            <Media id={media.id}
                   types={media.types}
                   path={media.path}
                   alt={"background"}
            />
            }
            <div className={classnames(
                sharedClasses.caption,
                sharedClasses.captionMain
            )}>
                <Typography component="div"
                            className={classes.content}>
                    <InfoIcon/> < br/>
                    {t("rendering.perso.notRendered")}
                </Typography>
            </div>
        </div>
    );
}

export const ContentPerso = (props) => {
    const { workspace, cndTypes, previewCm } = React.useContext(JahiaCtx);
    const cxs = React.useContext(CxsCtx);
    const {state: {currentSlide}, dispatch} = React.useContext(StoreCtx);

    const { id : persoId, media } = props;

    const [loadVariant, variantQuery] = useLazyQuery(GetPersonalizedContentVariant);
    const show = currentSlide === persoId;

//wait 1s before to call jExp in order to have time to synch user profile with answer
    React.useEffect(() => {
        if (persoId && cxs) {
            setTimeout(
                () => {
                    loadVariant({
                        variables: {
                            workspace,
                            id: persoId,
                            profileId: cxs.profileId,
                            sessionId: cxs.sessionId,

                        },
                        fetchPolicy: "no-cache"
                    })
                },
                1000
            );
            dispatch({
                case: "PERSO_WAS_DONE",
                payload: {
                    persoId
                }
            })
        }
    },[loadVariant,workspace, persoId, cxs])

    if (!variantQuery.data || variantQuery.loading){
        if(previewCm)
            return <PreviewContentNotRendered show={show} media={media} />
        return <Loading show={show} media={media} msg="loading.nextQuestion"/>;
    }

    if (variantQuery.error) return <p>Error getting your next question :(</p>;

    if(previewCm)
        return <PreviewContentNotRendered show={show} media={media} />

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
