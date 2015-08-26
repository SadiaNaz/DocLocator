
angular.module("DoctorFind",['autocomplete'])
		.config(function ($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise("/index.html");
			$stateProvider.state('viewDoctors', {
					url: "",
					templateUrl: "templates/FormDisplay.html",
					controller: "DocFindCtrl"
				})
	})
		
		.factory('nameRetriever', function($http, $q, $timeout){
		  var nameRetriever = new Object();

		  
		var param = function(data) {
			var returnString = '';
			for (d in data){
				if (data.hasOwnProperty(d))
				   returnString += 'name' + '=' + data[d] + '&';
			}
			// Remove last ampersand and return
			return returnString.slice( 0, returnString.length - 1 );
		};
			
		nameRetriever.getNames = function(name) {
			var defer = $q.defer();
					
			$http({
				method : 'POST',
				url : 'names.php',
				data : 'name=' + name,
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' } // set the headers so angular passing info as form data (not request payload)
			  }).success(function(response) 
			   {
				   return defer.resolve(response);	
			});
			

			return defer.promise;
		  }

		  return nameRetriever;
		})
		
		.controller('DocFindCtrl',function($scope, $http, nameRetriever) {
			$scope.doctors = "";
			$scope.user = {};
			$scope.names = {};
			
			
			$scope.init = function() {
					window.localStorage.removeItem('Doctors');
					window.localStorage.removeItem('Options');
					window.localStorage.removeItem('Name');
			  };
			  // runs once per controller instantiation
			  $scope.init();
			
			$scope.getNames = function(){
				return $scope.names;
			}
			
			$scope.doSomething = function(typedthings){
				console.log("Do something like reload data with this: " + typedthings );
				$scope.newmovies = nameRetriever.getNames(typedthings);
				$scope.newmovies.then(function(data){
				  $scope.names = data;
				});
			}

			$scope.doSomethingElse = function(suggestion){
				console.log("Suggestion selected: " + suggestion );
			}
  
			var param = function(data) {
				var returnString = '';
				for (d in data){
					if (data.hasOwnProperty(d))
					   returnString += d + '=' + data[d] + '&';
				}
				// Remove last ampersand and return
				//alert(returnString.slice( 0, returnString.length - 1 ));
				return returnString.slice( 0, returnString.length - 1 );
			};
			
			$scope.getDoctors = function(user,option){
				DataUrl = "";
				if(option == 1){
					DataUrl = 'data.php'
				}
				else if (option == 2){
					DataUrl = 'dataSpeciality.php';
				}
				else{
					DataUrl = 'dataTime.php';
				}
				
				$http({
					method : 'POST',
					url : DataUrl,
					data : param(user), // pass in data as strings
					headers : { 'Content-Type': 'application/x-www-form-urlencoded' } // set the headers so angular passing info as form data (not request payload)
					}).success(function(data) {
						$scope.doctors = data;	
						$scope.user = {}; // form fields are emptied with this line
						
						window.localStorage['Doctors'] = JSON.stringify($scope.doctors);
						window.localStorage['Options'] = JSON.stringify(user);
						if($scope.doctors.length == 0){
							alert("No Results Found");
							window.location.href = 'index.html';
						}
						else{
							window.location.href = 'search.html';
						}
					});
				
				};
				
				

		  });
		  
		  


angular.module("DocDisp",['autocomplete'])
		.config(function ($stateProvider, $urlRouterProvider) {
		//	$urlRouterProvider.otherwise("/index.html");
			$stateProvider.state('viewDoctors', {
					url: "",
					templateUrl: "templates/DocDisplay.html",
					controller: "DocDispCtrl"
				})
	})
		.factory('nameRetriever', function($http, $q, $timeout){
		  var nameRetriever = new Object();

		  
		var param = function(data) {
			var returnString = '';
			for (d in data){
				if (data.hasOwnProperty(d))
				   returnString += 'name' + '=' + data[d] + '&';
			}
			// Remove last ampersand and return
			return returnString.slice( 0, returnString.length - 1 );
		};
			
		nameRetriever.getNames = function(name) {
			var defer = $q.defer();
					
			$http({
				method : 'POST',
				url : 'names.php',
				data : 'name=' + name,
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' } // set the headers so angular passing info as form data (not request payload)
			  }).success(function(response) 
			   {
				   return defer.resolve(response);	
			});
			

			return defer.promise;
		  }

		  return nameRetriever;
		})
			
		.controller('DocDispCtrl',function($scope, $http, nameRetriever) {
			$scope.Doctors = {};
			$scope.doctor = {};
			$scope.user = {};
			$scope.names = {};
			$scope.formOptions = {};
			
			$scope.init = function() {
/* 				$scope.Doctors = JSON.parse(window.localStorage['Doctors']);
				$scope.formOptions = JSON.parse(window.localStorage['Options']);
				$scope.user.docType = $scope.formOptions.docType;
				$scope.user.datetime = $scope.formOptions.datetime;
				$scope.user.gender = $scope.formOptions.gender;
				$scope.user.hospital = $scope.formOptions.hospital;
				if($scope.formOptions.name != null){
					$scope.user.name = $scope.formOptions.name;
				} */
				
				
								////////////////////////////////////////////////////////////////////////////// map
				
				


          //Angular App Module and Controller
         
			            
			 var _lat =0;
			 var _long=0;
			 navigator.geolocation.getCurrentPosition(function(position) {
			  $scope.pos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
											   
			 var geocoder = new google.maps.Geocoder();
			geocoder.geocode({'location': $scope.pos}, function(results, status) {			   
			  $scope.$apply(function() {
				  
				  
				  
				  				$scope.Doctors = JSON.parse(window.localStorage['Doctors']);
				$scope.formOptions = JSON.parse(window.localStorage['Options']);
				$scope.user.docType = $scope.formOptions.docType;
				$scope.user.datetime = $scope.formOptions.datetime;
				$scope.user.gender = $scope.formOptions.gender;
				$scope.user.hospital = $scope.formOptions.hospital;
				if($scope.formOptions.name != null){
					$scope.user.name = $scope.formOptions.name;
				}
				
			 
             var mapOptions = {
                  zoom: 12,
				//center: new google.maps.LatLng(33.713350, 73.057572),
				
				center: $scope.pos ,

                 // mapTypeId: google.maps.MapTypeId.TERRAIN
              }

              $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

/* 			 var marker = new google.maps.Marker({
                     map: $scope.map,
                     position: new google.maps.LatLng(33.713350, 73.057572),
                     // position: info.position,
					//  title: info.city
                  }); */
				  
			  
              $scope.markers = [];
              
              var infoWindow = new google.maps.InfoWindow();
              
              var createMarker = function (info,isCurrent){
					var iconColor='http://maps.google.com/mapfiles/ms/icons/red-dot.png';
				  if(isCurrent == 1)
					var iconColor='http://maps.google.com/mapfiles/ms/icons/green-dot.png';
  
				  
                  var marker = new google.maps.Marker({
                      map: $scope.map,
					  icon:iconColor,
                     position: new google.maps.LatLng(info.lat, info.long),
                     // position: info.position,
					  title: info.city
                  });
                 marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
                  
           //  marker.content = '<div class="infoWindowContent">' + 'Current Location' + '</div>';

			 google.maps.event.addListener(marker, 'click', function(){
                      infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                      infoWindow.open($scope.map, marker);
                  });
                  
                  $scope.markers.push(marker);
                  
              }
			  
			  

    if (status == google.maps.GeocoderStatus.OK) {
				if (results[2]) { 
				
				
				
							 var info = {
                 city: "Your Location",
                 lat: $scope.pos.lat(),
				 long: $scope.pos.lng(),
                 desc: results[2].formatted_address 
              }

createMarker(info,1);


				}
				
				}
				
			
			  

/*
   // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
									   
									   
		 var mapOptions = {
                  zoom: 13,
                  center: pos,
                  //mapTypeId: google.maps.MapTypeId.TERRAIN
              }

              $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);							   

		var info = {
                  city: "Current Location",
                 lat: pos.lat(),
				 long: pos.lng(),
                  desc: "Address will come here!"
              }

									   
//createMarker(info);
				  
      var infowindow = new google.maps.InfoWindow({
        map: $scope.map,
        position: pos,
        content: 'Location found using HTML5.'
      });
	  
	var marker = new google.maps.Marker({
        map: $scope.map,
        position: pos,
        title: "Current Location"
      });


 $scope.map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }

*/	


			  
			
			$scope.uniqueHospitals = [];
			
			  
			for (i = 0; i < $scope.Doctors.length; i++){
				var isPresent = 1;
				
				for (j = 0; j < $scope.uniqueHospitals.length; j++){
					
				if ($scope.uniqueHospitals[j] == $scope.Doctors[i].location)
				isPresent = 0;
				
				}
					
				if(isPresent == 1)		$scope.uniqueHospitals.push($scope.Doctors[i].location);
						
			/* 	var info = {
                 city: $scope.Doctors[i].location,
                // lat: results[0].geometry.location.lat(),
				 //long: results[0].geometry.location.lng(),
				 lat: 33.6974,
				 long: 73.0117,
                  desc: $scope.Doctors[i].name
              }	 */
              //   createMarker(info,0);

              }
			  
	  	for (j = 0; j < $scope.uniqueHospitals.length; j++){
					
					var description = "<pre> \n\r";
					for (i = 0; i < $scope.Doctors.length; i++){
						if($scope.Doctors[i].location == $scope.uniqueHospitals[j]){
							description = description + $scope.Doctors[i].name + "\n\r" ;
						}
					}
					description = description +"\n\r" ;
					
			var info = {
                 city: $scope.uniqueHospitals[j],
                // lat: results[0].geometry.location.lat(),
				 //long: results[0].geometry.location.lng(),
				 lat: 33.6974,
				 long: 73.0117,
                  desc: description 
              }	
				createMarker(info,0);
				}
			 

              $scope.openInfoWindow = function(e, selectedMarker){
                  e.preventDefault();
                  google.maps.event.trigger(selectedMarker, 'click');
              }
			  
			 	});
				
          });
		  
		  });
		  
				
				////////////////////////////////////////////////////////////////////////////// map
				
				
				
			  };
			  // runs once per controller instantiation
			  $scope.init();
			  
			
			$scope.getDoctor = function(name){
				
				window.localStorage['Name'] = JSON.stringify(name);
				window.location.href = 'pro.html';				
			  
			};
				
			var param = function(data) {
				var returnString = '';
				for (d in data){
					if (data.hasOwnProperty(d))
					   returnString += d + '=' + data[d] + '&';
				}
				// Remove last ampersand and return
				//alert(returnString.slice( 0, returnString.length - 1 ));
				return returnString.slice( 0, returnString.length - 1 );
			};
			
			$scope.getDoctors = function(user){
				$http({
					method : 'POST',
					url : 'searchAll.php',
					data : param(user), // pass in data as strings
					headers : { 'Content-Type': 'application/x-www-form-urlencoded' } // set the headers so angular passing info as form data (not request payload)
			  }).success(function(data) {
						$scope.doctors = data;	
						$scope.user = {}; // form fields are emptied with this line
						
						window.localStorage.removeItem('Doctors');
						window.localStorage['Doctors'] = JSON.stringify($scope.doctors);
						if($scope.doctors.length == 0){
							alert("No Results Found");
							window.location.href = 'index.html';
						}
						else{
							window.location.href = 'search.html';
						}
					});
				  
				};
				
			$scope.getNames = function(){
				return $scope.names;
			}
			
			$scope.doSomething = function(typedthings){
				console.log("Do something like reload data with this: " + typedthings );
				$scope.newmovies = nameRetriever.getNames(typedthings);
				$scope.newmovies.then(function(data){
				  $scope.names = data;
				});
			}

			$scope.doSomethingElse = function(suggestion){
				console.log("Suggestion selected: " + suggestion );
			}
		  
		});
		
		
angular.module("DocProf",['ui.router'])
		.config(function ($stateProvider, $urlRouterProvider) {
			//$urlRouterProvider.otherwise("/index.html");
			$stateProvider.state('viewDoctors', {
					url: "",
					templateUrl: "templates/DocProfile.html",
					controller: "DocProfileCtrl"
				})
	})
		
	/* 	.factory('Data', function(){
			return {message:"At your service"}
	}) */
			
		.controller('DocProfileCtrl',function($scope) {
			$scope.Doctors = {};
			$scope.Doctor = {};
			$scope.init = function() {
				$scope.Doctors = JSON.parse(window.localStorage['Doctors']);
				$scope.Doctor = JSON.parse(window.localStorage['Name']);
			  };
			  // runs once per controller instantiation
			$scope.init();
			

			$scope.nextProfile = function() {
					
				for (i = 0; i < $scope.Doctors.length; i++) { 
					if($scope.Doctors[i].name == $scope.Doctor){
						$scope.Doctor = $scope.Doctors[i+1].name;
						break;
					}
				}

			};
			
			$scope.prevProfile = function() {
				for (i = 0; i < $scope.Doctors.length; i++) { 
					if($scope.Doctors[i+1].name == $scope.Doctor){
						$scope.Doctor = $scope.Doctors[i].name;
						break;
					}
				}

			};
		  
		});
		