var app = angular.module('MusicPortalApp').run(function($http,$rootScope){
  $rootScope.authenticated = false;
  $rootScope.current_user = " ";


  $rootScope.signout = function(){
    $http.get('auth/signout');
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
   // $location.path('/auth/login');
  };
}); //constructing a module...previuosly written as chirpApp
app.controller('userController', function($rootScope,$scope,$http){


$scope.users=[{"name":"yugandhara","instrument":"harmonium","style":"Indian Classical"},
			  {"name":"sayali","instrument":"piano","style":"Western Classical"},
			  {"name":"vaishali","instrument":"piano","style":"Western Classical"}] 

//$scope.users="New Users";
$http.get('/api/getBandMemberUsers').then(function(data){
  console.log(data);
  $scope.bandmembers = data.data;
});


$http.get('/api/getBandManagerUsers').then(function(data){
  console.log(data);
  $scope.bandmanagers = data.data;
});

$http.get('/api/getEventOrganiserUsers').then(function(data){
  console.log(data);
  $scope.eventOrganiser = data.data;
});




});