var app=angular.module('MusicPortalApp').run(function($http,$rootScope,$routeParams){
  $rootScope.authenticated = false;
  $rootScope.current_user = " ";


  $rootScope.signout = function(){
    $http.get('auth/signout');
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
   // $location.path('/auth/login');
  };
}); //constructing a module...previuosly written as chirpApp

app.controller('eventDetailsController', function($rootScope,$scope,$http,$location,$routeParams){

	var username = localStorage.getItem('username');
	var role = localStorage.getItem('role');

	console.log("NNNNNNNNNNNNNN"+$routeParams.eventId);
  $http.get('/events/getEventDetails/'+$routeParams.eventId).then(function(data,err){
    console.log(data.data[0].location);
    $scope.event = data.data[0];
  })

});