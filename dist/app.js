'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Select the port from an environment variable or default to 8000
//This is needed for Heroku
var port = process.env.PORT || 5000;

//Express app

// import socketIO from 'socket.io';
var app = (0, _express2.default)();
//HTTP servver
var server = _http2.default.Server(app);
//Socket server
// let io = socketIO.listen(server);

//Hook in the app router
app.use(_router2.default);

//Start the server listening on this port
server.listen(port, function () {
    console.log("Server listening on " + server.address().port);
});