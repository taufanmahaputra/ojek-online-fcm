var myVar;
var app = angular.module('chatApp', []);
app.controller('chatController', function($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
});
function findOrder(){
	document.getElementById("findorder").style.display = "none";
	document.getElementById("findingordertext").style.display = "block";
	document.getElementById("loader").style.display = "block";
	document.getElementById("cancelfinding").style.display = "block";
	myVar = setTimeout(showChat, 3);
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