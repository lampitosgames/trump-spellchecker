'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.spellcheckText = exports.testRequest = exports.postRequest = exports.createPostOptions = exports.createPostData = undefined;

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createPostData = exports.createPostData = function createPostData(dataObject) {
    return _querystring2.default.stringify(dataObject);
};

/*
 * Helper function that creates HTTP request POST options based
 * on input
 */

//TODO: Throttle requests
var createPostOptions = exports.createPostOptions = function createPostOptions(_hostname, _path, _postData) {
    return {
        hostname: _hostname,
        path: _path,
        port: 443,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(_postData)
        }
    };
};

/*
 * Makes a post request with the given parameters already constructed
 * Returns a promise that resolves when the data is returned, passing
 * the return body
 */
var postRequest = exports.postRequest = function postRequest(_data, _options) {
    return new Promise(function (resolve, reject) {
        var req = _https2.default.request(_options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (data) {
                resolve(data);
            });
        });
        req.on('error', function (err) {
            return reject(err);
        });
        req.write(_data);
        req.end();
    });
};

var testRequest = exports.testRequest = function testRequest() {
    var postData = createPostData({ text: "I can't can't spell for shiteasdf", language: "en-US" });
    var options = createPostOptions('www.languagetool.org', '/api/v2/check', postData);
    postRequest(postData, options).then(function (data) {
        console.dir(JSON.parse(data));
    }).catch(function (err) {
        return console.log(err);
    });
};

var spellcheckText = exports.spellcheckText = function spellcheckText(_text) {
    var postData = createPostData({ text: _text, language: "en-US" });
    var options = createPostOptions('www.languagetool.org', '/api/v2/check', postData);
    return postRequest(postData, options);
};