import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3000');

function subscribeToTweets() {
    socket.on('newTweet', (tweet) => {
        console.dir(tweet);
    });
}

export { subscribeToTweets };
