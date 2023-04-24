import React from 'react';
// import PropTypes from "prop-types";

import {Button,Typography} from "@material-ui/core";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import {makeStyles} from "@material-ui/core/styles";

import {JahiaCtx, StoreCtx, AppCtx} from "contexts";
import {Consent} from "components/Consent";
import get from "lodash.get";

import {syncConsentStatus} from "misc/tracker";
import {Media} from '../Media'
import classnames from "clsx";
import cssSharedClasses from "components/cssSharedClasses";
import DOMPurify from "dompurify";
import Header from "components/Header/Header";
import {manageTransition} from "misc/utils";
import useMarketo from "components/Marketo/LoadScript";
import {CxsCtx} from "unomi/cxs";
import {consentStatus, consentStatusEnum, mktgFormEnum} from "douane/lib/config";
// import {mktgForm} from "douane/lib/config";

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
    consent:{
        width:'100%',
        paddingRight:`${theme.spacing(4)}px`,
        paddingLeft:`${theme.spacing(4)}px`,
        zIndex: 3,//10,
        "& ul":{
            listStyle: 'none',
            padding:0,
        },
        "& li":{
            marginBottom: '.5rem'
        }
    },
    consentTitle:{
        textTransform:'capitalize',
        textDecoration:'underline'
    },
    cxsError:{
        backgroundColor:theme.palette.error.dark,
        borderRadius:'3px',
        display: 'inline',
        padding: '5px 10px'
    }
}));

const init = variables =>{
    return {
        ...variables,
        consents:[]//list of consent
    }
}

const computeEnableStartBtn = (state) => {
    const {showNext,workspace,consents} = state;

    if(showNext && workspace !== "LIVE")
        return true;

    const granted = consents.filter( consent => consent.checked || consent.granted );
    return consents.length === granted.length;
}

function reducer(state, action) {
    const { payload } = action;

    switch (action.case) {
        case "DATA_READY_CONSENT":{
            let {consents} = state;
            const {consentData,scope,cxs,consentStatus} = payload;
            console.debug("[QUIZ] DATA_READY_CONSENT -> consentData :",consentData);

            const identifier = get(consentData, "identifier");

            //compute granted
            const consentPath = `consents["${scope}/${identifier}"]`;
            const cxsConsentStatus = get(cxs,`${consentPath}.status`);
            const cxsConsentRevokeDate = get(cxs,`${consentPath}.revokeDate`);
            const granted = consentStatus.GRANTED === cxsConsentStatus
                && Date.now() < Date.parse(cxsConsentRevokeDate)

            consents = [...consents,{
                id : get(consentData, "id"),
                title : get(consentData, "title"),
                description : get(consentData, "description.value"),
                actived : JSON.parse(get(consentData, "actived.value", false)),
                checked : false,
                identifier,
                granted
            }];

            return{
                ...state,
                consents,
                enableStartBtn:computeEnableStartBtn({...state,consents})
            }
        }
        case "DENIED_CONSENT":{
            const {consents} = state;
            const {id} = payload;
            // console.debug("[QUIZ] DENIED_CONSENT -> id :",id);

            return{
                ...state,
                consents:consents.map( consent => {
                    if( consent.id === id)
                        return {
                            ...consent,
                            granted:false
                        };
                    return consent
                }),
                enableStartBtn:false
            }
        }
        case "TOGGLE_CONSENT": {
            let {consents} = state;
            const {id} = payload;
            // console.debug("[QUIZ] TOGGLE_CONSENT -> id :",id);

            consents = consents.map(consent => {
                if(consent.id === id)
                    return {
                        ...consent,
                        checked:!consent.checked
                    };
                return consent
            });

            return{
                ...state,
                consents,
                enableStartBtn:computeEnableStartBtn({...state,consents})
            }
        }
        default:
            throw new Error(`[QUIZ] action case '${action.case}' is unknown `);
    }
}

const MktoForm = (props) => {

    // const { baseUrl, munchkinId, formId } = props;
    const { formId } = props;
    useMarketo(props);
    return <form id={`mktoForm_${formId}`} />;
}

const Quiz = (props) => {
    const classes = useStyles(props);
    const sharedClasses = cssSharedClasses(props);
    const cxs = React.useContext(CxsCtx);
    const { workspace, locale, cndTypes } = React.useContext(JahiaCtx);
    const { scope, consentStatusEnum, mktgFormEnum, languageBundle } = React.useContext(AppCtx);

    const {id, title, subtitle, duration, description, media, consents, mktgForm, mktoConfig} = props;

    const { state, dispatch } = React.useContext(StoreCtx);

    const {
        showNext,
        currentSlide,
    } = state;

    const enableStartBtn = showNext &&
        // !quiz.mktoForm &&
        consents.length > 0? workspace !== "LIVE" : true;

    const [quizState, quizDispatch] = React.useReducer(
        reducer,
        {
            enableStartBtn,//: showNext && gql_variables.workspace !== "LIVE",
            workspace,
            showNext,
        },
        init
    );

    console.debug("[DISPLAY] quiz : ",title);
    const show = currentSlide === id;

    const onClick = () => {
        quizState.consents.forEach(consent=>{
            //already granted nothing to do
            if(consent.granted)
                return;

            syncConsentStatus({
                scope,
                typeIdentifier:consent.identifier,
                status:consentStatusEnum.GRANTED
            });
        })

        manageTransition({
            state,
            dispatch,
            payload:{
                case:"NEXT_SLIDE"
            }
        });

    };
    const handleMktoFormSuccess = (values,targetPageUrl) =>{
        // console.debug("[handleMktoFormSuccess] values : ",values);
        manageTransition({
            state,
            dispatch,
            payload:{
                case:"NEXT_SLIDE"
            }
        });
        return false;
    }

    const handleMktoForm = (form,cxs) =>{
        form.addHiddenFields({
            'pageURL' : document.location.href,
            'cxsProfileId' : cxs?cxs.profileId:'',
        });
        form.onSuccess(handleMktoFormSuccess);
    }

    const getStartComponent = () => {

        const _cxs = window.cxs || false;

        if(!state.cxs &&
            _cxs.constructor === Object &&
            Object.keys(_cxs).length === 0)
            return <Typography className={classes.cxsError}
                               variant="h5">
                Internal jExperience connection issue
            </Typography>

        if(!mktgForm)
            return <Button onClick={onClick}
                           disabled={!quizState.enableStartBtn}>
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

    const getConsent = () =>{
        if(mktgForm)
            return;
        if(consents.length > 0 && cxs)
            return <div className={classes.consent}>
                        <Typography className={classes.consentTitle}
                                    variant="h5">
                            {languageBundle && languageBundle.consentTitle}
                        </Typography>
                        <ul>
                            {
                                consents.map( consent =>{
                                    if(consent.actived)
                                        return <Consent
                                            key={consent.id}
                                            id={consent.id}
                                            quizState={quizState}
                                            quizDispatch={quizDispatch}
                                        />
                                    return <></>
                                })
                            }
                        </ul>
                    </div>
    }

    return(
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

                <Typography component="div"
                            className={classes.duration}>
                    <AccessTimeIcon />
                    {duration}
                </Typography>

                <Typography component="div"
                            className={classes.description}
                            dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(description, { ADD_ATTR: ['target'] })}}/>

                {getStartComponent()}
            </div>
            {getConsent()}
        </div>
    );
}

// Quiz.propTypes={}

export default Quiz;
