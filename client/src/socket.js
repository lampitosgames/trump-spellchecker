import io from 'socket.io-client';
import { newTweet, multipleNewTweets } from './actions';

export default (store) => {
    const socket = io();

    socket.on('newTweet', (tweet) => {
        console.log("Got new tweet");
        store.dispatch(newTweet(tweet));
    });

    socket.on('recentTweets', (tweets) => {
        console.log("Recent Tweets Recieved");
        console.dir(tweets);
        store.dispatch(multipleNewTweets(tweets));
    });
}
