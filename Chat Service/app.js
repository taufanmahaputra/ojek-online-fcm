// Importing modules
var express = require('express');
var cors = require('cors');
var path = require('path');
var bodyparser = require('body-parser');

// Importing routes
const routes = require('./routes/routes.js')

// Initialize express
var app = express();

// app configuration
const port = 3000;

// adding middleware
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

//routing
app.use('/', routes);

// Run server
app.listen(port , () => {
    console.log('Server started at port:' + port);
});
