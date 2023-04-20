import React from 'react';
import ReactDOM from 'react-dom';
import {ApolloProvider } from '@apollo/client';
import {ErrorHandler,App} from './components';

import * as serviceWorker from 'misc/serviceWorker';

import {StylesProvider, createGenerateClassName} from '@material-ui/core/styles';
import {getRandomString} from 'misc/utils';

import {contextValidator} from "douane";
import {Store} from "store";
import {JahiaCtxProvider} from "./contexts";
import {CxsCtxProvider} from "./unomi/cxs";
import {getClient} from "./webappGraphql";

import 'index.css';
import {syncTracker} from "misc/trackerWem";

const render=(target,context)=>{
    try{
        // console.log("context : ",JSON.stringify(context));
        context = contextValidator(context);

        const generateClassName = createGenerateClassName({
            // disableGlobal:true,
            seed: getRandomString(8, 'aA')
        });

        // console.log("context.theme : ",context.theme);
        // console.log("typeof context.theme : ",typeof context.theme);
        const {workspace,locale = 'en',quizId,filesServerUrl,gqlServerUrl,contextServerUrl,appContext,cndTypes,scope} = context;
        // if(workspace === "LIVE" && !window.wem){
        //     //TODO add callback ?
        //     syncTracker({scope,contextServerUrl,locale,quizId})
        // }

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
                        <Store appContext={appContext}>
                            <ApolloProvider client={getClient(gqlServerUrl)}>
                                {/*<ThemeProvider theme={theme(context.theme)}>*/}
                                <div style={{overflow:'hidden'}}>
                                    <CxsCtxProvider>
                                        <App />
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
