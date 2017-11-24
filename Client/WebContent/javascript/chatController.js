var myVar;
var app = angular.module('chatApp', []);
app.controller('chatController', function($scope) {
	$scope.messages = [
		{
			sender: 'harum',
			body: 'Bang lama bgt lu anjing?'
		},
		{
			sender: 'joko',
			body: 'Saya udah di depan neng'
		}
		];
	$scope.send = function() {
		$scope.message = {
			sender: 'harum',
			body: ''
		}
		$scope.message.body = $scope.textbox;
		$scope.messages.push($scope.message);
		$scope.textbox = '';
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
			    console.log('Successfully added to Online Drivers :' + currentUsername);
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
function load() {
	if(!document.getElementById("isDriver").value){
		document.getElementById("activity").style.display = "block";
		document.getElementById("orderforDriver").style.display = "none";
		document.getElementById("chatarea").style.display = "block";
	}
}