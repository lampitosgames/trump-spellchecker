//Stuff provided by react/redux
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
//Reducers, actions, middleware
import spellcheckApp from './reducers';
import tweetMiddleware from './middleware';
//Components
import App from './App';
//Socket handlers
import socket from './socket';

//Create the store by connecting reducers to middleware
let store = createStore(
    spellcheckApp,
    applyMiddleware.apply(undefined, tweetMiddleware)
);

//Pass the store to socketIO and connect to the server
socket(store);

//Render the app wrapped in Redux provider
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
