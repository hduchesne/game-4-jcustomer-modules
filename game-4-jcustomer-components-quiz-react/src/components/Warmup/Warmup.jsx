import React from 'react';
import PropTypes from "prop-types";

import get from "lodash.get";
import {useQuery} from "@apollo/client";

import {AppCtx, JahiaCtx, StoreCtx} from "contexts";
import {GetWarmup} from "webappGraphql";
import Qna from "components/Qna";
import {formatWarmupJcrProps} from "components/Warmup/WarmupModel";
import {Media} from "components/Media";
import classnames from "clsx";
import cssSharedClasses from "components/cssSharedClasses";
import {makeStyles} from "@material-ui/core/styles";
import {Typography, Button} from "@material-ui/core";
import DOMPurify from "dompurify";
import Header from "components/Header/Header";
import {manageTransition} from "misc/utils";

const useStyles = makeStyles(theme => ({
    contentGroup:{
        textAlign:'justify',
        maxWidth:'800px',
        margin:"auto",
        marginTop:`${theme.spacing(3)}px`,
        marginBottom:`${theme.spacing(4)}px`
    }
}));

const Warmup = (props) => {
    const classes = useStyles(props);
    const sharedClasses = cssSharedClasses(props);
    const { id : warmupId } = props;
    const { workspace, locale, cndTypes } = React.useContext(JahiaCtx);
    const { languageBundle } = React.useContext(AppCtx);
    const { state, dispatch } = React.useContext(StoreCtx);
    const {
        currentSlide,
    } = state;


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
                    parentSlide:data.response.warmup.uuid
                }
            });
        }
    },[loading,data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const {id, media, title, subtitle, video, content, childNodes} = formatWarmupJcrProps(data.response.warmup);
    const show = currentSlide === warmupId;

    const handleCLick = () =>
        manageTransition({
            state,
            dispatch,
            payload:{
                case:"NEXT_SLIDE"
            }
        });

    return(
        <>
            <div className={classnames(
                sharedClasses.item,
                sharedClasses.showOverlay,
                (show ? 'active':'')
            )}>
                <Header/>
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
                                    dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(content, { ADD_ATTR: ['target'] })}}/>

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

                    <Button onClick={ handleCLick }>
                        {languageBundle && languageBundle.btnQuestion}
                    </Button>
                </div>
            </div>
            {/*{childNodes.map( node =>*/}
            {/*    <Qna*/}
            {/*        key={node.id}*/}
            {/*        id={node.id}*/}
            {/*    />*/}
            {/*)}*/}
        </>
    );
}

Warmup.propTypes={
    id:PropTypes.string.isRequired
}

export default Warmup;
