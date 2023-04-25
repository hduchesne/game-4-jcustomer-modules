import React from "react";
import {StoreCtxProvider} from "contexts";

import {getRandomString} from "misc/utils";
import {syncQuizScore} from "misc/tracker";
import QuizMapper from "components/Quiz/QuizModel";
import {consentStatus, mktgForm} from "douane/lib/config";

const init = ({quizData}) => {
    // console.log("jContent.transition : ",jContent.transition);
    const scoreIndex = getRandomString(5,"#aA");
    const {childNodes = [],key : quizKey} = quizData.quizContent;

    const slideSet = [quizData.id];
    childNodes.forEach(node => slideSet.push(node.id));
    slideSet.push(scoreIndex);

    const max = slideSet.length -1;

    return {
        quizKey,
        resultSet:[],//array of boolean, order is the same a slideSet
        currentResult:false,//previously result
        slideSet,//[],//previously slideIndex
        currentSlide:quizData.id,//null,//previously index
        showResult:false,
        showNext:false,
        showScore:false,
        max,
        score:0,
        reset:false,
        transitionActive:false,
        scoreIndex,
        scoreSplitPattern:"::"
    }
}

const reducer = (state, action) => {
    const { payload } = action;

    const showNext = ({slideSet,max,slide}) =>
        slideSet.indexOf(slide) < max;

    const getScore = ({resultSet,quizKey,split}) =>{

        let score = 100;
        if( resultSet.length>0){
            const goodAnswers = resultSet.filter(result => result).length;
            const answers = resultSet.length;
            score = Math.floor((goodAnswers/answers)*100);
        }

        //TODO
        //wait 500ms before to call jExp in order to have time to synch user profile with answer
        // setTimeout(
        //     () => syncQuizScore({
        //         quizKey,
        //         split,
        //         quizScore:score
        //     }),
        //     500
        // );


        return score;
    }

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

            const max = slideSet.length -1;

            // console.debug("[STORE] ADD_SLIDE - slides: ",slides," parentSlide: ",parentSlide);
            return {
                ...state,
                slideSet,
                showNext:showNext({slideSet,max,slide:state.currentSlide}),
                max
            };
        }
        case "NEXT_SLIDE":{
            const currentIndex = state.slideSet.indexOf(state.currentSlide);
            const nextIndex = currentIndex+1;
            // console.debug("[STORE] NEXT_SLIDE - currentIndex: ",currentIndex,", max : ",state.max);

            let nextSlide = state.currentSlide;

            if(currentIndex  < state.max )
                nextSlide = state.slideSet[nextIndex];

            // const showScore = nextIndex === state.max-1;

            return {
                ...state,
                currentSlide:nextSlide,
                showNext: showNext({...state,slide:nextSlide}),
                showResult:false,
                // showScore,
                // score,
                reset:false,
            };
        }
        case "SHOW_SCORE": {
            // console.debug("[STORE] SHOW_SCORE");
            const [slide] = state.slideSet.slice(-1);
            // const {quiz} = state;
            let {score} = state;

            // if(!quiz.personalizedResult || !quiz.personalizedResult.id)
                score = getScore({
                    resultSet:state.resultSet,
                    quizKey:state.quizKey,
                    split:state.scoreSplitPattern
                });

            return {
                ...state,
                currentSlide: slide,
                showNext: showNext({...state, slide}),
                showResult:false,
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
            const {result:currentResult,skipScore} = payload;
            const currentIndex = state.slideSet.indexOf(state.currentSlide);
            const nextIndex = currentIndex+1;
            const showScore = nextIndex === state.max;

            // console.debug("[STORE] SHOW_RESULT - currentResult: ", currentResult);

            const resultSet = currentResult !== null ? [...state.resultSet, currentResult]:[...state.resultSet];
            // const {quiz} = state;
            let {score,currentSlide:nextSlide} = state;

            if(skipScore) {
                if(showScore){
                    // if(!quiz.personalizedResult || !quiz.personalizedResult.id)
                            score = getScore({
                            resultSet: resultSet,
                            quizKey: state.quizKey,
                            split: state.scoreSplitPattern
                        });
                    [nextSlide] = state.slideSet.slice(-1);
                }else{
                    nextSlide=state.slideSet[nextIndex]
                }
            }

            return {
                ...state,
                currentSlide:nextSlide,
                showNext: showNext({...state,slide:nextSlide}),
                showScore,
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
                currentSlide,
                resultSet:[],
                showScore:false,
                currentResult:false,
                reset:true
            }
        }
        case "TOGGLE_TRANSITION": {
            // console.debug("[STORE] TOGGLE_TRANSITION");
            return {
                ...state,
                transitionActive:!state.transitionActive
            }
        }
        default:
            throw new Error(`[STORE] action case '${action.case}' is unknown `);
    };
}

export const Store = props => {
    const {quizData} = props;
    const [state, dispatch] = React.useReducer(
        reducer,
        {quizData},
        init
    );
    return (
        <StoreCtxProvider value={{ state, dispatch }}>
            {props.children}
        </StoreCtxProvider>
    );
};
