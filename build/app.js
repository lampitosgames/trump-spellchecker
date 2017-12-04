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

var _twitter = require('./twitter');

var _twitter2 = _interopRequireDefault(_twitter);

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

//On a new connection
io.on('connection', function (socket) {
    console.dir("connected!");
    // //Bind createNewPlayer for when the client requests a player
    // socket.on('createNewPlayer', () => {
    //     //Add a new player to the game and store the ID on this socket
    //     socket.playerID = game.addNewPlayer(socket);
    //
    //     //Listen to player updates from the client
    //     socket.on('updatePlayer', (data) => {
    //         game.updatePlayerFromClient(socket, data);
    //     });
    //
    //     //Listen for new attackers
    //     socket.on('tagPlayer', (id) => {
    //         game.declareNewAttacker(id);
    //     });
    //
    //     //Only bind disconnect if the player was created in the first place
    //     //Disconnect the player
    //     socket.on('disconnect', () => {
    //         game.disconnectPlayer(socket.playerID);
    //     });
    // });
});

//Start the server listening on this port
server.listen(port, function () {
    console.log("Server listening on " + server.address().port);

    var listenToUser = 'lampitosgames';

    (0, _twitter2.default)(listenToUser).then(function (tweetStream) {
        tweetStream.on('data', function (event) {
            if (event.user.screen_name !== listenToUser) {
                return;
            }
            io.emit('newTweet', event);
            console.log(event);
        });

        tweetStream.on('error', function (error) {
            console.log(error);
        });
    }).catch(function (err) {
        return console.error(err);
    });
});