var myVar;
var app = angular.module('chatApp',[]);
app.controller('chatController', function($scope,$http,$timeout) {
	$scope.messages = [];
	$scope.users={
		sender:'',
		receiver:''
	};
	$scope.init= function(){
		$scope.users.sender=$scope.user_sender;
		$scope.users.receiver=$scope.user_receiver;
		console.log($scope.user_sender);
		console.log($scope.user_receiver);
	};
	$scope.closechat = function(){
		$scope.message = {
				user_sender :$scope.users.sender,
				user_receiver : $scope.users.receiver,
				message : "9999"
			}
		console.log("closechat " + $scope.users.receiver);
		$http({
			  method: 'POST',
			  url: 'http://localhost:3000/',
			  data: $scope.message
		}).then(function successCallback(response) {
			    // this callback will be called asynchronously
			    // when the response is available
			console.log(response);
		}, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			console.log(response);
		});
	};
	$scope.send = function() {
		if($scope.textbox!=""){
			$scope.message = {
					user_sender : $scope.users.sender,
					user_receiver : $scope.users.receiver,
					message : $scope.textbox
				}
				$scope.messages.push($scope.message);
				console.log($scope.message);
				console.log($scope.messages);
				$scope.textbox = '';
				$http({
					  method: 'POST',
					  url: 'http://localhost:3000/',
					  data: $scope.message
				}).then(function successCallback(response) {
					    // this callback will be called asynchronously
					    // when the response is available
					console.log(response);
				}, function errorCallback(response) {
					    // called asynchronously if an error occurs
					    // or server returns response with an error status.
					console.log(response);
				});
		}
    };
    $http({
		  method: 'GET',
		  url: 'http://localhost:3000/messages',
	}).then(function successCallback(response) {
		    // this callback will be called asynchronously
		    // when the response is available
		console.log("message:");
		console.log(response);
		$scope.messages = [];
		angular.forEach(response.data, function(value, key) {
			if((value.message!="-9999")&&(value.message!="9999")){
			$scope.message = {
					user_sender : value.sender_name,
					user_receiver : value.receiver_name,
					message : value.message
				}
			$scope.messages.push($scope.message);
			}
		})
		console.log($scope.messages);
	}, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		console.log(response);
	});
    
	
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
	  messaging.onMessage(function(payload) {
		    console.log("Message received. ", payload);
		    // [START_EXCLUDE]
		    // Update the UI to include the received message.
		    console.log(payload.data.sender);
		    console.log(payload.notification.body);
		    if(payload.notification.body=="-9999"){
		    	$scope.users.receiver = payload.data.sender;
		    	console.log("ini receiver nya : "+$scope.users.receiver);
		    	$scope.showChat();
		    	deletefinding();
		    }else if(payload.notification.body=="9999"){
		    	$scope.backtoFinding();
		    }else{
			    // Add message to client
				$scope.message = {
						user_sender : payload.data.sender,
						user_receiver : $scope.users.sender,
						message : payload.notification.body
					}
				//console.log($scope.message);
				$scope.messages.push($scope.message);
				$scope.$apply();
		    }
			console.log($scope.messages);
		    // [END_EXCLUDE]
		  });
		  // [END receive_message]

$scope.backtoFinding=function(){
			document.getElementById("findorder").style.display = "block";
			document.getElementById("findingordertext").style.display = "none";
			document.getElementById("loader").style.display = "none";
			document.getElementById("cancelfinding").style.display = "none";
			document.getElementById("chatarea").style.display = "none";
			document.getElementById("customer").style.display = "none";
			document.getElementById("gotanorder").style.display = "none";
};
$scope.findOrder=function(){
	document.getElementById("findorder").style.display = "none";
	document.getElementById("findingordertext").style.display = "block";
	document.getElementById("loader").style.display = "block";
	document.getElementById("cancelfinding").style.display = "block";
	document.getElementById("customer").style.display = "none";
	document.getElementById("gotanorder").style.display = "none";
	var currentUsername = document.getElementById("username").value;
	$.ajax({
		type: "POST",
		url: "http://localhost:3000/findingOrder",
		data: {
			username: currentUsername,
			},
		datatype: "json",
		success : function(data, status){
			    alert("username : " + currentUsername);
		},
		error: function(err) {
			console.log(err);
		}
	});
};
function deletefinding(){
	var currentUsername = document.getElementById("username").value;
	$.ajax({
		type: "POST",
		url: "http://localhost:3000/foundOrder",
		data: {
			username: currentUsername
			},
		datatype: "json",
		success : function(data, status){
			    alert("username : " + currentUsername);
		},
		error: function(err) {
			console.log(err);
		}
	});
}
$scope.cancelFinding=function(){
	document.getElementById("findorder").style.display = "block";
	document.getElementById("findingordertext").style.display = "none";
	document.getElementById("loader").style.display = "none";
	document.getElementById("cancelfinding").style.display = "none";
	document.getElementById("chatarea").style.display = "none";
	document.getElementById("customer").style.display = "none";
	document.getElementById("gotanorder").style.display = "none";
	deletefinding();
};
$scope.showChat=function() {
	document.getElementById("findingordertext").style.display = "none";
	document.getElementById("loader").style.display = "none";
	document.getElementById("cancelfinding").style.display = "none";
	document.getElementById("chatarea").style.display = "block";
	document.getElementById("customer").style.display = "block";
	document.getElementById("gotanorder").style.display = "block";
};
});