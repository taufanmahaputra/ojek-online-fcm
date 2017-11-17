// importing modules
require('./app/index');

var admin = require("firebase-admin");
var serviceAccount = require("./pro-jek-wbd-firebase.json");
var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');

var app = express();

// init Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://pro-jek-wbd.firebaseio.com"
});

console.log(admin);

// app configuration
const port = 3000;

// adding middleware
app.use(cors());

app.use(bodyparser.json());

//routing
app.get('/', (req, res) => {
    res.send('Welcome to NodeJs!');
});

app.listen(port , () => {
    console.log('Server started at port:' + port);
});
