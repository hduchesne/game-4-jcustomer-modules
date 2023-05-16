import React from 'react';
// import PropTypes from "prop-types";

import {Grid,Typography} from '@material-ui/core';
import {JahiaCtx, StoreCtx} from "../contexts";

import {Quiz, Warmup, Transition, Score, Header, Qna, ContentPerso} from "components"

import {makeStyles} from "@material-ui/core/styles";
import classnames from 'clsx';

import { ThemeProvider } from '@material-ui/core/styles';
import theme from 'components/theme';
import 'react-circular-progressbar/dist/styles.css';
import {useTranslation} from "react-i18next";
import {Preview} from "components/Preview";

const useStyles = makeStyles(theme => ({
    main: {
        paddingTop:"108px",//${theme.geometry.header.heights.min}
        marginTop:"-108px",
        position: "relative",
        "& *, &::after, &::before":{
            boxSizing:"border-box",
        },

        // ".showResult &"  :{
        //     paddingTop:`108px`//${theme.geometry.header.heights.max}
        // }
    },
}));




export const App = (props)=> {
    const { t } = useTranslation();
    const classes = useStyles(props);
    const { cndTypes, previewTarget } = React.useContext(JahiaCtx);

    const { state } = React.useContext(StoreCtx);
    const {
        currentSlide,
        showResult,
        showScore,
        persoWasDone
    } = state;

    const {quizData : {id, quizContent, quizConfig}} = props;

    const displayScore=()=>{
        if(showScore)
            return <Score {...quizContent} />
    }

    const displayPerso=(persoId)=>{
        if ((currentSlide === persoId) || persoWasDone.includes(persoId))
            return <ContentPerso
                key={persoId}
                id={persoId}
                media={quizContent.media}
            />
    }

    return (
        <ThemeProvider theme={theme(quizConfig?.userTheme)}>
        <Grid container spacing={3}>
            <Grid item xs style={{margin:'auto', position:'relative'}}
                  className={classnames((showResult?'showResult':''))}>
                <Header/>
                <div className={classnames(
                    classes.main,
                    //(showResult?'showResult':'')
                )}>
                    <Transition/>
                    {!!previewTarget && <Preview {...previewTarget} {...quizContent}/>}

                    {!previewTarget &&
                        <>
                            <Quiz id={id} {...quizContent} />

                            {quizContent.childNodes.map( node => {
                                if(node.types.includes(cndTypes.QNA))
                                    return <Qna
                                        key={node.id}
                                        id={node.id}
                                    />

                                if (node.types.includes(cndTypes.WARMUP))
                                    return <Warmup
                                        key={node.id}
                                        id={node.id}
                                    />
                                if (cndTypes.CONTENT_PERSO.some(type => node.types.includes(type)))
                                    return displayPerso(node.id)

                                return <Typography color="error"
                                                   component="p">
                                    {t("error.nodeType.notSupported")} : {node.type}
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
