import actionTypes from '../actions/actionTypes';
import connectionTypes from '../actions/connectionTypes';

const initialState = {
    socketStatus: connectionTypes.DISCONNECTED,
    clientSocket: undefined,
    listeningTo: [],
    changedListeningSuccessfully: true
};

const settings = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_CLIENT_SOCKET:
            return {
                ...state,
                clientSocket: action.socket
            };
        case actionTypes.UPDATE_SOCKET_STATUS:
            return {
                ...state,
                socketStatus: action.status
            };
        case actionTypes.LISTEN_TO_NEW_USERS:
            return {
                ...state,
                listeningTo: [
                    ...state.listeningTo,
                    ...action.userList
                ]
            };
        default:
            return state;
    }
}

export default settings;
