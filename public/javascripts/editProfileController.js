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

app.directive('fileModel',['$parse',function($parse){
	return {
		restrict:'A', //restrict to attributes
		link: function(scope,element, attrs){
			var parsedFile = $parse(attrs.fileModel);
			var parsedFileSetter =parsedFile.assign;

			element.bind('change',function(){  //if any change it will be updated
				scope.$apply(function(){
					parsedFileSetter(scope,element[0].files[0]);
				});
			});
		}
	};
}]);

/*
app.service('uploadFile',function($http){
	this.upload =function(file){
		var fd = new FormData(); //is key-value pair
		fd.append('profile',file.upload);
		return $http.post('/profile/upload',fd,{
			//to remove angular serialzation
			transformRequest : angular.identity,
			headers:{'Content-Type':undefined }
		});
	};
});
 */
app.controller('editProfileController', function($rootScope,$scope,$http,$location,$timeout){
	//console.log("Hello controller");
	var username = localStorage.getItem('username');
	var role = localStorage.getItem('role');	
	$scope.file = {};
	/*$scope.Submit = function(){
		$scope.uploading = true;
		uploadFile.upload($scope.file).then(function(data){
			if(data.data.success){
				console.log("Submit data :");
				console.log(data);
				$scope.uploading = false;
				$scope.alert = 'alert alert-success';
				$scope.message=data.data.message;
				$scope.file ={}
			}
			else{
				$scope.uploading=false;
				$scope.alert = 'alert alert-danger';
				$scope.message = data.data.message;
				$scope.file ={};
			}
		});
	} */
	$http.get('/profile/profileGet/'+username+'/'+role).then(function(data){

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
		//console.log("ID: "+$scope.user._id);
		
	},function(error){
		console.log(error);
	});

	$http.get('/profile/instruments').then(function(data){
		//console.log(data);
		$scope.instruments= data.data;
		console.log($scope.instruments);
		//$scope.instruments = data.data;
		
		
	},function(error){
		console.log(error);
	});


	$scope.updateImage = function(){

		var formData = new FormData;
		for (key in $scope.user){
			formData.append(key,$scope.user[key]);
		}

		/*
		for (var pair of formData.entries()){
			console.log(pair[0]+","+pair[1]);
		}	*/	

		var file = $('#file')[0].files[0];	
		formData.append('image',file);
		//$http.put('/profile/profileUpdate/'+$scope.user._id,$scope.user);
		$http.post('/profile/profileImageUpdate', formData,{
			transformRequest:angular.identity,
			headers:{
				'Content-Type':undefined
			}
		});
	}

	$scope.update=function(){
		console.log("HHHHHH: "+$scope.user._id);
		if($scope.user.role=='Band Member'){
			$scope.user.role='Band_Member';
		}
		else if($scope.user.role=='Band Manager'){
			$scope.user.role='Band_Manager';
		}
		else if($scope.user.role=='Admin'){
			$scope.user.role='Admin';
		}
		else if($scope.user.role=='Event Organiser'){
			$scope.user.role='Event_Organiser';
		}
		$http.put('/profile/profileUpdate/'+$scope.user._id,$scope.user).then(function(data){
			console.log("Data:  ");
			console.log(data);
			$location.path('/profile');
		});	
	}

	$scope.cancel=function(){
		$location.path('/profile');
	}

/*
	$scope.photoChanged=function(files){ //gets called when input changes 
		console.log(files);
		if(files.length>0 && files[0].name.match(/\.(jpeg|png|jpg)$/)){
			$scope.uploading = true;
			var file = files[0];
			var fileReader = new FileReader();
			fileReader.readAsDataURL(file);
			fileReader.onload = function(e){
				$timeout(function(){
					console.log("EEEE : ");
					console.log(e);
					$scope.thumbnail = {};
					$scope.thumbnail.dataUrl = e.target.result;
					console.log("Thumbnail:::::"+$scope.thumbnail.dataUrl);
					$scope.uploading = false;
					$scope.message = false;

				});
			};
		}
		else{
			$scope.thumbnail ={};
			$scope.message= false;
		}
	}; */
});