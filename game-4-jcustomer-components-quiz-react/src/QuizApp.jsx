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
        const {workspace,locale = 'en',quizId,filesServerUrl,gqlServerUrl,contextServerUrl,appContext, cndTypes,scope} = context;

        const client = getClient(gqlServerUrl)
        const quizData = await getQuizData({client,workspace,locale,quizId});
        const {transitionIsEnabled,transitionLabel,resetIsEnabled : resetBtnIsEnabled,browsingIsEnabled} = quizData.quizConfig;

        //TODO not working !
        if(workspace === "LIVE" && !window.wem){
            //TODO add callback ?
            window.wem = syncTracker({
                scope,
                contextServerUrl,
                locale,
                quizKey:quizData.quizContent.key,
                quizPath:quizData.path
            });
            window.cxs = window.wem.getLoadedContext();
        }

        ReactDOM.render(
            <React.StrictMode>
                <StylesProvider generateClassName={generateClassName}>
                    <JahiaCtxProvider value={{
                        workspace,
                        locale,
                        quizId,
                        filesServerUrl,
                        contextServerUrl,
                        cndTypes
                    }}>
                        <Store quizData={quizData}>
                            <ApolloProvider client={client}>
                                {/*<ThemeProvider theme={theme(context.theme)}>*/}
                                <div style={{overflow:'hidden'}}>
                                    <CxsCtxProvider>
                                        <AppCtxProvider value={{
                                            languageBundle:quizData.languageBundle,
                                            ...appContext,
                                            transitionIsEnabled,
                                            transitionLabel,
                                            resetBtnIsEnabled,
                                            browsingIsEnabled,
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
                </StylesProvider>
            </React.StrictMode>,

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
