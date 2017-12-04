import express from 'express';
import path from 'path';
import http from 'http';
import socketIO from 'socket.io';
import router from './router';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

import {listenForTweets, getRecentTweets, getFullTweet} from './twitter';

//Select the port from an environment variable or default to 8000
//This is needed for Heroku
const port = (process.env.PORT || 5000)

//Express app
let app = express();
//HTTP servver
let server = http.createServer(app);
//Socket server
let io = socketIO.listen(server);

//Hook in the app router
app.use(router);

//Store recent tweets by a user
let recentTweets = [];

//On a new connection
io.on('connection', (socket) => {
    console.log("connected");
    socket.emit('recentTweets', recentTweets);
});

//Start the server listening on this port
server.listen(port, () => {
    console.log("Server listening on " + server.address().port);

    let listenToUser = 'realDonaldTrump';

    getRecentTweets(listenToUser).then((oldTweets) => {
        if (oldTweets == null) {
            return;
        }
        recentTweets = recentTweets.concat(oldTweets);
    }).catch((err) => console.log(err));

    listenForTweets(listenToUser).then((tweetStream) => {
        tweetStream.on('data', (event) => {
            if (event.user.screen_name !== listenToUser) {
                return;
            }
            getFullTweet(event.id_str).then((tweet) => {
                recentTweets.push(tweet);
                io.emit('newTweet', tweet);
            }).catch((err) => console.error(err));
        });

        tweetStream.on('error', (err) => {
            console.error(err);
        });
    }).catch((err) => console.error(err));
});
