var myVar;
var app = angular.module('selectdriver', []);
app.controller('tokenController', function($scope) {
	$scope.profile =
		{
			username: String,
			id: String,
			token: String
		};
	$scope.init = function() {
		$scope.profile.username = $scope.profileusername;
		$scope.profile.id = $scope.profileid;
		$scope.profile.token = $scope.profiletoken;
		console.log($scope.profile);
	};
});