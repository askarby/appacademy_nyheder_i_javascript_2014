/*jslint node: true, nomen: true, es5: true */
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Serve static frontend files
app.use('/', express.static(__dirname + '/../frontend'));

var server = app.listen(1337, function () {
    console.log('Post-it Note app listening at http:/127.0.0.1:1337/');
});