import React from 'react';
import ReactDOM from 'react-dom';

import App from 'components/App';
import AjvError from "components/Error/Ajv";

import * as serviceWorker from 'misc/serviceWorker';

import {StylesProvider, createGenerateClassName} from '@material-ui/core/styles';
import {getRandomString} from 'misc/utils';

import ApolloClient from "apollo-boost";
import { ApolloProvider } from '@apollo/react-hooks';

import {contextValidator} from "douane";
import {Store} from "store";

import 'index.css';



const render=(target,context)=>{
  try{
    // console.log("context : ",JSON.stringify(context));
    context = contextValidator(context);
    const headers={};
    if(context.gql_authorization)
      headers.Authorization=context.gql_authorization;

    const client = new ApolloClient({
      uri:context.gql_endpoint,
      headers
    })

    const generateClassName = createGenerateClassName({
      // disableGlobal:true,
      seed: getRandomString(8, 'aA')
    });

    // console.log("context.theme : ",context.theme);
    // console.log("typeof context.theme : ",typeof context.theme);
    ReactDOM.render(
      <StylesProvider generateClassName={generateClassName}>
        <Store jContent={context}>
          <ApolloProvider client={client}>
            {/*<ThemeProvider theme={theme(context.theme)}>*/}
            <div style={{overflow:'hidden'}}>
              <App />
            </div>

            {/*</ThemeProvider>*/}
          </ApolloProvider>
        </Store>
      </StylesProvider>,
      document.getElementById(target)
    );

  }catch(e){
    console.error("error : ",e);
    //Note: create a generic error handler
    ReactDOM.render(
      <AjvError
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
