var myVar;
var app = angular.module('selectdriver', []);
app.controller('tokenController', function($scope, $http) {
	$scope.profile =
		{
			username: String,
			id: String,
			token: String
		};
	$scope.findingOrders = [];
	$scope.init = function() {
		$scope.profile.username = $scope.profileusername;
		$scope.profile.id = $scope.profileid;
		$scope.profile.token = $scope.profiletoken;
		console.log($scope.profile);
	};
	$scope.chooseDriver=function(driverusername){
		$scope.message = {
				user_sender :$scope.profile.username,
				user_receiver : driverusername,
				message : "-9999"
			}
		console.log("choose driver " + driverusername);
		$http({
			method: "POST",
			url: "http://localhost:3000/",
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
	$http({
		  method: 'GET',
		  url: 'http://localhost:3000/findingOrders',
	 }).then(function successCallback(response) {
		    // this callback will be called asynchronously
		    // when the response is available
		console.log("findingorder: ");
		console.log(response);
		console.log(response.data[0]);
		angular.forEach(response.data, function(value, key) {
			console.log(value.username);
			$scope.findingOrders.push(value.username);
		})
		console.log($scope.findingOrders);
	}, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		console.log(response);
	});

});
