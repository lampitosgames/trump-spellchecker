import actionTypes from '../actions/actionTypes';

const initialState = {
    count: 0,
    tweets: []
};

const tweets = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INCREMENT:
            return {
                ...state,
                count: state.count + 1
            };
        case actionTypes.DECREMENT:
            return {
                ...state,
                count: state.count - 1
            };
        case actionTypes.NEW_TWEET:
            return {
                ...state,
                tweets: [
                    ...state.tweets,
                    {
                        text: action.text,
                        id: action.id,
                        data: action.data
                    }
                ]
            }
        case actionTypes.NEW_TWEET_LIST:
            return {
                ...state,
                tweets: [
                    ...state.tweets,
                    ...action.tweets
                ]
            }
        default:
            return state;
    }
}

export default tweets;
