import React from 'react';
import PropTypes from "prop-types";

import {useQuery} from "@apollo/client";

import {AppCtx, JahiaCtx, StoreCtx} from "contexts";
import {GetWarmup} from "webappGraphql";
import {formatWarmupJcrProps} from "components/Warmup/WarmupModel";
import {ContentPerso, Loading, Media, Qna} from "components";
import classnames from "clsx";
import cssSharedClasses from "components/cssSharedClasses";
import {makeStyles} from "@material-ui/core/styles";
import {Typography, Button} from "@material-ui/core";
import {manageTransition} from "misc/utils";
import {EmbeddedPathInHtmlResolver} from "components/Jahia";

const useStyles = makeStyles(theme => ({
    contentGroup:{
        textAlign:'justify',
        maxWidth:'800px',
        margin:"auto",
        marginTop:`${theme.spacing(3)}px`,
        marginBottom:`${theme.spacing(4)}px`
    }
}));

export const Warmup = (props) => {
    const classes = useStyles(props);
    const sharedClasses = cssSharedClasses(props);
    const {id: warmupId, persoId} = props;
    const {workspace, locale, cndTypes} = React.useContext(JahiaCtx);
    const {transitionIsEnabled, transitionTimeout, languageBundle} = React.useContext(AppCtx);
    const { state, dispatch } = React.useContext(StoreCtx);
    const {
        currentSlide,
    } = state;
    const show = currentSlide === warmupId || currentSlide === persoId;;

    const {loading, error, data} = useQuery(GetWarmup, {
        variables:{
            workspace,
            language:locale,
            id:warmupId
        },
        skip:!warmupId
    });

    // const [warmup, setWarmup] = React.useState({childNodes:[]});

    React.useEffect(() => {
        if(loading === false && data) {
            dispatch({
                case:"ADD_SLIDES",
                payload:{
                    slides: data.response.warmup.children?.nodes?.map(node=>node.uuid),
                    parentSlide: persoId || data.response.warmup.uuid
                }
            });
        }
    },[loading,data]);

    if (loading) return <Loading show={show} msg="loading.warmup"/>;
    if (error) return <p>Error :(</p>;

    const {id, media, title, subtitle, video, content, childNodes} = formatWarmupJcrProps(data.response.warmup);

    const handleCLick = () =>
        manageTransition({
            transitionIsEnabled,
            transitionTimeout,
            dispatch,
            payload: {
                case: "NEXT_SLIDE"
            }
        });

    const displayPerso = (persoId) => {
        if (currentSlide === persoId)
            return <ContentPerso
                key={persoId}
                id={persoId}
                media={media}
            />
    }

    return (
        <>
            <div className={classnames(
                sharedClasses.item,
                sharedClasses.showOverlay,
                (show ? 'active' : '')
            )}>
                {media &&
                <Media id={media.id}
                           types={media.types}
                           path={media.path}
                           alt={title}
                    />
                }

                <div className={classnames(
                    sharedClasses.caption,
                    sharedClasses.captionMain
                )}>
                    <Typography className={sharedClasses.textUppercase}
                                variant="h3">
                        {title}
                    </Typography>
                    <Typography className={sharedClasses.subtitle}
                                color="primary"
                                variant="h4">
                        {subtitle}
                    </Typography>

                    <div className={classes.contentGroup}>
                        <Typography component="div"
                                    className={classes.content}
                                    children={<EmbeddedPathInHtmlResolver htmlAsString={content} />}/>

                        {video &&
                        <div>
                            <Media id={video.id}
                                   types={video.types}
                                   path={video.path}
                                   sourceID={id}
                            />
                        </div>
                        }
                    </div>

                    <Button onClick={handleCLick}>
                        {languageBundle && languageBundle.btnQuestion}
                    </Button>
                </div>
            </div>
            {childNodes.map(node => {
                if (node.types.includes(cndTypes.QNA))
                    return <Qna
                        key={node.id}
                        id={node.id}
                    />
                if (cndTypes.CONTENT_PERSO.some(type => node.types.includes(type)))
                    return displayPerso(node.id)
            })}
        </>
    );
}

Warmup.propTypes={
    id:PropTypes.string.isRequired,
    persoId: PropTypes.string
}
