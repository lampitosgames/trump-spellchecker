import { combineReducers } from 'redux';
import tweets from './tweets';
import settings from './settings';

const spellcheckApp = combineReducers({
    tweets,
    settings
});

export default spellcheckApp;
