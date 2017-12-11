import io from 'socket.io-client';
import { newTweet, multipleNewTweets, updateSocketStatus } from './actions';
import connectionTypes from './actions/connectionTypes';

export default (store) => {
    const socket = io();

    socket.emit('listenToUser', "realDonaldTrump");
    // socket.emit('listenToUser', "lampitosgames");

    socket.on('newTweet', (tweet) => {
        store.dispatch(newTweet(tweet));
    });

    socket.on('recentTweets', (tweets) => {
        store.dispatch(multipleNewTweets(tweets));
    });

    //Socket connection state handling
    socket.on('connecting', () => {
        console.log("connecting to server...");
        store.dispatch(updateSocketStatus(connectionTypes.CONNECTING));
    });
    socket.on('reconnecting', () => {
        console.log("reconnecting to server...");
        store.dispatch(updateSocketStatus(connectionTypes.CONNECTING));
    });
    socket.on('connect', () => {
        console.log("connected to server");
        store.dispatch(updateSocketStatus(connectionTypes.CONNECTED));
    });
    socket.on('reconnect', () => {
        console.log("reconnected to server");
        store.dispatch(updateSocketStatus(connectionTypes.CONNECTED));
    });
    socket.on('disconnect', () => {
        console.log("disconnected from server");
        store.dispatch(updateSocketStatus(connectionTypes.DISCONNECTED));
    });
    socket.on('connect_failed', () => {
        console.log("failed to connect to server");
        store.dispatch(updateSocketStatus(connectionTypes.DISCONNECTED));
    });
    socket.on('reconnect_failed', () => {
        console.log("failed to reconnect with server");
        store.dispatch(updateSocketStatus(connectionTypes.DISCONNECTED));
    });

    socket.on('error', () => {
        //TODO handle errors more elegantly
        console.log("error");
    });
}
