angular.module('uploadFileService',[])

.service('uploadFile',function($http){
	this.upload =function(file){
		var fd = new FormData(); //is key-value pair
		fd.append('profile',file.upload);
		return $http.post('/upload',fd,{
			//to remove angular serialzation
			transformRequest : angular.identity,
			headers:{'Content-Type':undefined }
		});
	}
})