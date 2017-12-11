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

var _state = require('./state');

var _state2 = _interopRequireDefault(_state);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Load environment variables if in production
//Needed for twitter API keys.  We don't want to store sensitive info on a public
//git repo
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

//Import tweet state.  This internally handles all of the networking and tweet streams

//Custom express router
//Node modules


//Select the port from an environment variable or default to 5000
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

//On a new connection
io.on('connection', function (socket) {
    //Log the new connection
    console.log("client connected");
    socket.clientObject = new _state.Client(socket);

    socket.on('ignoreEveryone', function (data) {
        var userList = _state2.default.clients[socket.clientID].listeningTo;
        userList.forEach(function (user) {
            _state2.default.clients[socket.clientID].Ignore(user);
        });
    });

    //When the client asks to listen to a user, pass that to the tweet state
    socket.on('listenToUser', function (data) {
        _state2.default.ListenToUser(data, socket);
        socket.emit('listenSuccessful', _state2.default.clients[socket.clientID].listeningTo);
    });
    socket.on('listenToManyUsers', function (data) {
        data.forEach(function (user) {
            return _state2.default.ListenToUser(user, socket);
        });
        socket.emit('listenSuccessful', _state2.default.clients[socket.clientID].listeningTo);
    });
    //When the client wants to disconnect from a tweet stream, disconnect them
    socket.on('ignoreUser', function (data) {
        _state2.default.IgnoreUser(data, socket);
    });
});

//Start the server listening on this port
server.listen(port, function () {
    console.log("Server listening on " + server.address().port);

    //Listen to and cache tweets from these users by default
    var donaldTrump = new _state.TwitterUser("realDonaldTrump");
});