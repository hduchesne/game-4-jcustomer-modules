import React from "react";
import {StoreCtxProvider} from "contexts";

import {getRandomString} from "misc/utils";
import {syncQuizScore} from "misc/trackerWem";


const showNext = ({slideSet,slide}) =>
    slideSet.indexOf(slide) < slideSet.length;//-1 ?

const getScore = ({resultSet,quiz,isPreview}) =>{

    let score = 100;
    if( resultSet.length>0){
        const goodAnswers = resultSet.filter(result => result).length;
        const answers = resultSet.length;
        score = Math.floor((goodAnswers/answers)*100);
    }

    //wait 500ms before to call jExp in order to have time to synch user profile with answer
    if(!isPreview)
        setTimeout(
            () => syncQuizScore({
                quiz,
                score
            }),
            500
        );

    return score;
}

const init = ({quizData,focusId}) => {
    // console.log("jContent.transition : ",jContent.transition);


    const quiz = {id:quizData.id,type:quizData.type, ...quizData.quizContent}
    const {childNodes = [],scorePerso} = quiz;

    const scoreId = scorePerso?.uuid || getRandomString(5,"#aA");

    const slideSet = [quizData.id];
    childNodes.forEach(node => slideSet.push(node.id));
    slideSet.push(scoreId);

    // const max = slideSet.length -1;

    return {
        quiz,
        resultSet: [],//array of boolean, order is the same a slideSet
        currentResult: false,//previously result
        slideSet,//[],//previously slideIndex
        slideSetInit: [...slideSet],
        persoWasDone: [],
        currentSlide: focusId,//quizData.id,//null,//previously index
        showResult: false,
        showNext: showNext({slideSet, focusId}),
        showScore: focusId === scoreId,
        nextIsScore: false,
        // max,
        score: 0,
        reset: false,
        transitionActive: false,
        scoreId,
        // scoreSplitPattern:"::"
    }
}

const reducer = (state, action) => {
    const { payload } = action;

    switch (action.case) {
        case "ADD_SLIDES": {
            const slides = payload.slides;
            const parentSlide = payload.parentSlide;
            let slideSet = state.slideSet;

            if (parentSlide && slideSet.includes(parentSlide)) {
                const position = slideSet.indexOf(parentSlide) + 1;
                slideSet.splice(position, 0, ...slides);
            } else {
                slideSet = [...slideSet, ...slides];
            }

            return {
                ...state,
                slideSet,
                showNext:showNext({slideSet,slide:state.currentSlide}),
            };
        }
        case "NEXT_SLIDE":{
            const currentIndex = state.slideSet.indexOf(state.currentSlide);
            const nextIndex = currentIndex+1;

            let nextSlide = state.currentSlide;

            if(currentIndex  < (state.slideSet.length -1))
                nextSlide = state.slideSet[nextIndex];

            return {
                ...state,
                currentSlide:nextSlide,
                showNext: showNext({...state,slide:nextSlide}),
                showResult:false,
                reset:false,
            };
        }
        case "SHOW_SCORE": {
            // console.debug("[STORE] SHOW_SCORE");
            const {isPreview} = payload;
            const [slide] = state.slideSet.slice(-1);
            let {score} = state;

            score = getScore({
                resultSet:state.resultSet,
                quiz:state.quiz,
                isPreview
            });

            return {
                ...state,
                currentSlide: slide,
                showNext: showNext({...state, slide}),
                showResult:false,
                showScore:true,
                score
            };
        }
        case "SHOW_SLIDE": {
            const slide = payload.slide
            // console.debug("[STORE] SHOW_SLIDE - slide: ",slide);
            return {
                ...state,
                currentSlide: slide,
                showNext: showNext({...state, slide})
            };
        }
        case "SHOW_RESULT": {
            const {result:currentResult,skipScore,isPreview} = payload;
            const currentIndex = state.slideSet.indexOf(state.currentSlide);
            const nextIndex = currentIndex+1;
            const nextIsScore = nextIndex === (state.slideSet.length -1);

            // console.debug("[STORE] SHOW_RESULT - currentResult: ", currentResult);

            const resultSet = currentResult !== null ? [...state.resultSet, currentResult]:[...state.resultSet];
            // const {quiz} = state;
            let {score,currentSlide:nextSlide} = state;

            if(skipScore) {
                if(nextIsScore)//{
                    score = getScore({
                        resultSet: resultSet,
                        quiz: state.quiz,
                        isPreview
                    });
                //     [nextSlide] = state.slideSet.slice(-1);
                // }else{
                //     nextSlide=state.slideSet[nextIndex]
                // }
                nextSlide=state.slideSet[nextIndex]
            }

            return {
                ...state,
                currentSlide: nextSlide,
                showNext: showNext({...state, slide: nextSlide}),
                showScore: skipScore && nextIsScore,
                nextIsScore,
                resultSet,
                currentResult,
                score,
                showResult: !skipScore
            };
        }

        case "RESET": {
            // console.debug("[STORE] RESET");

            const [currentSlide] = state.slideSet.slice(0,1);
            // console.debug("[STORE] RESET slideSet",state.slideSet);

            return {
                ...state,
                showNext: showNext({...state, slide: currentSlide}),
                currentSlide,
                resultSet: [],
                showScore: false,
                nextIsScore: false,
                currentResult: false,
                reset: true,
                persoWasDone: [],
                slideSet: [...state.slideSetInit]
            }
        }
        case "TOGGLE_TRANSITION": {
            // console.debug("[STORE] TOGGLE_TRANSITION");
            return {
                ...state,
                transitionActive: !state.transitionActive
            }
        }
        case "PERSO_WAS_DONE": {
            const {persoId} = payload
            // console.debug("[STORE] SHOW_SLIDE - slide: ",slide);
            return {
                ...state,
                persoWasDone: [...state.persoWasDone, persoId]
            };
        }
        default:
            throw new Error(`[STORE] action case '${action.case}' is unknown `);
    };
}

export const Store = props => {
    const {quizData,focusId} = props;
    const [state, dispatch] = React.useReducer(
        reducer,
        {quizData,focusId},
        init
    );
    return (
        <StoreCtxProvider value={{ state, dispatch }}>
            {props.children}
        </StoreCtxProvider>
    );
};
