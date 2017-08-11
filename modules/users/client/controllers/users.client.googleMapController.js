'use strict';
/*globals google */

angular.module('users').controller('googleMapController', ['$scope', '$http', 'Users', 'Authentication', 'locationMaps',
    function ($scope, $http, Users, Authentication, locationMaps) {
        
        $scope.user = Authentication.user;
        //$scope.gPlace;
        $scope.myPlace = null;
        $scope.placeConfirmClass = 'map-place-confirm-hidden';

        
        var LatLng;
        var locationData;
        var local;
        var service;
        var map;
        var infowindow;
        //var markers = [];
        
        $scope.markers = locationMaps.GetMarkers();
        //infowindow = new google.maps.InfoWindow();
        
        locationMaps.GetGeoLocationAPI()
        .then(function(data) {
            // Local Lat / Long found
            $scope.local = data;
            locationMaps.CreateMap($scope.local);
        }, function(error) {
            // couldn't get coords
            // Add logic
        });

        
        //locationMaps.CreateMap(position);
/*         $scope.createMap = function (position) {
            var localLat = position.coords.latitude;
            var localLng = position.coords.longitude;
            //console.log('lat: ' + localLat + ', long:' + localLng);

            LatLng = new google.maps.LatLng(localLat, localLng);
            //$scope.local = local;
            
            map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: localLat, lng: localLng },
                //mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoom: 13
            });
            
            service = new google.maps.places.PlacesService(map);
        }; */
/*         
        var moveMap = function (location) {
            map.setCenter(location);
            //console.log('set center: ');
            //console.log(location);
        }; */
        
        // get current lon / lat and create google map with it
        //navigator.geolocation.getCurrentPosition($scope.createMap);
        //$scope.createMap();
/*         function createMarker(place) {

            var addressArray = place.formatted_address.split(',');
            var placeLoc = place.geometry.location;
            var marker = new google.maps.Marker({
                data: {
                    name: place.name,
                    position: place.geometry.location,
                    place_id: place.place_id,
                    id: place.id,
                    types: place.types,
                    streetAddress: addressArray[0],
                    cityStateAddress: addressArray[1] + ', ' + addressArray[2],
                    full_address: place.formatted_address,
                },
                map: map,
                animation: google.maps.Animation.DROP,
                position: place.geometry.location,
                photos: [],
                photo_reference: place.photo_reference,
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)

            });
            marker.addListener('click', mapMarkerClick);

            if (place.photos !== undefined && place.photos.length > 0) {
                console.log(place.photos.length);
                place.photos.forEach(function (element) {
                    //console.log(element);
                    marker.photos.push(element.getUrl({ maxWidth: 640 }));
                });
            }
            //console.log(place);
            

            $scope.markers.push(marker);
            
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(place.name);
                infowindow.open(map, this);
            });
        } */
        
        /* function clearMarkers() {
            for (var i = 0; i < $scope.markers.length; i++) {
                $scope.markers[i].setMap(null);
            }
            $scope.markers.length = 0;
        } */

           
        var searchCallback = function (results, status) {
            console.log('searchCallback');
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                locationMaps.ClearMarkers();
                for (var i = 0; i < results.length; i++) {
                    var place = results[i];
                    //console.log(place);
                    locationMaps.CreateMarker(results[i]);
                }
                //moveMap($scope.markers[0].position);
                $scope.$digest();
            }
        };   
        
        $scope.gmapSearch = function (keyWords) {
            console.log('gmapSearch');
            var request = { 
                query: keyWords, radius: 20, 
                //location: LatLng, 
                rankBy: google.maps.places.RankBy.DISTANCE 
            };
            console.log('request');
            /* console.log(request);
            service.textSearch(request, $scope.searchCallback);
            console.log('textSearch done'); */
        
            locationMaps.GmapSearch(request);
        };


        $scope.pickPlace = function (place) {
            console.log(place);
            if ($scope.myPlace !== null) {
                //$scope.myPlace = null; // reset contents
                $scope.placeConfirmClass = 'map-place-confirm-hidden';
                
                if (!$scope.$$phase) {
                    $scope.$digest();
                }
                window.setTimeout(function () {
                    $scope.myPlace = place;
                    $scope.placeConfirmClass = 'map-place-confirm-rollup';
                    if (!$scope.$$phase) {
                        $scope.$digest();
                    }
                }, 700);

            }
            else {
                $scope.myPlace = place;
                $scope.placeConfirmClass = 'map-place-confirm-rollup';
                if (!$scope.$$phase) {
                    $scope.$digest();
                }
            }
            locationMaps.MoveMap(place.position);
            $scope.myPlace.setAnimation(null);
            place.setAnimation(google.maps.Animation.BOUNCE);
            //place.animation = google.maps.Animation.DROP;
            //$scope.myPlace = place;
            //moveMap(place.position);

        };
        
        // map click call back
        function mapMarkerClick() {
            /*jshint validthis:true */
            $scope.pickPlace(this);
        }


        $scope.saveLocation = function (myPlace) {
            console.log('saveLocation');

            var user = new Users($scope.user);
            user.locationData = myPlace.data;
            
            // remove urgent location message from user object's save
            var urgentLocationMessage = user.messages.find(function (message) {
                return message.title === 'Register your Store';
            });

            //console.log('urgentLocationMessage')
            //console.log(urgentLocationMessage)

            if (urgentLocationMessage !== null) {
                urgentLocationMessage.status.urgent = false;
                urgentLocationMessage.status.unRead = false;
            }


            user.$update(function (response) {
                //$scope.$broadcast('show-errors-reset', 'userForm');
                
                //$scope.success = true;
                Authentication.user = response;
                console.log('save success response');
                console.log(response);



            }, function (response) {
                $scope.error = response.data.message;
                console.log('save error response');
                console.log(response);
            });

        };

        
        // set function to call when map marker is clicked
        locationMaps.SetMarkerClickCallBack(mapMarkerClick);
        locationMaps.SetSearchCallback(searchCallback);

        
    }]);

/* angular.module('users').directive('googleplace', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: { country: "usa" }
            };
            scope.service = new google.maps.places.AutocompleteService();
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
            
            //scope.service.getQueryPredictions({ input: element.val() || '' }, scope.displaySuggestions);
            
            google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                scope.$apply(function () {
                    model.$setViewValue(element.val());
                    //console.log('element')
                    //console.log(element)
                });
            });
        }
    };
});
 */