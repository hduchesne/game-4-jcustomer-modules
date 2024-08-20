import React from 'react';
import PropTypes from "prop-types";

import {useQuery} from "@apollo/client";

import {AppCtx, JahiaCtx, StoreCtx} from "contexts";

import {GetQnA} from "webappGraphql";
import {Answer} from "./Answer";

import {formatQnaJcrProps} from "components/Qna/QnaModel";
import {syncVisitorData} from "misc/trackerWem";
import {Media} from "components/Media";
import cssSharedClasses from "components/cssSharedClasses";
import classnames from "clsx";
import {FormGroup, Typography,Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {manageTransition} from "misc/utils";
import {Loading} from "components/Loading";


const useStyles = makeStyles(theme => ({
    questionGroup:{
        textAlign:'left',
        marginTop: `${theme.spacing(2)}px`,
        marginBottom: `${theme.spacing(4)}px`,
    },
    question:{
        marginBottom: `${theme.spacing(2)}px`,
    },
    formGroup: {
        textAlign:'left',
        "& > div::before":{
            flexBasis:'100%',
            content:'""',
            height: '2px',
            marginLeft : '50px',
            borderTop: '2px solid rgba(255,255,255,.2)',
        },
        "&  > div:first-child::before":{
            borderTop: 'none',
        },
        "&  > div:last-child::after":{
            flexBasis:'100%',
            content:'""',
            height: '2px',
            marginLeft : '50px',
            borderBottom: '2px solid rgba(255,255,255,.2)',
        },
        marginBottom:`${theme.spacing(4)}px`
    },
}));


const initialQNA = {
    enableSubmit:false,
}

const reducer = (qna, action) => {
    const { payload } = action;

    switch (action.case) {
        case "DATA_READY": {
            // const {qnaData,quiz_validMark} = payload;
            const {qnaJcrProps} = payload;
            return {
                ...qna,
                ...formatQnaJcrProps(qnaJcrProps)
            }
        }
        case "TOGGLE_ANSWER": {
            const {answer} = payload;//answer id
            // console.debug("[STORE QNA] TOGGLE_ANSWER -> answer :",answer);
            let {answers} = qna;
            if(qna.inputType === "radio")
                answers = answers.map( answer =>({...answer,checked:false}) );

            answers = answers.map(_answer => {
                if(_answer.id === answer.id)
                    return {
                        ..._answer,
                        checked:!_answer.checked
                    };
                return _answer
            });
            const enableSubmit = answers.filter(answer => answer.checked).length > 0

            return{
                ...qna,
                answers,
                enableSubmit
            }
        }
        case "RESET":{
            const {qnaJcrProps} = payload;
            return{
                ...initialQNA,
                ...formatQnaJcrProps(qnaJcrProps)
            }
        }
        default:
            throw new Error(`[STORE QNA] action case '${action.case}' is unknown `);
    };
}

export const Qna = (props) => {
    const classes = useStyles(props);
    const sharedClasses = cssSharedClasses(props);
    const { id : qnaId, persoId } = props;
    const { workspace, locale, isPreview } = React.useContext(JahiaCtx);
    const { transitionIsEnabled, transitionTimeout, languageBundle } = React.useContext(AppCtx);
    const { state, dispatch } = React.useContext(StoreCtx);

    const {
        currentSlide,
        reset
    } = state;
    const show = currentSlide === qnaId || currentSlide === persoId;

    const {loading, error, data} = useQuery(GetQnA, {
        variables:{
            workspace,
            language:locale,
            id:qnaId
        },
        skip:!qnaId
    });

    const [qna, qnaDispatch] = React.useReducer(
        reducer,
        initialQNA
    );

    React.useEffect(() => {
        if(loading === false && data){
            const qnaJcrProps = data?.response?.qna || {};
            qnaDispatch({
                case:"DATA_READY",
                payload:{
                    qnaJcrProps
                }
            });
        }
    }, [loading,data]);

    React.useEffect(() => {
        if(reset && data){
            const qnaJcrProps = data?.response?.qna || {};
            qnaDispatch({
                case:"RESET",
                payload:{
                    qnaJcrProps
                }
            });
        }
    }, [reset,data]);

    if (loading) return <Loading show={show} msg="loading.question"/>;
    if (error) return <p>Error :(</p>;



    const handleSubmit = () => {

        // console.debug("[handleSubmit] qna.jExpField2Map => ",qna.jExpField2Map);
        if(qna.jExpField2Map){
            //Get response cdpValue
            //Note case multiple is manage by comma separated case
            const values =
                qna.answers
                .filter(answer => answer.checked)
                .reduce(
                    (item,answer,index) =>{
                        if(answer.cdpValue && answer.cdpValue.length > 0) {
                            if (index === 0) {
                                item = answer.cdpValue
                            } else {
                                item = `${item}, ${answer.cdpValue}`
                            }
                        }
                        return item;
                    },null
                );
            // console.debug("[handleSubmit] update : ",qna.jExpField2Map," with values : ",values);

            //if tracker is not initialized the track event is not send
            if(!isPreview)
                syncVisitorData({
                    qna:{
                        id:qna.id,
                        type:qna.type,
                        title:qna.title
                    },
                    propertyName: qna.jExpField2Map,
                    propertyValue:values
                })
        }

        const payload = {
            case:"SHOW_RESULT",
            payload:{
                isPreview,
                skipScore:qna.notUsedForScore,
                result: qna.notUsedForScore ? null : qna.answers
                    .filter(answer => answer.isAnswer)
                    .reduce( (test,answer) => test && answer.checked,true)
            }
        }

        if(qna.notUsedForScore){
            manageTransition({
                transitionIsEnabled,
                transitionTimeout,
                dispatch,
                payload
            });
        }else{
            dispatch(payload);
        }
    }

    const getAnswers = () => {
        if(qna.answers)
            return qna.answers.map( answer =>
                <Answer
                    key={answer.id}
                    id={answer.id}
                    qna={qna}
                    qnaDispatch={qnaDispatch}
                />);
    }

    return(
        <div className={classnames(
            sharedClasses.item,
            sharedClasses.showOverlay,
            (show ? 'active':'')
        )}>
            {qna.media &&
                <Media id={qna.media.id}
                       types={qna.media.types}
                       path={qna.media.path}
                       alt={qna.title}
                />
            }
            <div className={sharedClasses.caption}>
                <div className={classes.questionGroup}>
                    <Typography  className={classes.question}
                                 variant="h4">
                        {qna.question}
                    </Typography>
                    <Typography variant="h5">
                        {qna.help}
                    </Typography>
                </div>

                <FormGroup className={classes.formGroup}
                           style={{}}
                           aria-label="answer">
                    {getAnswers()}
                </FormGroup>

                <Button onClick={handleSubmit}
                        disabled={!qna.enableSubmit}>
                    {languageBundle && languageBundle.btnSubmit}
                </Button>
            </div>
        </div>
    );
}

Qna.propTypes={
    id:PropTypes.string.isRequired,
    persoId: PropTypes.string
}
