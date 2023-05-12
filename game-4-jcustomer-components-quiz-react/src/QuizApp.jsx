import React from 'react';
import ReactDOM from 'react-dom';
import {ApolloProvider } from '@apollo/client';
import {ErrorHandler,App} from './components';

import * as serviceWorker from 'misc/serviceWorker';

import {StylesProvider, createGenerateClassName} from '@material-ui/core/styles';
import {getRandomString} from 'misc/utils';

import {contextValidator} from "douane";
import {Store} from "store";
import {JahiaCtxProvider,AppCtxProvider} from "./contexts";
import {CxsCtxProvider} from "./unomi/cxs";
import {getClient, GetQuiz} from "./webappGraphql";

import 'index.css';
import {syncTracker} from "misc/trackerWem";
import {formatQuizJcrProps} from "components/Quiz/QuizModel";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {appLanguageBundle} from "i18n/resources";

async function getQuizData ({client,workspace,locale,quizId}){
    const {data} = await client.query({
        query: GetQuiz,
        variables:{
            workspace,
            language:locale,
            id:quizId
        },
        // skip:!quizId
    });
    return formatQuizJcrProps(data.response.quiz);
}

const render= async (target,context)=>{
    try{
        // console.log("context : ",JSON.stringify(context));
        context = contextValidator(context);

        const generateClassName = createGenerateClassName({
            // disableGlobal:true,
            seed: getRandomString(8, 'aA')
        });

        // console.log("context.theme : ",context.theme);
        // console.log("typeof context.theme : ",typeof context.theme);
        const {host,workspace,isEdit,locale,quizId,gqlServerUrl,contextServerUrl,appContext, cndTypes,scope,previewCm,previewTarget} = context;
        i18n.use(initReactI18next) // passes i18n down to react-i18next
            .init({
                resources:appLanguageBundle,
                lng: locale,
                fallbackLng: "en",
                interpolation: {
                    escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
                }
            });

        const isPreview = workspace !== "LIVE";
        const client = getClient(gqlServerUrl)
        const quizData = await getQuizData({client,workspace,locale,quizId});
        const {transitionIsEnabled,transitionLabel,resetIsEnabled : resetBtnIsEnabled,browsingIsEnabled} = quizData.quizConfig;
        const focusId = previewCm && !!previewTarget ? previewTarget.id : quizData.id;

        if(workspace === "LIVE" && !window.wem){
            if(!window.digitalData)
                window.digitalData= {
                    _webapp:true,
                    scope,
                    site: {
                        siteInfo: {
                            siteID: scope
                        }
                    },
                    page: {
                        pageInfo: {
                            pageID: `WebApp Quiz`,
                            pageName: document.title,
                            pagePath: document.location.pathname,
                            destinationURL: document.location.origin + document.location.pathname,
                            language: locale,
                            categories: [],
                            tags: []
                        },
                        attributes: {
                            quizKey:quizData.quizContent.quizKey,
                            quizPath:quizData.path
                        },
                        consentTypes: []
                    },
                    events: [],
                    // loadCallbacks:[{
                    //     priority:5,
                    //     name:'Unomi tracker context loaded',
                    //     execute: () => {
                    //         window.cxs = window.wem.getLoadedContext();
                    //     }
                    // }],
                    wemInitConfig: {
                        contextServerUrl,
                        timeoutInMilliseconds: "1500",
                        // contextServerCookieName: "context-profile-id",
                        activateWem: true,
                        // trackerProfileIdCookieName: "wem-profile-id",
                        trackerSessionIdCookieName: "wem-session-id"
                    }
                }
            window.wem = syncTracker();
        }


        ReactDOM.render(
            // <React.StrictMode>
                <StylesProvider generateClassName={generateClassName}>
                    <JahiaCtxProvider value={{
                        workspace,
                        locale,
                        quizId:quizData.id,
                        quizPath:quizData.path,
                        quizType:quizData.type,
                        host,
                        isEdit,
                        contextServerUrl,
                        cndTypes,
                        previewCm,
                        previewTarget,
                        isPreview
                    }}>
                        <Store quizData={quizData} focusId={focusId}>
                            <ApolloProvider client={client}>
                                {/*<ThemeProvider theme={theme(context.theme)}>*/}
                                <div style={{overflow:'hidden'}}>
                                    <CxsCtxProvider>
                                        <AppCtxProvider value={{
                                            languageBundle:quizData.languageBundle,
                                            ...appContext,
                                            transitionIsEnabled,
                                            transitionLabel,
                                            transitionTimeout:1000,
                                            resetBtnIsEnabled,
                                            browsingIsEnabled: (browsingIsEnabled && !isEdit && !previewCm),
                                            scope
                                        }}>
                                            <App quizData={quizData}/>
                                        </AppCtxProvider>
                                    </CxsCtxProvider>
                                </div>

                                {/*</ThemeProvider>*/}
                            </ApolloProvider>
                        </Store>
                    </JahiaCtxProvider>
                </StylesProvider>,
            // </React.StrictMode>,

        document.getElementById(target)
        );

    }catch(e){
        console.error("error : ",e);
        //Note: create a generic error handler
        ReactDOM.render(
            <ErrorHandler
                item={e.message}
                errors={e.errors}
            />,
            document.getElementById(target)
        );
    }
}

window.quizUIApp = render;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
