import express from 'express';
import path from 'path';
import http from 'http';
import socketIO from 'socket.io';
import router from './router';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

import {listenForTweets, getRecentTweets, getFullTweet} from './twitter';
import {spellcheckText} from './languageTool';

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

    getRecentTweets(listenToUser).then((oldTweetData) => {
        if (oldTweetData == null) {
            return;
        }
        oldTweetData.forEach((tweet) => {
            spellcheckText(tweet.full_text ? tweet.full_text : tweet.text).then((checked) => {
                recentTweets.push({
                    tweet: tweet,
                    checked: JSON.parse(checked)
                });
            }).catch((err) => console.error(error));
        });
    }).catch((err) => console.log(err));

    listenForTweets(listenToUser).then((tweetStream) => {
        tweetStream.on('data', (event) => {
            if (event.user.screen_name !== listenToUser) {
                return;
            }

            getFullTweet(event.id_str).then((tweetData) => {

                spellcheckText(tweetData.full_text
                    ? tweetData.full_text
                    : tweetData.text).then((checkedJSON) => {
                    let tweet = {
                        tweet: tweetData,
                        checked: JSON.parse(checkedJSON)
                    }
                    recentTweets.push(tweet);
                    io.emit('newTweet', tweet);
                }).catch((err) => console.error(err))

            }).catch((err) => console.error(err));
        });

        tweetStream.on('error', (err) => {
            console.error(err);
        });
    }).catch((err) => console.error(err));
});
