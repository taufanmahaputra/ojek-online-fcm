var myVar;
var app = angular.module('chatApp', []);
app.controller('chatController', function($scope,$http) {
	$scope.messages = [];
	$scope.users={
		sender:'',
		reciever:''
	};
	$scope.init= function(){
		$scope.users.sender=$scope.user_sender;
		$scope.users.reciever=$scope.user_reciever;
		console.log($scope.user_sender);
		console.log($scope.user_reciever);
	}
	$scope.send = function() {
		$scope.message = {
			user_sender : $scope.users.sender,
			user_reciever : $scope.users.reciever,
			message : $scope.textbox
		}
		console.log($scope.message);
		$scope.messages.push($scope.message);
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
    };
});

function findOrder(){
	document.getElementById("findorder").style.display = "none";
	document.getElementById("findingordertext").style.display = "block";
	document.getElementById("loader").style.display = "block";
	document.getElementById("cancelfinding").style.display = "block";
	myVar = setTimeout(showChat, 3000);
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
}


function cancelFinding(){
	clearTimeout(myVar);
	document.getElementById("findorder").style.display = "block";
	document.getElementById("findingordertext").style.display = "none";
	document.getElementById("loader").style.display = "none";
	document.getElementById("cancelfinding").style.display = "none";
}
function showChat() {
	document.getElementById("findingordertext").style.display = "none";
	document.getElementById("loader").style.display = "none";
	document.getElementById("cancelfinding").style.display = "none";
	document.getElementById("chatarea").style.display = "block";
}