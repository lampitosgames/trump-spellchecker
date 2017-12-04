import io from 'socket.io-client';
import { newTweet } from './actions';

export default (store) => {
    const socket = io();

    socket.on('newTweet', (tweet) => {
        store.dispatch(newTweet(tweet));
    });
}
