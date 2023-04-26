import React from 'react';
import {AppCtx, StoreCtx} from "contexts";

import {Media} from "components";
import Personalized from "components/Score/personalized/Personalized";
import Percentage from "components/Score/percentage/Percentage";
import cssSharedClasses from "components/cssSharedClasses";
import classnames from "clsx";
import {Typography,Button} from "@material-ui/core";
import {CxsCtx} from "unomi/cxs";
import {manageTransition} from "misc/utils";

export const Score = (props) => {
    const {media, title, subtitle, personalizedResult} = props;
    const sharedClasses = cssSharedClasses(props);
    const cxs = React.useContext(CxsCtx);
    const { transitionIsEnabled, transitionTimeout, resetBtnIsEnabled, languageBundle } = React.useContext(AppCtx);

    const { state,dispatch } = React.useContext(StoreCtx);
    const [timer, setTimer] = React.useState(false);
    const {
        currentSlide,
        score,
        scoreIndex
    } = state;

    const show = currentSlide === scoreIndex;
//wait 1s before to call jExp in order to have time to synch user profile with answer
    React.useEffect(() => {
        if(personalizedResult.id)
            setTimeout(
                () => setTimer(true),
                1000
            );
    },[])

    //TODO review this
    const onClick = () => {
        manageTransition({
            transitionIsEnabled,
            transitionTimeout,
            dispatch,
            payload:{
                case:"RESET"
            }
        });

        // if(transitionIsEnabled){
        //     dispatch({
        //         case:"TOGGLE_TRANSITION"
        //     });
        //     setTimeout(()=>dispatch({
        //         case:"TOGGLE_TRANSITION"
        //     }),transitionTimeout);
        //     setTimeout(()=>dispatch({
        //         case:"RESET"
        //     }),transitionTimeout);
        // }else{
        //     dispatch({
        //         case:"RESET"
        //     })
        // }
    }
    const displayResult = () => {
        if(personalizedResult.id){
            if(cxs && timer)
                return <Personalized id={personalizedResult.id} cxs={cxs}/>
            return <Typography className={classnames(
                        sharedClasses.wait,
                        sharedClasses.textUppercase)}
                               variant="body2">
                        score calculation in progress...
                    </Typography>
        }
        return <Percentage score={score}/>
    }

    const getResetBtn = () => {
        if(!resetBtnIsEnabled)
            return;

        return <Button onClick={onClick}>
            {languageBundle && languageBundle.btnReset}
        </Button>
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

                {displayResult()}

                {getResetBtn()}
            </div>
        </div>
    );

}

// Personalized.propTypes={}

export default Score;
