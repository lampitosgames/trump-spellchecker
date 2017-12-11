import { combineReducers } from 'redux';
import tweets from './tweets';
import settings from './settings';
import socket from './socket';
import error from './error';

const spellcheckApp = combineReducers({
    tweets,
    settings,
    socket,
    error
});

export default spellcheckApp;
