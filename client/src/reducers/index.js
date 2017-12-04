import { combineReducers } from 'redux';
import tweets from './tweets';

const spellcheckApp = combineReducers({
    tweets
});

export default spellcheckApp;
