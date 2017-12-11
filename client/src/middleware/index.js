import {listenWasSuccessful, multipleNewTweets} from '../actions';

const listenToNewUserMiddleware = store => next => action => {
    if (action.type === 'LISTEN_TO_NEW_USERS') {
        //Get the socket from the store
        let socket = store.getState().socket.clientSocket;
        //Remove all listeners and replace them with the incoming list
        socket.emit('ignoreEveryone', {});
        //If there are users to listen to
        if (action.userList != null) {
            //Emit that we want to listen to many users
            socket.emit('listenToManyUsers', action.userList);
        //Else, we aren't going to listen to anyone.
        } else {
            //Emit two new actions to reset the state, passing in blank arrays
            next(action);
            next(multipleNewTweets([]));
            next(listenWasSuccessful([]));
            return;
        }
    }
    next(action);
}

export default [
    listenToNewUserMiddleware
]
