'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _twitter = require('twitter');

var _twitter2 = _interopRequireDefault(_twitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

var client = new _twitter2.default({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var listenForTweets = function listenForTweets(username) {
    return new Promise(function (resolve, reject) {
        client.get('users/lookup', { screen_name: username }).then(function (users) {
            //Set the userID
            var userID = users[0].id_str;
            var stream = client.stream('statuses/filter', { follow: userID });
            resolve(stream);
        }).catch(function (err) {
            return reject(err);
        });
    });
};

exports.default = listenForTweets;