import io from 'socket.io-client';
const socket = io();

function subscribeToTweets() {
    socket.on('newTweet', (tweet) => {
        console.dir(tweet);
    });
}

export { subscribeToTweets };
