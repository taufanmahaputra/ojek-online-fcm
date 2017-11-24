// importing modules
require('./app/index');

var firebase = require("firebase-admin");
var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');

var app = express();

// Import models
const Message = require('./models/message');
const findingOrder = require('./models/driver');
const login = require('./models/user');

// Initialize Firebase
var serviceAccount = require("./pro-jek-wbd-firebase.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://pro-jek-wbd.firebaseio.com"
});

// Initialize Database
mongoose.connect('mongodb://localhost:27017/wbd');

// Check connection
mongoose.connection.on('connected' , () => {
  console.log('Successfully connected to database');
});
mongoose.connection.on('error', (err) => {
  if(err) {
    console.log('Error: ' + err);
  }
})

var registrationToken;

// See the "Defining the message payload" section below for details
// on how to define a message payload.
var payload = {
    notification: {
        title: "",
        body: "",
        icon: "https://cdnjs.cloudflare.com/ajax/libs/flat-ui/2.3.0/img/icons/png/Chat.png"
    },
    data: {
      sender: ""
    }
};

// app configuration
const port = 3000;

// adding middleware
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

//routing
app.get('/', (req, res) => {
    res.send('Welcome to NodeJs!');
});

app.post('/', (req, res) => {
  console.log(req.body);
  registrationToken = req.body.token;
  user_sender = req.body.user_sender;
  message_body = req.body.message;

  payload.notification.title = "Message from ";
  payload.notification.title += user_sender;
  payload.notification.body = message_body;

  payload.data.sender = user_sender;
  
  // Send a message to the device corresponding to the provided
  // registration token.
  firebase.messaging().sendToDevice(registrationToken, payload)
  .then(function(response) {
    // See the MessagingDevicesResponse reference documentation for
    // the contents of response.
    console.log("Successfully sent message:", response);
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
  });

  // Save history chat
  let newMessage = new Message({
    sender_name: user_sender,
    receiver_name: registrationToken,
    message: message_body 
  });

  newMessage.save((err, message) => {
    if(err) {
      res.json({msg: "Failed to add message"});
    }
    else {
      res.json({msg: "Success !!"});
    }
  })
});

app.get('/messages', (req, res) => {
  Message.find((err, messages) => {
    res.json(messages);
  })
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


app.get('/onlines', function(req, res){  
  login.find(function(err, response){
  res.json(response);
   });
  }
);


app.post('/online', function(req, res){  
  var loginInfo = req.body;
  
  console.log("MASUK");
  if(!loginInfo.username || !loginInfo.tokenFCM) {
    console.log("Sorry, you provided wrong info" + loginInfo.username);
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



// Run server
app.listen(port , () => {
    console.log('Server started at port:' + port);
});
