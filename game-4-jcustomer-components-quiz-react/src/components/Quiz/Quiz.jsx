import React from 'react';
// import PropTypes from "prop-types";

import {Button,Typography} from "@material-ui/core";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import {makeStyles} from "@material-ui/core/styles";

import {StoreCtx, AppCtx, JahiaCtx} from "contexts";
import {useMarketo} from "components";

import {Media} from '../Media'
import classnames from "clsx";
import cssSharedClasses from "components/cssSharedClasses";
import {manageTransition} from "misc/utils";
import {CxsCtx} from "unomi/cxs";
import {EmbeddedPathInHtmlResolver} from "components/Jahia";
import {useTranslation} from "react-i18next";
import InfoIcon from "@material-ui/icons/Info";

const useStyles = makeStyles(theme => ({
    duration:{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
        '& svg': {
            marginRight: '3px',
        },
        marginTop:`${theme.spacing(3)}px`,
    },
    description:{
        // textAlign: 'left',
        maxWidth:'500px',
        margin:`${theme.spacing(4)}px auto`,

    },
    editInfo:{
        color:theme.palette.warning.dark,
    },
    cxsError:{
        backgroundColor:theme.palette.error.dark,
        borderRadius:'3px',
        display: 'inline',
        padding: '5px 10px'
    }
}));

const MktoForm = (props) => {

    // const { baseUrl, munchkinId, formId } = props;
    const { formId } = props;
    useMarketo(props);
    return <form id={`mktoForm_${formId}`} />;
}

export const Quiz = (props) => {
    const { t } = useTranslation();
    const classes = useStyles(props);
    const sharedClasses = cssSharedClasses(props);
    const cxs = React.useContext(CxsCtx);
    const { isEdit } =React.useContext(JahiaCtx);
    const { transitionIsEnabled, transitionTimeout, mktgFormEnum, languageBundle } = React.useContext(AppCtx);

    const {id, title, subtitle, duration, description, media, mktgForm, mktoConfig} = props;

    const { state, dispatch } = React.useContext(StoreCtx);

    const {
        showNext,
        currentSlide,
    } = state;

    const show = currentSlide === id;

    const onClick = () => {
        manageTransition({
            transitionIsEnabled,
            transitionTimeout,
            dispatch,
            payload:{
                case:"NEXT_SLIDE"
            }
        });

    };
    const handleMktoFormSuccess = (values,targetPageUrl) =>{
        // console.debug("[handleMktoFormSuccess] values : ",values);
        manageTransition({
            transitionIsEnabled,
            transitionTimeout,
            dispatch,
            payload:{
                case:"NEXT_SLIDE"
            }
        });
        return false;
    }

    const handleMktoForm = (form) =>{
        form.addHiddenFields({
            'pageURL' : document.location.href,
            'cxsProfileId' : window.cxs?.profileId,
        });
        form.onSuccess(handleMktoFormSuccess);
    }

    const getStartComponent = () => {

        if(isEdit)
            return(
                <Typography component="div"
                            className={classnames(
                                classes.editInfo,
                                classes.description
                            )}>
                    <InfoIcon/> < br/>
                    {t("rendering.app.noStart")}
                </Typography>
            );

        const _cxs = window.cxs || false;

        if(!cxs &&
            _cxs.constructor === Object &&
            Object.keys(_cxs).length === 0)
            return <Typography className={classes.cxsError}
                               component="h5">
                {t("error.jExp.connexion")}
            </Typography>

        if(!mktgForm)
            return <Button onClick={onClick}
                           disabled={!showNext}>
                {languageBundle && languageBundle.btnStart}
            </Button>

        if(mktgForm === mktgFormEnum.MARKETO && mktoConfig && cxs)
            return <MktoForm
                baseUrl={mktoConfig.baseUrl}
                munchkinId={mktoConfig.munchkinId}
                formId={mktoConfig.formId}
                whenReadyCallback={handleMktoForm}
            />
    }

    return(
        <div className={classnames(
            sharedClasses.item,
            sharedClasses.showOverlay,
            (show ? 'active':'')
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

                <Typography component="div"
                            className={classes.duration}>
                    <AccessTimeIcon />
                    {duration}
                </Typography>

                <Typography component="div"
                            className={classes.description}
                            children={<EmbeddedPathInHtmlResolver htmlAsString={description} />}/>

                {getStartComponent()}
            </div>
        </div>
    );
}
