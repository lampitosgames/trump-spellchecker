import actionTypes from '../actions/actionTypes';

const initialState = {
    count: 0,
    totalErrors: 0,
    tweets: []
};

const tweets = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.NEW_TWEET:
            return {
                ...state,
                tweets: [
                    ...state.tweets,
                    action.data
                ]
            }
        case actionTypes.NEW_TWEET_LIST:
            return {
                ...state,
                tweets: [
                    ...action.tweets
                ]
            }
        default:
            return state;
    }
}

export default tweets;
