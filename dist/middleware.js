"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
//THIS IS JUST A TEST MIDDLEWARE FILE

//Add a timestamp to the request
var requestTime = function requestTime(req, res, next) {
    req.reqTime = Date.now();
    next();
};

//Export an array of middleware functions to be bound by the router
exports.default = [requestTime];