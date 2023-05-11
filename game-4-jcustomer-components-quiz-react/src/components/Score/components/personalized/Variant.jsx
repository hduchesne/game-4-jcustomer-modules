import React from 'react';
import PropTypes from "prop-types";
import {JahiaCtx} from "contexts";
import {Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import classnames from "clsx";
import cssSharedClasses from "components/cssSharedClasses";
import {CxsCtx} from "unomi/cxs";

import CircularProgress from '@material-ui/core/CircularProgress';
import {GetPersonalizedScoreVariant} from "webappGraphql";
import {useLazyQuery} from "@apollo/client";
import DOMPurify from "dompurify";
import {EmbeddedPathInHtmlResolver} from "components/Jahia";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(theme => ({
    // result:{
    //     marginTop: `${theme.spacing(4)}px`,
    // },
    personalizedArea:{
        padding:`${theme.spacing(4)}px 0`
    }
}));

export const Variant = (props) => {
    const { t } = useTranslation();
    const { workspace, locale } = React.useContext(JahiaCtx);
    const cxs = React.useContext(CxsCtx);

    const sharedClasses = cssSharedClasses(props);
    const classes = useStyles(props);

    const { personalizedResultId } = props;


    const [loadVariant, variantQuery] = useLazyQuery(GetPersonalizedScoreVariant);


//wait 1s before to call jExp in order to have time to synch user profile with answer
    React.useEffect(() => {
        if(personalizedResultId && cxs)
            setTimeout(
                () => loadVariant({
                    variables: {
                        workspace,
                        language:locale,
                        id:personalizedResultId,
                        profileId:cxs.profileId,
                        sessionId:cxs.sessionId,

                    },
                    fetchPolicy: "no-cache"
                }),
                1000
            );
    },[loadVariant,locale,workspace, personalizedResultId, cxs])

    if (!variantQuery.data || variantQuery.loading)
        return (
            <div className={classnames(
                classes.personalizedArea
            )}>
                <Typography
                    className={classnames(
                        sharedClasses.wait,
                        sharedClasses.textUppercase
                    )}
                    variant="body2"
                >
                    {t("loading.personalizedScore")}
                </Typography>
                <CircularProgress/>
            </div>
        );
    if (variantQuery.error) return <p>Error getting your result :(</p>;

    const { variant } = variantQuery.data.response?.result?.jExperience?.resolve;

    return(
        <Typography className={classes.personalizedArea}
                    component="div"
                    children={<EmbeddedPathInHtmlResolver htmlAsString={DOMPurify.sanitize(variant.text.value, { ADD_ATTR: ['target'] })} />}/>
    );

}

Variant.propTypes={
    personalizedResultId:PropTypes.string.isRequired
}
