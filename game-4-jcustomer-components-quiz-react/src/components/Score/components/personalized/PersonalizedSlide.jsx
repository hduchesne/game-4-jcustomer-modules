import React from 'react';
import PropTypes from "prop-types";
import {AppCtx, JahiaCtx} from "contexts";
import {Button, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import classnames from "clsx";
import cssSharedClasses from "components/cssSharedClasses";

import {Media} from "components/Media";
import {GetPersonalizedSlideContent} from "webappGraphql";
import {useQuery} from "@apollo/client";
import {formatPersoResultJcrProps} from "./PersoResultModel";
import {Variant} from "./Variant";
import DOMPurify from "dompurify";

const useStyles = makeStyles(theme => ({
    content:{
        // textAlign: 'left',
        maxWidth:'500px',
        margin:`${theme.spacing(4)}px auto`,

    },
}));

export const PersonalizedSlide = (props) => {
    const { workspace, locale, isPreview } = React.useContext(JahiaCtx);

    const sharedClasses = cssSharedClasses(props);
    const classes = useStyles(props);

    const { personalizedResultId, onClick, quizContent } = props;
    const { resetBtnIsEnabled, languageBundle } = React.useContext(AppCtx);


    const {loading, error, data} = useQuery(GetPersonalizedSlideContent, {
        variables:{
            workspace,
            language:locale,
            id:personalizedResultId
        },
        skip:!personalizedResultId
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const {
        media = quizContent.media,
        title = quizContent.title,
        subtitle = quizContent.subtitle,
        content
    } = formatPersoResultJcrProps(data.response.persoResultContent);

    return(
        <>
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

                <Typography component="div"
                            className={classes.content}
                            dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(content, { ADD_ATTR: ['target'] })}}/>

                <Variant personalizedResultId={personalizedResultId}/>

                {resetBtnIsEnabled &&
                <Button onClick={onClick}>
                    {languageBundle && languageBundle.btnReset}
                </Button>
                }
            </div>
        </>
    );

}

PersonalizedSlide.propTypes={
    personalizedResultId:PropTypes.string.isRequired,
    onClick:PropTypes.func.isRequired,
    quizContent:PropTypes.object.isRequired
}
