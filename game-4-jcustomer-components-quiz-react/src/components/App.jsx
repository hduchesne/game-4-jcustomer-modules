import React from 'react';
// import PropTypes from "prop-types";

import {Grid,Typography} from '@material-ui/core';
import {useQuery} from "@apollo/client";
import {CxsCtx} from "../unomi/cxs";
import {JahiaCtx, StoreCtx} from "../contexts";



import {GetQuiz} from "../webappGraphql/quiz.gql-query.js";

import {Quiz, Warmup, Transition, Qna, Score, Header} from "components"

import {syncTracker} from "misc/trackerWem";
import {makeStyles} from "@material-ui/core/styles";
import classnames from 'clsx';

import { ThemeProvider } from '@material-ui/core/styles';
import theme from 'components/theme';
import 'react-circular-progressbar/dist/styles.css';

const useStyles = makeStyles(theme => ({
    main: {
        paddingTop:`108px`,//${theme.geometry.header.heights.min}
        position: "relative",
        "& *, &::after, &::before":{
            boxSizing:"border-box",
        },
        //needed ?
        ".showResult &"  :{
            paddingTop:`108px`//${theme.geometry.header.heights.max}
        }
    },
}));




export const App = (props)=> {
    const classes = useStyles(props);
    const cxs = React.useContext(CxsCtx);
    const { cndTypes } = React.useContext(JahiaCtx);

    const { state } = React.useContext(StoreCtx);
    const {
        showResult,
        showScore
    } = state;

    const {quizData : {id, quizContent, quizConfig}} = props;

    const displayScore=()=>{
        if(showScore)
            return <Score {...quizContent} />
    }

    return (
        <ThemeProvider theme={theme(quizConfig?.userTheme)}>
        <Grid container spacing={3}>
            <Grid item xs style={{margin:'auto', position:'relative'}} className={classnames((showResult?'showResult':''))}>
                <Header/>
                <div className={classnames(
                    classes.main,
                    //(showResult?'showResult':'')
                )}>
                    <Transition/>
                    {quizContent &&
                        <>
                            <Quiz id={id} {...quizContent} />

                            {quizContent.childNodes.map( node => {
                                if(node.types.includes(cndTypes.QNA))
                                    return <Qna
                                        key={node.id}
                                        id={node.id}
                                    />

                                if(node.types.includes(cndTypes.WARMUP))
                                    return <Warmup
                                        key={node.id}
                                        id={node.id}
                                    />
                                return <Typography color="error"
                                                   component="p">
                                    node type {node.types} is not supported
                                </Typography>

                            })}

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
