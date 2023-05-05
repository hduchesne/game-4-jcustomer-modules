import classnames from "clsx";
import {Media} from "components/Media";
import {Typography} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import React from "react";
import cssSharedClasses from "components/cssSharedClasses";

export const Loading = (props) => {
    const {media,show,msg} = props
    const sharedClasses = cssSharedClasses(props);

    return (
        <div className={classnames(
            sharedClasses.item,
            sharedClasses.showOverlay,
            (show ? 'active':'')
        )}>
            {media &&
            <Media id={media.id}
                   types={media.types}
                   path={media.path}
                   alt={"background"}
            />
            }
            <div className={classnames(
                sharedClasses.caption,
                sharedClasses.captionMain
            )}>
                <Typography
                    className={classnames(
                        sharedClasses.wait,
                        sharedClasses.textUppercase
                    )}
                    variant="body2"
                >
                    {msg}
                </Typography>
                <CircularProgress/>
            </div>
        </div>
    );
}
