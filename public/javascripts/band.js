var app=angular.module('MusicPortalApp').run(function($http,$rootScope){
  $rootScope.authenticated = false;
  $rootScope.current_user = " ";


  $rootScope.signout = function(){
    $http.get('auth/signout');
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
   // $location.path('/auth/login');
  };
}); //constructing a module...previuosly written as chirpApp

app.controller('editBandProfileController', function($rootScope,$scope,$http,$location){

	var username = localStorage.getItem('username');
  var role = localStorage.getItem('role');

	$http.get('/band/bandGet/'+username).then(function(data){
		console.log($scope.data);
	});

});