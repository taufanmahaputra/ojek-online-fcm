// importing modules
require('./app/index');

var firebase = require("firebase");
var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');

var app = express();

// Initialize Firebase
var admin = require("firebase-admin");

var serviceAccount = require("./pro-jek-wbd-firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<DATABASE_NAME>.firebaseio.com"
});

console.log(admin);

// This registration token comes from the client FCM SDKs.
var registrationToken = "es3bFtw27ys:APA91bE0-V-KUoE2tL4qK7j5PNB1tV8OgPkHDfmhEvRYEPwvZORIuLK0yoH2xF5Rmibkyq_qf_ZWwxj2pXgrSaP6gsxQ82qoNtPNK3HQbLkXyQZ8maMpteVJ1WI3vh2FYRx3da7A2fmM";

// See the "Defining the message payload" section below for details
// on how to define a message payload.
var payload = {
    notification: {
        title: "$GOOG up 1.43% on the day",
        body: "$GOOG gained 11.80 points to close at 835.67, up 1.43% on the day."
    }
};

// Send a message to the device corresponding to the provided
// registration token.
admin.messaging().sendToDevice(registrationToken, payload)
  .then(function(response) {
    // See the MessagingDevicesResponse reference documentation for
    // the contents of response.
    console.log("Successfully sent message:", response);
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
  });

//const messaging = firebase.messaging();
//console.log(messaging);

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
