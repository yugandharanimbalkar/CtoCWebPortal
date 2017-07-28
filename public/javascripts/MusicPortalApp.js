var app = angular.module('MusicPortalApp', ['ngRoute','ngResource']).run(function($http,$rootScope){
  $rootScope.authenticated = false;
  $rootScope.current_user = " ";
  $rootScope.role = " ";

  $rootScope.signout = function(){
    localStorage.clear();
    //localStorage.removeItem('username');
    //localStorage.removeItem('authenticated');
    $http.get('auth/signout');
    //return localStorage=null;
   
   $location.path('/auth/login');
  };
}); //constructing a module...previuosly written as chirpApp


app.factory('postService', function($http,$resource){   //factory can be accessible from any controller as long as u include it as dependency
  
  var baseUrl = "/api/posts";
  var factory = {};
  factory.getAll = function(){
    return $http.get(baseUrl);
  };
  return factory;
//Using resource is better that above portion
 /* return $resource('/api/posts/:id'); //for taking end of the post   */

});

app.config(function($routeProvider){
  $routeProvider
    //the timeline display
    .when('/', {
      templateUrl: 'main.html',
      controller: 'mainController'
    })
    //the login display
    .when('/login', {
      templateUrl: 'login.html',
      controller: 'authController'
    })
    //the signup display
    .when('/register', {
      templateUrl: 'register.html',
      controller: 'authController'
    })
    .when('/bandMembers', {
      templateUrl: 'user.html',
      controller: 'userController'
    })

    .when('/bandManagers', {
      templateUrl: 'bandManagersUser.html',
      controller: 'userController'
    })

    .when('/eventOrganisers', {
      templateUrl: 'eventOrganisersUser.html',
      controller: 'userController'
    })
    
    .when('/bands', {
      templateUrl: 'bands.html',
      controller: 'bandController'
    })

    .when('/profile',{
      templateUrl:'profile.html',
      controller:'profileController'
    })

    .when('/profile/editProfile',{
      templateUrl:'editProfile.html',
      controller:'editProfileController'
    })

    .when('/create_event',{
      templateUrl:'createEvent.html',
      controller:'createEventController'
    }) 

    .when('/eventslist',{
      templateUrl:'eventList.html',
      controller:'createEventController'
    })      

    .when('/create_band',{
      templateUrl:'createBand.html',
      controller:'createBandController'
    })

    .when('/events/:eventId/details',{
      templateUrl:'eventDetails.html',
      controller:'eventDetailsController'
    })

   .when('/band',{
        templateUrl:'Band.html',
        controller:'bandController'
      })
/*
  .when('/profile/editManagerProfile',{
      templateUrl:'editManagerProfile.html',
      controller:'editManagerProfileController'
    }) */

  .when('/addBand', {
    templateUrl: 'addBand.html',
    controller: 'bandController'
  });

});

app.controller('mainController', function($rootScope,$scope,postService){


	$scope.posts=[];
 // $scope.posts = postService.query();  //used with $resource
	$scope.newPost={created_by:'',text:'',created_at:''};

/* Used with http service  
  postService.getAll().success(function(data){
    $scope.posts = data;
  });*/ 


	$scope.post = function(){

      $scope.newPost.created_by = $rootScope.current_user;
	    $scope.newPost.created_at = Date.now();
	    $scope.posts.push($scope.newPost);
	    $scope.newPost = {created_by: '', text: '', created_at: ''}; 

      //The above portion is replcaement for service given below
/*
    $scope.newPost.created_by = $rootScope.current_user;
    $scope.newPost.created_at = Date.now();
    postService.save($scope.newPost, function(){
      $scope.posts = postService.query();
      $scope.newPost = {created_by: '', text: '', created_at: ''};  //So that post is ready for new post
    }); */
  };
});

app.controller('authController', function($scope, $http, $rootScope, $location){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';
  localStorage.setItem('haveBand',0);
  $rootScope.haveBand = 0;
  $scope.login = function(){
    $http.post('/auth/login', $scope.user).success(function(data){
      console.log("DATAAA:");
      console.log(data);
        if(data.state == 'success'){
          $rootScope.authenticated = true;
          $rootScope.current_user = data.user.username;
          localStorage.setItem('username',data.user.username);
          localStorage.setItem('authenticated',true);
          if(data.user.role=="Band_Member"){
            $rootScope.role="Band Member";
            localStorage.setItem('role',"Band_Member");
            $http.get('/profile/getBandMember/'+$rootScope.current_user).then(function(data){
              localStorage.setItem('Id',data.data._id);
              $scope.bandMember = data.data;
            });
          }
          else if(data.user.role=="Event_Organiser"){
            $rootScope.role="Event Organiser";
            localStorage.setItem('role',"Event_Organiser");
            $http.get('/profile/getEventOrganiser/'+$rootScope.current_user).then(function(data){
              console.log("EO::");
              console.log(data);
              localStorage.setItem('Id',data.data._id);
              $scope.eventOrganiser = data.data;
            });
          }
          else if(data.user.role=="Admin"){
            $rootScope.role="Admin";
            localStorage.setItem('role',"Admin");
             $http.get('/profile/getAdmin/'+$rootScope.current_user).then(function(data){
              localStorage.setItem('Id',data.data._id);
              $scope.admin = data.data;

            });
          }
          else if(data.user.role=="Band_Manager"){
          $rootScope.role="Band Manager";
          localStorage.setItem('role',"Band_Manager");
           $http.get('/profile/getBandManager/'+$rootScope.current_user).then(function(data){
            console.log("EO::");
            console.log(data.data._id);
            var Id = data.data._id;
            console.log(Id);
            localStorage.setItem('Id',Id);
            if(data.data.band_name){
              localStorage.setItem('haveBand',1);
              $rootScope.haveBand = 1;
            }
            $scope.bandManager = data.data;
          });
        }
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };

  $scope.roles = ["Band Member","Event Organiser","Band Manager"];

  $scope.register = function(){
    if($scope.user.role=='Band Member'){
      $scope.user.role='Band_Member';
    }
    else if($scope.user.role=='Event Organiser'){
      $scope.user.role='Event_Organiser';
    }
     else if($scope.user.role=='Band Manager'){
      $scope.user.role='Band_Manager';
    }
    $http.post('/auth/signup', $scope.user).success(function(data){
        console.log("Register");
        console.log(data);
      if(data.status == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        if(data.user.role=="Band_Member"){
          $rootScope.role="Band Member";
          localStorage.setItem('role',"Band Member");
           $http.get('/profile/getBandMember/'+$rootScope.current_user).then(function(data){
            console.log(data.data._id);
            localStorage.setItem('Id',data.data._id);
            $scope.bandMember = data.data;

          });
        }
        else if(data.user.role=="Event_Organiser"){
          $rootScope.role="Event Organiser";
          localStorage.setItem('role',"Event Organiser");
           $http.get('/profile/getEventOrganiser/'+$rootScope.current_user).then(function(data){
            console.log(data.data._id);
            localStorage.setItem('Id',data.data._id);
            $scope.eventOrganiser = data.data;

          });
        }
        else if(data.user.role=="Band_Manager"){
          $rootScope.role="Band Manager";
          localStorage.setItem('role',"Band Manager");
           $http.get('/profile/getBandManager/'+$rootScope.current_user).then(function(data){
            console.log(data.data);
            localStorage.setItem('Id',data.data._id);
            if(data.data.band_name){
              localStorage.setItem('haveBand',1);
              $rootScope.haveBand = 1;
            }
            $scope.bandManager = data.data;

          });
        }

        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };
});





