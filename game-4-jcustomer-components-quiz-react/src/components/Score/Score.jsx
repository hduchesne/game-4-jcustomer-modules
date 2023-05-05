import React from 'react';
import {AppCtx, StoreCtx} from "contexts";

import {Percentage, PersonalizedSlide} from "components/Score/components";
import cssSharedClasses from "components/cssSharedClasses";
import classnames from "clsx";

import {manageTransition} from "misc/utils";

export const Score = (props) => {
    const { state,dispatch } = React.useContext(StoreCtx);

    const sharedClasses = cssSharedClasses(props);
    const { media, title, subtitle, scorePerso } = props;
    const { transitionIsEnabled, transitionTimeout } = React.useContext(AppCtx);
    const personalizedResultId = scorePerso?.uuid;

    const {
        currentSlide,
        scoreId
    } = state;

    const show = currentSlide === scoreId;

    const onClick = () => {
        manageTransition({
            transitionIsEnabled,
            transitionTimeout,
            dispatch,
            payload:{
                case:"RESET"
            }
        });
    }

    return(
        <div className={classnames(
            sharedClasses.item,
            sharedClasses.showOverlay,
            (show ? 'active':'')
        )}>
            {personalizedResultId &&
                <PersonalizedSlide personalizedResultId={personalizedResultId} onClick={onClick} quizContent={{title,subtitle,media}}/>
            }
            {!personalizedResultId &&
                <Percentage media={media} title={title} subtitle={subtitle} onClick={onClick}/>
            }
        </div>
    );

}

// Personalized.propTypes={}

export default Score;
