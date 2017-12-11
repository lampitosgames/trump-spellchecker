import io from 'socket.io-client';
import { newTweet, multipleNewTweets, addClientSocket, updateSocketStatus, listenWasSuccessful, throwError, removeError } from './actions';
import connectionTypes from './actions/connectionTypes';

export default (store) => {
    const socket = io();

    store.dispatch(addClientSocket(socket));

    //Listen to donald trump initially
    socket.emit('listenToUser', "realDonaldTrump");

    socket.on('newTweet', (tweet) => {
        store.dispatch(newTweet(tweet));
    });

    socket.on('recentTweets', (tweets) => {
        store.dispatch(multipleNewTweets(tweets));
    });

    socket.on('listenSuccessful', (userList) => {
        store.dispatch(listenWasSuccessful(userList));
    })

    //Socket connection state handling
    socket.on('connecting', () => {
        store.dispatch(updateSocketStatus(connectionTypes.CONNECTING));
    });
    socket.on('reconnecting', () => {
        store.dispatch(updateSocketStatus(connectionTypes.CONNECTING));
    });
    socket.on('connect', () => {
        store.dispatch(updateSocketStatus(connectionTypes.CONNECTED));
    });
    socket.on('reconnect', () => {
        store.dispatch(updateSocketStatus(connectionTypes.CONNECTED));
    });
    socket.on('disconnect', () => {
        store.dispatch(updateSocketStatus(connectionTypes.DISCONNECTED));
    });
    socket.on('connect_failed', () => {
        store.dispatch(updateSocketStatus(connectionTypes.DISCONNECTED));
    });
    socket.on('reconnect_failed', () => {
        store.dispatch(updateSocketStatus(connectionTypes.DISCONNECTED));
    });

    socket.on('serverError', (data) => {
        //Throw error to state
        store.dispatch(throwError(data));
        //Set timeout to make the error go away in 5 seconds
        setTimeout(() => {
            store.dispatch(removeError(data));
        }, 5000);
    });
}
