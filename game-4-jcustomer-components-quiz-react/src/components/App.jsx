import React, {useContext, useMemo} from 'react';
// import PropTypes from "prop-types";

import {Grid,Typography} from '@material-ui/core';
import {useQuery} from "@apollo/client";
import {CxsCtx} from "../unomi/cxs";
import {JahiaCtx, StoreCtx} from "../contexts";



import {GetQuiz} from "../graphql/quiz.gql-query.js";

import Quiz from "components/Quiz"
import Qna from "components/Qna";
import Warmup from "components/Warmup";
import Score from "components/Score";
import {syncTracker} from "misc/trackerWem";
import {makeStyles} from "@material-ui/core/styles";
import classnames from 'clsx';

import { ThemeProvider } from '@material-ui/core/styles';
import theme from 'components/theme';
import Transition from "components/Transition";
import 'react-circular-progressbar/dist/styles.css';

const useStyles = makeStyles(theme => ({
    main: {
        position: "relative",
        "& *, &::after, &::before":{
            boxSizing:"border-box",
        }
    },
}));

const languageBundleKeys =  [
    "btnStart",
    "btnSubmit",
    "btnQuestion",
    "btnNextQuestion",
    "btnShowResults",
    "btnReset",
    "consentTitle",
    "correctAnswer",
    "wrongAnswer"
]
const initLanguageBundle = quizData => 
    languageBundleKeys.reduce((bundle,key)=>{
        bundle[key] = get(quizData,`${key}.value`);
        // console.debug("bundle: ",bundle);
        return bundle;
    },{})


export const App = (props)=> {
    const classes = useStyles(props);
    const cxs = useContext(CxsCtx);
    const { workspace,locale, quizId } = useContext(JahiaCtx);

    const { state, dispatch } = React.useContext(StoreCtx);
    const {
        showResult,
        showScore
    } = state;

    const {loading, error, data} = useQuery(GetQuiz, {
        variables:{
            workspace,
            language:locale,
            id:quizId
        }
    });


    const {languageBundle} = useMemo(()=>{
        // if(loading === false && data){
        if(data){
            return initLanguageBundle(data.response.quiz);
        }
    },[data] /*[loading,data]*/);

    // React.useEffect(() => {
    //     console.debug("[INIT] App Quiz");
    //     if(loading === false && data){
    //         console.debug("[INIT] App Quiz Data");
    //
    //         const quizData = get(data, "response.quiz", {});
    //         // const quizKey = get(quizData, "key.value");
    //
    //         jContent.language_bundle = initLanguageBundle(quizData);
    //         console.debug("[INIT] jContent.language_bundle: ",jContent.language_bundle);
    //
    //         dispatch({
    //             case:"DATA_READY",
    //             payload:{
    //                 quizData
    //             }
    //         });
    //
    //         //Init unomi tracker
    //         //TODO check window.wem and use it in case of embedded app
    //         if(jContent.gql_variables.workspace === "LIVE")
    //             syncTracker({
    //                 scope: jContent.scope,
    //                 url: jContent.cdp_endpoint,
    //                 // sessionId:`qZ-${quizKey}-${Date.now()}`,
    //                 dispatch
    //             });
    //     }
    // }, [loading,data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :  {error}</p>;

    let quizData = null;
    const quizJcrProps = data.response.quiz;
    if(quizJcrProps){
        quizData
    }
    
    
    if(data.response?.quiz?.uuid){
        dispatch({
            case:"DATA_READY",
            payload:{
                data.response.quiz
            }
        });
    }


    const displayScore=()=>{
        if(showScore)
            return <Score/>
    }

    return (
        <ThemeProvider theme={theme(quiz?quiz.userTheme:{})}>
        <Grid container spacing={3}>
            <Grid item xs style={{margin:'auto'}}>

                <div className={classnames(
                    classes.main,
                    (showResult?'showResult':'')
                )}>
                    <Transition/>
                    {quiz &&
                        <>
                        <Quiz
                            key={quiz.id}
                        />
                        {quiz.childNodes.map( (node,i) => {
                            if(node.type === jContent.cnd_type.QNA)
                                return <Qna
                                    key={node.id}
                                    id={node.id}
                                />

                            if(node.type === jContent.cnd_type.WARMUP)
                                return <Warmup
                                    key={node.id}
                                    id={node.id}
                                />
                            return <Typography color="error"
                                               component="p">
                                node type {node.type} is not supported
                            </Typography>

                        })
                        }
                        {displayScore()}

                        </>
                    }
                </div>
            </Grid>
        </Grid>
        </ThemeProvider>
    );
};

App.propTypes={}
