//src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular.min.js";
var myVar;

function myFunction() {
    myVar = setTimeout(showPage, 3000);
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("myDiv").style.display = "block";
}