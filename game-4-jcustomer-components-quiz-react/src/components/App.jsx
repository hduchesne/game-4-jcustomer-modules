import React, {useContext, useMemo} from 'react';
// import PropTypes from "prop-types";

import {Grid,Typography} from '@material-ui/core';
import {useQuery} from "@apollo/client";
import {CxsCtx} from "../unomi/cxs";
import {JahiaCtx, StoreCtx} from "../contexts";



import {GetQuiz} from "../webappGraphql/quiz.gql-query.js";

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
import {formatQuizJcrProps} from "components/Quiz/QuizModel";

const useStyles = makeStyles(theme => ({
    main: {
        position: "relative",
        "& *, &::after, &::before":{
            boxSizing:"border-box",
        }
    },
}));




export const App = (props)=> {
    const classes = useStyles(props);
    const cxs = useContext(CxsCtx);
    const { workspace,locale, quizId, cndTypes } = useContext(JahiaCtx);

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


    // const {id = null, types: quizTypes = null, quizContent = null, quizConfig = null, languageBundle = null} = useMemo(() => {
    //     // if(loading === false && data){
    //     if(data){
    //         const quizData = formatQuizJcrProps(data.response.quiz);
    //         dispatch({
    //             case:"DATA_READY",
    //             payload:{
    //                 quizData
    //             }
    //         });
    //         return quizData
    //     }
    // },[data] /*[loading,data]*/);

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

    const quizData = formatQuizJcrProps(data.response.quiz);
    const {
        id = null,
        types: quizTypes = null,
        quizContent = null,
        quizConfig = null,
        languageBundle = null
    } = quizData

    dispatch({
        case:"DATA_READY",
        payload:{
            quizData
        }
    });

    const displayScore=()=>{
        if(showScore)
            return <Score/>
    }

    return (
        <ThemeProvider theme={theme(quizConfig?.userTheme)}>
        <Grid container spacing={3}>
            <Grid item xs style={{margin:'auto'}}>

                <div className={classnames(
                    classes.main,
                    (showResult?'showResult':'')
                )}>
                    <Transition/>
                    Hello world
                    {/*{quizContent &&*/}
                    {/*    <>*/}
                    {/*        <Quiz*/}
                    {/*            key={quizContent.id}*/}
                    {/*            data={quizContent}*/}
                    {/*        />*/}
                    {/*        {quizContent.childNodes.map( node => {*/}
                    {/*            if(node.types.include(cndTypes.QNA))*/}
                    {/*                return <Qna*/}
                    {/*                    key={node.id}*/}
                    {/*                    id={node.id}*/}
                    {/*                />*/}

                    {/*            if(node.types.include(cndTypes.WARMUP))*/}
                    {/*                return <Warmup*/}
                    {/*                    key={node.id}*/}
                    {/*                    id={node.id}*/}
                    {/*                />*/}
                    {/*            return <Typography color="error"*/}
                    {/*                               component="p">*/}
                    {/*                node type {node.types} is not supported*/}
                    {/*            </Typography>*/}

                    {/*        })*/}
                    {/*        }*/}
                    {/*        {displayScore()}*/}
                    {/*    </>*/}
                    {/*}*/}
                </div>
            </Grid>
        </Grid>
        </ThemeProvider>
    );
};

App.propTypes={}
