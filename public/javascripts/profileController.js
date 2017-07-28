var app=angular.module('MusicPortalApp').run(function($http,$rootScope){
  $rootScope.authenticated = false;
  $rootScope.current_user = " ";


  $rootScope.signout = function(){
    $http.get('auth/signout');
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
   // $location.path('/auth/login');
  };
}); //constructing a module

app.controller('profileController', function($rootScope,$scope,$http,$location){	
	var profile={band_name:'',style:'',x_factor:''};
	var username = localStorage.getItem('username');
	var role = localStorage.getItem('role');	
		
	$http.get('/profile/profileGet/'+username+'/'+role).then(function(data){
		console.log(data.data.role);

		$scope.user = data.data;
		if(data.data.role=='Band_Member'){
			$scope.user.role='Band Member';
		}
		else if(data.data.role=='Band_Manager'){
			$scope.user.role='Band Manager';
		}
		else if(data.data.role=='Admin'){
			$scope.user.role='Admin';
		}
		else if(data.data.role=='Event_Organiser'){
			$scope.user.role='Event Organiser';
		}
		//$scope.user.id = $scope.user._id ; 
		console.log($scope.user);

	},function(error){
		console.log(error);
	});

	$scope.editProfile = function(userId){
		$location.path('/profile/editProfile');
	}

	$scope.editManagerProfile = function(){
		$location.path('/profile/editManagerProfile');
	}
	
	
});



