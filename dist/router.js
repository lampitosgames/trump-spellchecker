'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Get a router from express
var router = _express2.default.Router();

//Hook in middleware


//Import array of middleware functions
//Node Modules
router.use(_middleware2.default);

//Serve static files for the client
router.use('/', _express2.default.static(_path2.default.join(__dirname, '..', 'client', 'build')));

//Return the main HTML file when a request is made to the default path
router.get('/', function (req, res) {
    res.sendFile(_path2.default.join(__dirname, '..', 'client', 'index.html'));
});

//Export the router
exports.default = router;