import actionTypes from '../actions/actionTypes';

const initialState = {
    listenToUsers: ['realDonaldTrump'],
    currentView: 'TWEETS_VIEW'
};

const settings = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SWITCH_VIEW:
            return {
                ...state,
                currentView: action.newView
            };
        case actionTypes.LISTEN_TO_NEW_USER:
            return {
                ...state,
                listenToUsers: [
                    ...state.listenToUsers,
                    action.newUser
                ]
            }
        default:
            return state;
    }
}

export default settings;
