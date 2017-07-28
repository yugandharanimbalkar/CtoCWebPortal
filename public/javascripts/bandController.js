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

app.factory('bandService',function($http,$resource){
  var baseUrl ="/band/bandGetAll";
  var factory = {};
  factory.getAll = function(){
    return $http.get(baseUrl);
  }
  return factory;
});


app.controller('bandController', function($rootScope,$scope,$http,$location,bandService){

  var Id = localStorage.getItem("Id");
  console.log("ID:: "+Id);
  $scope.bands={band_name:'',style:'',x_factor:''};
  $scope.band={band_name:'',style:'',x_factor:''};
     console.log("Data : ");
      
      /*
      $http.get('/band/bandGetAll').success(function(data){
        console.log(data);
      })*/

      $http.get('/band/bandGet/'+Id).then(function(data){
        console.log(data);
        $scope.band = data.data;
      })


      bandService.getAll().success(function(data){
        console.log(data);
        $scope.bands = data ;
        console.log("BANDS:::");
        console.log($scope.bands);
      });
     
      $scope.addNewBand = function(){
        $location.path('/addBand');
      }


      $scope.addBand = function(){
       console.log($scope.band);
       $http.post('/band/bandpost',$scope.band).success(function(response){
          console.log("HHHHHHHHHHH");
          console.log(response);
       });
      }

  });  


/*
$scope.users=[{"band_name":"Hip-Hop Tamizha","location":"Chennai","genre":"Hip-Hop","influences":{"Michael Jackson","Jay-Z"},"x_factor":"Witty lyrics in the local language fused with the beats of hip-hop","members":{"Adi","Jeeva"}},
			 {"band_name":"Skrat","location":"Chennai","genre":"Alternative rock","influences":{"The Raconteurs","The Supergrass","The Hives"},"x_factor":" Exuding a boyish charm, their hummable tunes with bright bold music.","members":{" Sriram T.T","Satish Narayanan","Tapass Naresh"}},
       {"band_name":"Grasshopper Green","location":"Chennai","genre":"Rock and Jam Band","influences":{},"x_factor":"The colloquial Tamil and English = 'Tanglish' lyrics and their edgy and unpredictable music.","members":{"Shudeep","Hari","Sandeep","Sunil"}},
        {"band_name":"F16’s","location":"Chennai","genre":"Electro Indie","influences":{},"x_factor":"Electric and edgy music with boldness","members":{"Shashank Manohar","Josh Fernandez","Harshan Radha Krishnan","Vikram Yesudas","Abhinav Krishnaswamy"}}] 
*/
//$scope.users="New Users";

