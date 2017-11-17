// importing modules
require('./app/index');

var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');

var app = express();

// app configuration
const port = 3000;

//routing
app.get('/', (req, res) => {
    res.send('Welcome to NodeJs!');
});

app.listen(port , () => {
    console.log('Server started at port:' + port);
});
