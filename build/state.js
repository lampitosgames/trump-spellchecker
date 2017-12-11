'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TwitterUser = exports.Client = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //Import tweet model


//Import networking helpers


var _tweetModel = require('./tweetModel');

var _tweetModel2 = _interopRequireDefault(_tweetModel);

var _twitter = require('./twitter');

var _languageTool = require('./languageTool');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Client = exports.Client = function () {
    function Client(socket) {
        _classCallCheck(this, Client);

        this.id = TweetState.nextClientID++;
        TweetState.clients[this.id] = this;

        socket.clientID = this.id;
        this.socket = socket;
        this.listeningTo = [];
    }

    _createClass(Client, [{
        key: 'EmitRecentTweets',
        value: function EmitRecentTweets() {
            var recentTweets = [];
            //Loop through every username and add their tweets to the list
            this.listeningTo.forEach(function (user) {
                if (TweetState.tweets[user] == undefined) {
                    return;
                }
                recentTweets = [].concat(_toConsumableArray(recentTweets), _toConsumableArray(TweetState.tweets[user].tweetList));
            });
            //Emit all recent tweets
            this.socket.emit('recentTweets', recentTweets.map(function (tweet) {
                return tweet.getData();
            }));
            return this;
        }
    }, {
        key: 'ListenTo',
        value: function ListenTo(username) {
            if (this.listeningTo.indexOf(username) == -1) {
                this.listeningTo.push(username);
            }
            return this;
        }
    }, {
        key: 'Ignore',
        value: function Ignore(username) {
            var ind = this.listeningTo.indexOf(username);
            if (ind != -1) {
                this.listeningTo.splice(ind, 1);
            }
            return this;
        }
    }]);

    return Client;
}();

var TwitterUser = exports.TwitterUser = function () {
    function TwitterUser(username) {
        _classCallCheck(this, TwitterUser);

        //If a twitter user with the same username already exists, do nothing
        if (username in TweetState.tweets) {
            console.log("Tried to create twitter user " + username + " but they already exist");
            return;
        }
        //Put this user into state
        TweetState.tweets[username] = this;
        //User to listen to
        this.username = username;
        //Cached list of tweets from this user
        this.tweetList = [];
        //List of sockets listening to new tweets from this user
        this.listeners = [];
        //Retry timeout for connecting to a tweet stream
        this.retryTimeoutStarted = false;

        this.FetchTweets().Listen();
    }

    _createClass(TwitterUser, [{
        key: 'FetchTweets',
        value: function FetchTweets() {
            var _this = this;

            //Clear tweet list before re-fetching
            this.tweetList = [];
            (0, _twitter.getRecentTweets)(this.username).then(function (tweetData) {
                if (tweetData == null) {
                    return;
                }
                tweetData.forEach(function (tweet) {
                    var thisTweet = new _tweetModel2.default(tweet);
                    (0, _languageTool.spellcheckText)(thisTweet.text).then(function (checked) {
                        thisTweet.addCheckData(JSON.parse(checked)).build();
                        _this.tweetList.push(thisTweet);
                        _this.listeners.forEach(function (cli) {
                            TweetState.clients[cli.clientID].EmitRecentTweets();
                        });
                    }).catch(function (err) {
                        return _this.HandleError("Error spellchecking tweet " + thisTweet.text, err);
                    });
                });
            }).catch(function (err) {
                return _this.HandleError("Error getting recent tweets", err);
            });
            return this;
        }
    }, {
        key: 'Listen',
        value: function Listen() {
            var _this2 = this;

            console.log("listening to " + this.username);
            var curUser = this;
            (0, _twitter.listenForTweets)(this.username).then(function (tweetStream) {
                tweetStream.on('data', function (event) {
                    if (event.user.screen_name !== _this2.username) {
                        return;
                    }

                    (0, _twitter.getFullTweet)(event.id_str).then(function (tweetData) {
                        var thisTweet = new _tweetModel2.default(tweetData);

                        (0, _languageTool.spellcheckText)(thisTweet.text).then(function (checked) {
                            thisTweet.addCheckData(JSON.parse(checked)).build();
                            _this2.tweetList.push(thisTweet);
                            //Loop through all listening sockets and send them the new tweet
                            _this2.listeners.forEach(function (cli) {
                                return cli.emit('newTweet', thisTweet.getData());
                            });
                        }).catch(function (err) {
                            return _this2.HandleError("Error spellchecking tweet", err);
                        });
                    }).catch(function (err) {
                        return _this2.HandleError("Could not get full tweet for " + _this2.username, err);
                    });
                });

                tweetStream.on('error', function (err) {
                    _this2.HandleError("Couldn't get tweet stream for " + _this2.username, err);
                    if (!curUser.retryTimeoutStarted) {
                        curUser.retryTimeoutStarted = true;
                        setTimeout(function () {
                            curUser.FetchTweets.bind(curUser)();
                            curUser.Listen.bind(curUser)();
                            curUser.retryTimeoutStarted = false;
                        }, 30000);
                    }
                });
            }).catch(function (err) {
                _this2.HandleError("Couldn't get tweet stream for " + _this2.username, err);
            });

            return this;
        }

        //Add socket that will be emmitted to when new tweets are recieved

    }, {
        key: 'AddSocketListener',
        value: function AddSocketListener(socket) {
            for (var i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i] == socket) {
                    return;
                }
            }
            this.listeners.push(socket);
            return this;
        }
        //Remove a listener

    }, {
        key: 'RemoveSocketListener',
        value: function RemoveSocketListener(socket) {
            var ind = this.listeners.indexOf(socket);
            if (ind != -1) {
                this.listeners.splice(ind, 1);
            }
            return this;
        }

        //Error handling.  Emits errors to listening clients

    }, {
        key: 'HandleError',
        value: function HandleError(context, error) {
            console.log(context);
            console.error(error);
        }
    }]);

    return TwitterUser;
}();

//Add a twitter user


var AddTwitterUser = function AddTwitterUser(username) {
    if (username in TweetState.tweets) {
        return;
    }
    new TwitterUser(username);
};

//Called to listen to a specific twitter user
var ListenToUser = function ListenToUser(username, socketClient) {
    if (!(username in TweetState.tweets)) {
        AddTwitterUser(username);
    }
    TweetState.tweets[username].AddSocketListener(socketClient);
    TweetState.clients[socketClient.clientID].ListenTo(username).EmitRecentTweets();
};

//Called to remove the client from listening to a twitter user
var IgnoreUser = function IgnoreUser(username, socketClient) {
    if (username in TweetState.tweets) {
        TweetState.tweets[username].RemoveSocketListener(socketClient);
    }
    TweetState.clients[socketClient.clientID].Ignore(username).EmitRecentTweets();
};

//Object where the keys are twitter usernames and the values are TwitterUser objects
var TweetState = {
    tweets: {},
    clients: {},
    TwitterUser: TwitterUser,
    Client: Client,
    nextClientID: 0,
    AddTwitterUser: AddTwitterUser,
    ListenToUser: ListenToUser,
    IgnoreUser: IgnoreUser
};

exports.default = TweetState;