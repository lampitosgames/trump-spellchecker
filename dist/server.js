'use strict';

var path = require('path');
var express = require('express');

module.exports = {
  app: function app() {
    var app = express();
    var indexPath = path.join(__dirname, 'index.html');
    var publicPath = express.static(path.join(__dirname, '../dist'));

    app.use('/dist', publicPath);
    app.get('/', function (_, res) {
      res.sendFile(indexPath);
    });

    return app;
  }
};
;

var _temp = function () {
  if (typeof __REACT_HOT_LOADER__ === 'undefined') {
    return;
  }
}();

;