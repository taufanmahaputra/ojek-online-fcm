 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBR2OURuDyMAFkiAGGmI66nKFntnaIqj1Q",
    authDomain: "pro-jek-wbd.firebaseapp.com",
    databaseURL: "https://pro-jek-wbd.firebaseio.com",
    projectId: "pro-jek-wbd",
    storageBucket: "pro-jek-wbd.appspot.com",
    messagingSenderId: "205627570901"
  };
  firebase.initializeApp(config);
  
  // [START get_messaging_object]
  // Retrieve Firebase Messaging object.
  const messaging = firebase.messaging();
  // [END get_messaging_object]

  function requestPermission() {
    console.log('Requesting permission...');
    // [START request_permission]
    messaging.requestPermission()
    .then(function() {
      console.log('Notification permission granted.');
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      // [START_EXCLUDE]
      // In many cases once an app has been granted notification permission, it
      // should update its UI reflecting this.
      // [END_EXCLUDE]
    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
    // [END request_permission]
  }
  
  messaging.onTokenRefresh(function() {
	    messaging.getToken()
	    .then(function(refreshedToken) {
	      console.log('Token refreshed.');
	      setTokenSentToServer(false);
	      // Send Instance ID token to app server.
	      sendTokenToServer(refreshedToken);
	      showToken(currentToken);
	    })
	    .catch(function(err) {
	      console.log('Unable to retrieve refreshed token ', err);
	    });
	  });
 
  messaging.getToken()
  .then(function(currentToken) {
    if (currentToken) {
    	 sendTokenToServer(currentToken);
      showToken(currentToken);
    } else {
      // Show permission request.
      console.log('No Instance ID token available. Request permission to generate one.');
      // Show permission UI.
      updateUIForPushPermissionRequired();
      setTokenSentToServer(false);
    }
  })
  .catch(function(err) {
    console.log('An error occurred while retrieving token. ', err);
    showToken('Error retrieving Instance ID token. ', err);
    setTokenSentToServer(false);
  });
  
  function showToken(currentToken) {
	    // Show token in console and UI
	    document.getElementById("tokenFCM").value=currentToken;
	    console.log(currentToken);
	  }

  // Send the Instance ID token your application server, so that it can:
  // - send messages back to this app
  // - subscribe/unsubscribe the token from topics
  function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer()) {
      console.log('Sending token to server...');
      // TODO(developer): Send the current token to your server.
      setTokenSentToServer(true);
    } else {
      console.log('Token already sent to server so won\'t send it again ' +
          'unless it changes');
    }
  }
  function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') == 1;
  }
  
  function setTokenSentToServer(sent) {
	    window.localStorage.setItem('sentToServer', sent ? 1 : 0);
	  }
  
  requestPermission();