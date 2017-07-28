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

app.controller('createBandController', function($rootScope,$scope,$http,$location){
	var username = localStorage.getItem('username');
	var role = localStorage.getItem('role');

	$scope.band_manager = username;
	
	
	$http.get('/band/genre').then(function(data){
		//console.log(data);
		$scope.genres= data.data;
		console.log($scope.genres);
		//$scope.instruments = data.data;
		
		
	},function(error){
		console.log(error);
	});

	$scope.saveBand = function(){
		$scope.band.band_manager = localStorage.getItem('Id');
		console.log(',,,,,,,,,.............');
		console.log($scope.band.band_manager);
		$http.post('/band/createBand',$scope.band).then(function(data){
			console.log(data.data.status);
			if(data.data.status=='success'){
				localStorage.setItem('haveBand',1);
				$location.path('')
			}
		});

	}

});