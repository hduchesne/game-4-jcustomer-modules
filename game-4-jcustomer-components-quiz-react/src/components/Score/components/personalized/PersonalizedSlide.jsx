import React from 'react';
import PropTypes from "prop-types";
import {AppCtx, JahiaCtx} from "contexts";
import {Button, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import InfoIcon from '@material-ui/icons/Info';
import classnames from "clsx";
import cssSharedClasses from "components/cssSharedClasses";

import {Media} from "components/Media";
import {GetPersonalizedScoreNode} from "webappGraphql";
import {useQuery} from "@apollo/client";
import {formatPersoResultJcrProps} from "./PersoResultModel";
import {Variant} from "./Variant";
import {Loading} from "components/Loading";
import {EmbeddedPathInHtmlResolver} from "components/Jahia";
import {useTranslation} from "react-i18next";


const useStyles = makeStyles(theme => ({
    content:{
        // textAlign: 'left',
        maxWidth:'500px',
        margin:`${theme.spacing(4)}px auto 0`,

    },
}));

export const PersonalizedSlide = (props) => {
    const { t } = useTranslation();
    const { workspace, locale, previewCm } = React.useContext(JahiaCtx);

    const sharedClasses = cssSharedClasses(props);
    const classes = useStyles(props);

    const { personalizedResultId, onClick, quizContent } = props;
    const { resetBtnIsEnabled, languageBundle } = React.useContext(AppCtx);


    const {loading, error, data} = useQuery(GetPersonalizedScoreNode, {
        variables:{
            workspace,
            language:locale,
            id:personalizedResultId
        },
        skip:!personalizedResultId
    });

    if (loading) return <Loading show={true} msg="loading.score"/>;;
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
                            children={<EmbeddedPathInHtmlResolver htmlAsString={content} />}/>

                {!previewCm &&
                    <Variant personalizedResultId={personalizedResultId}/>
                }

                {previewCm &&
                    <>

                        <Typography component="div"
                                    className={classes.content}>
                            <InfoIcon/> < br/>
                            {t("rendering.perso.notRendered")}
                        </Typography>
                    </>
                }


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
