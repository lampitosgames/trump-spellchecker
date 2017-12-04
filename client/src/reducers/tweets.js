import actionTypes from '../actions/actionTypes';

const initialState = {
    count: 0
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
        default:
            return state;
    }
}

export default tweets;
