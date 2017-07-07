'use strict';

angular.module('users').controller('googleMapController', ['$scope', '$http',
    function ($scope, $http) {
        console.log('googleMapController')
        $scope.gPlace;
        $scope.myPlace = null;
        
        
        
        var geoLocationAPIUrl = 'http://freegeoip.net/json/';
        //var geoLocationAPIUrl = 'http://www.geoplugin.net/json.gp'; // need account
        //var geoLocationAPIUrl = 'http://ipinfo.io/json'; // need to use API
        var LatLng;
        var locationData;
        var local;
        var service;
        var map;
        var infowindow;
        var markers = [];
        
        $scope.markers = markers;
        infowindow = new google.maps.InfoWindow();
        
        $http({
            url: geoLocationAPIUrl,
            method: "GET"
        }).success(function (data, status, headers, config) {
            console.log(data);
            locationData = data;
            local = { coords: { latitude: locationData.latitude, longitude: locationData.longitude } };
            //local = { coords: { latitude: locationData.geoplugin_latitude, longitude: locationData.geoplugin_longitude } };
            $scope.local = local;
            console.log('$scope.local');
            console.log($scope.local);
            $scope.createMap(local);

        }).error(function (data, status, headers, config) {
                //upload failed
        });

        
        $scope.createMap = function (position) {
            var localLat = position.coords.latitude;
            var localLng = position.coords.longitude;
            console.log('lat: ' + localLat + ', long:' + localLng);

            LatLng = new google.maps.LatLng(localLat, localLng);
            //$scope.local = local;
            
            map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: localLat, lng: localLng },
                //mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoom: 13
            });
            
            service = new google.maps.places.PlacesService(map);
        }
        
        var moveMap = function (location) {
            map.setCenter(location);
            //console.log('set center: ');
            //console.log(location);
        }
        
        // get current lon / lat and create google map with it
        //navigator.geolocation.getCurrentPosition($scope.createMap);
        //$scope.createMap();
        
        function createMarker(place) {

            var addressArray = place.formatted_address.split(',');
            var placeLoc = place.geometry.location;
            var marker = new google.maps.Marker({
                name: place.name,
                map: map,
                position: place.geometry.location,
                photos: [],
                photo_reference: place.photo_reference,
                place_id: place.place_id,
                id: place.id,
                types: place.types,
                streetAddress: addressArray[0],
                cityStateAddress: addressArray[1] + ', ' + addressArray[2],
                full_address: place.formatted_address,
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)

            });
            if (place.photos != undefined && place.photos.length > 0) {
                console.log(place.photos.length);
                place.photos.forEach(function (element) {
                    //console.log(element);
                    marker.photos.push(element.getUrl({ maxWidth: 640}));
                });
            }
            //console.log(place);
            

            $scope.markers.push(marker);
            
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(place.name);
                infowindow.open(map, this);
            });
        }
        
        function clearMarkers() {
            for (var i = 0; i < $scope.markers.length; i++) {
                $scope.markers[i].setMap(null);
            }
            $scope.markers.length = 0;
        }

        function createMarkers(places) {
            var bounds = new google.maps.LatLngBounds();
            var placesList = document.getElementById('places');
            
            for (var i = 0, place; place = places[i]; i++) {
                var image = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };
                
                var marker = new google.maps.Marker({
                    map: map,
                    icon: image,
                    title: place.name,
                    position: place.geometry.location
                });
                
                placesList.innerHTML += '<li>' + place.name + '</li>';
                
                //bounds.extend(place.geometry.location);
            }
            //map.fitBounds(bounds);
        }
        
        $scope.searchCallback = function (results, status) {
            console.log('searchCallback');
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                clearMarkers();
                for (var i = 0; i < results.length; i++) {
                    var place = results[i];
                    //console.log(place);
                    createMarker(results[i]);
                }
                moveMap($scope.markers[0].position);
                $scope.$digest();
            }
        }
        
        $scope.gmapSearch = function (keyWords) {
            console.log('gmapSearch')
            var request = { query: keyWords, radius: 20, location: LatLng, rankBy: google.maps.places.RankBy.DISTANCE };
            console.log('request');
            console.log(request)
            service.textSearch(request, $scope.searchCallback);
            console.log('textSearch done');
        
        }


        $scope.pickPlace = function (place) {
            $scope.myPlace = place;
            moveMap(place.position);

        }



    }]);

angular.module('users').directive('googleplace', function () {
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
                    console.log('element')
                    console.log(element)
                });
            });
        }
    };
});
//myApp.factory('myService', function() {});
angular.module('users').controller('MyCtrl', ['$scope',
    function ($scope) {
        $scope.gPlace;
    }]);
