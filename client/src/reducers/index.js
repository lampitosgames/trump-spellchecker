import { combineReducers } from 'redux';
import tweets from './tweets';
import settings from './settings';
import socket from './socket';

const spellcheckApp = combineReducers({
    tweets,
    settings,
    socket
});

export default spellcheckApp;
