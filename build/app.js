'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _tweetObject = require('./tweetObject');

var _tweetObject2 = _interopRequireDefault(_tweetObject);

var _twitter = require('./twitter');

var _languageTool = require('./languageTool');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

//Select the port from an environment variable or default to 8000
//This is needed for Heroku
var port = process.env.PORT || 5000;

//Express app
var app = (0, _express2.default)();
//HTTP servver
var server = _http2.default.createServer(app);
//Socket server
var io = _socket2.default.listen(server);

//Hook in the app router
app.use(_router2.default);

//Store recent tweets by a user
var recentTweets = [];

//On a new connection
io.on('connection', function (socket) {
    console.log("connected");
    socket.emit('recentTweets', recentTweets.map(function (tweet) {
        return tweet.getData();
    }));
});

//Start the server listening on this port
server.listen(port, function () {
    console.log("Server listening on " + server.address().port);

    var listenToUser = 'realDonaldTrump';
    // let listenToUser = 'lampitosgames';

    (0, _twitter.getRecentTweets)(listenToUser).then(function (oldTweetData) {
        if (oldTweetData == null) {
            return;
        }

        oldTweetData.forEach(function (tweetData) {
            var thisTweet = new _tweetObject2.default(tweetData);
            (0, _languageTool.spellcheckText)(thisTweet.text).then(function (checked) {
                thisTweet.addCheckData(JSON.parse(checked)).build();
                recentTweets.push(thisTweet);
            }).catch(function (err) {
                return console.error(error);
            });
        });
    }).catch(function (err) {
        return console.log(err);
    });

    (0, _twitter.listenForTweets)(listenToUser).then(function (tweetStream) {
        tweetStream.on('data', function (event) {
            if (event.user.screen_name !== listenToUser) {
                return;
            }

            (0, _twitter.getFullTweet)(event.id_str).then(function (tweetData) {
                var thisTweet = new _tweetObject2.default(tweetData);

                (0, _languageTool.spellcheckText)(thisTweet.text).then(function (checked) {
                    thisTweet.addCheckData(JSON.parse(checked)).build();
                    recentTweets.push(thisTweet);
                    io.emit('newTweet', thisTweet.getData());
                }).catch(function (err) {
                    return console.error(err);
                });
            }).catch(function (err) {
                return console.error(err);
            });
        });

        tweetStream.on('error', function (err) {
            console.error(err);
        });
    }).catch(function (err) {
        return console.error(err);
    });
});