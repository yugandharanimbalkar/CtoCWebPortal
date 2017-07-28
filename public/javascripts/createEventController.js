var app=angular.module('MusicPortalApp').run(function($http,$rootScope){
  $rootScope.authenticated = false;
  $rootScope.current_user = " ";


  $rootScope.signout = function(){
    $http.get('auth/signout');
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
   // $location.path('/auth/login');
  };
}); 

app.controller('createEventController', function($rootScope,$scope,$http,$location){

  $scope.event = {};
 
  $scope.username = localStorage.getItem("username");
  $scope.Id = localStorage.getItem("Id");
  var id = $scope.Id;
  console.log("IDDDDDDDDDD:  "+id);
 console.log($rootScope.current_user);
  $scope.eventOrganiser={};
  $http.get('/profile/getEventOrganiser/'+$rootScope.current_user).then(function(data){
                 
          $scope.eventOrganiser = data.data;
           console.log(data.data);  
          // $scope.event.username = data.data._id;
        });

  $http.get('/events/getEvents/'+id).then(function(data){
    console.log("Event list");
    console.log(data.data);
    $scope.events=data.data;
  })

	$scope.createEvent = function(){  
    $scope.event.username = $scope.eventOrganiser;
    console.log("...................."+$scope.event.event_name);
    $http.post('/events/createEvent',$scope.event).then(function(data){
      console.log("data event");
      console.log(data);
       $location.path('/eventslist');
    });
   
		
	}

 
	});