// importing modules
require('./app/index');


var express = require('express');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');

var app = express();
app.set('view engine', 'pug');
app.set('views','./views');

// Initialize MongoDB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/PROJEK');

var findingOrderSchema = mongoose.Schema({
  username: String,
  tokenFCM : String,
  time : String
});

var findingOrder  = mongoose.model("findingOrder", findingOrderSchema);
//const messaging = firebase.messaging();
//console.log(messaging);

// app configuration
const port = 3100;

// adding middleware
app.use(cors());

app.use(bodyparser.json());

//routing
app.get('/', (req, res) => {
    res.send('Welcome to NodeJs!');
});

app.use(bodyparser.urlencoded({ extended: false }));

app.listen(port , () => {
    console.log('Server started at port:' + port);
});

app.post('/findingOrder', function(req, res){
  var findingOrderInfo = req.body; //Get the parsed information
  
  if(!findingOrderInfo.username || !findingOrderInfo.tokenFCM || !findingOrderInfo.time){
     res.render('show_message', {
        message: "Sorry, you provided worng info" + findingOrderInfo.username + findingOrderInfo.tokenFCM + findingOrderInfo.time, type: "error"});
  } else {
     var newfindingOrder = new findingOrder({
        username: findingOrderInfo.username,
        tokenFCM: findingOrderInfo.tokenFCM,
        time: findingOrderInfo.time
     });
   
     newfindingOrder.save(function(err, findingOrder){
        if(err)
           res.render('show_message', {message: "Database error", type: "error"});
        else
           res.render('show_message', {
              message: "New findingOrder added", type: "success", findingOrder: findingOrderInfo});
            });
            console.log('GOTCHA');            
      }
});

app.get('/drivers', (req, res) => {
  res.json(findingOrder)
} )

