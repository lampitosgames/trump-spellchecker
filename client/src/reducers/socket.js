import actionTypes from '../actions/actionTypes';
import connectionTypes from '../actions/connectionTypes';

const initialState = {
    socketStatus: connectionTypes.DISCONNECTED
};

const settings = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_SOCKET_STATUS:
            return {
                ...state,
                socketStatus: action.status
            };
        default:
            return state;
    }
}

export default settings;
