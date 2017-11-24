const express = require('express');
const router = express.Router();

var firebase = require("firebase-admin");
var mongoose = require('mongoose');


// Import models
const Message = require('../models/message');
const findingOrder = require('../models/driver');
const login = require('../models/user');


// Initialize Firebase
var serviceAccount = require("../pro-jek-wbd-firebase.json");

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



//
// Sendnig message to FCM
//


router.get('/', (req, res) => {
    res.send('Welcome to NodeJs!');
});

//

router.post('/', (req, res) => {
  console.log(req.body);
  user_sender = req.body.user_sender;
  user_receiver = req.body.user_receiver;
  message_body = req.body.message;

  // Find receiver token FCM
  login.find({username : user_receiver} , (err, message) => {
    console.log("Token FCM receiver: " + message[0].tokenFCM);
    registrationToken = message[0].tokenFCM;


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
  });

  payload.notification.title = "Message from ";
  payload.notification.title += user_sender;
  payload.notification.body = message_body;

  payload.data.sender = user_sender;
  


  // Save history chat
  let newMessage = new Message({
    sender_name: user_sender,
    receiver_name: user_receiver,
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

//

router.get('/messages', (req, res) => {
  Message.find((err, messages) => {
    res.json(messages);
  })
});






//
// Get Driver Online
//

router.get('/findingOrders', function(req, res){  
  findingOrder.find(function(err, response){
  res.json(response);
   });
  }
);

//

router.post('/findingOrder', function(req, res){
  var findingOrderInfo = req.body; //Get the parsed information
  
  console.log('Driver online');

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






//
// Get User online with token fcm
//

router.get('/onlines', function(req, res){  
  login.find(function(err, response){
  res.json(response);
   });
  }
);

//

router.post('/online', function(req, res){  
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


// Export module
module.exports = router;