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

// Schema user finding order
var findingOrderSchema = mongoose.Schema({
  username: String,
});

var findingOrder  = mongoose.model("findingOrder", findingOrderSchema);

// Schema user login
var loginSchema = mongoose.Schema({
  username: String,
  tokenFCM: String
});

var login  = mongoose.model("login", loginSchema);


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
  
  if(!findingOrderInfo.username){
        console.log("Sorry, you provided worng info" + findingOrderInfo.username);
  } else {
     var newfindingOrder = new findingOrder({
        username: findingOrderInfo.username,
     });
   
      newfindingOrder.save(function(err, findingOrder){
        if(err)
          console.log("GAGAL");
        else
          console.log("SUKSES"); 
      });
    res.json({
      msg : "success saved online driver"
    });
    }
});

app.get('/findingOrders', function(req, res){  
  findingOrder.find(function(err, response){
  res.json(response);
   });
  }
);

app.post('/online', function(req, res){  
  var loginInfo = req.body;
  
  console.log("MASUK");
  if(!loginInfo.username || !loginInfo.tokenFCM) {
    console.log("Sorry, you provided worng info" + loginInfo.username);
  } else {
     var newLogin = new login({
        username: loginInfo.username,
        tokenFCM : loginInfo.tokenFCM
     });
   
      newLogin.save(function(err, login){
        if(err)
          console.log("GAGAL");
        else
          console.log("SUKSES"); 
      });
    res.json({
      msg : "success username and tokenFCM"
    });
    }
});
