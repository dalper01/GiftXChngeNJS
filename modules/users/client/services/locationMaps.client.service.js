'use strict';

// Authentication service for user variables
angular.module('users').factory('locationMaps', ['$http', '$q',
  function ($http, $q) {
    var googlePlacesService = null;
    var userLatLng;
    var localCoords = null;
    var map;
    var markerClickCallBack = null;
    var searchCallback = null;    
    var infowindow = new google.maps.InfoWindow();
    var markers = [];

    var getMarkers = function() {
        return markers;

    }

    var getGeoLocationAPI = function() {
        
        var deferred = $q.defer();
        var geoLocationAPIUrl = 'https://freegeoip.net/json/';
        //var geoLocationAPIUrl = 'https://www.geoplugin.net/json.gp'; // need account
        //var geoLocationAPIUrl = 'https://ipinfo.io/json'; // need to use API

        $http({
            url: geoLocationAPIUrl,
            method: "GET"
        }).success(function (data, status, headers, config) {
            console.log(data);
            //locationData = data;
            // refactor into create Coords Function
            localCoords = { coords: { latitude: data.latitude, longitude: data.longitude } };
            deferred.resolve(localCoords);
        }).error(function (data, status, headers, config) {
                //upload failed
                deferred.reject(data);
        });
        return deferred.promise;
    };

    var createMap = function (position) {
            var localLat = position.coords.latitude;
            var localLng = position.coords.longitude;
            //console.log('lat: ' + localLat + ', long:' + localLng);

            userLatLng = new google.maps.LatLng(localLat, localLng);
            //$scope.local = local;
            
            map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: localLat, lng: localLng },
                //mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoom: 13
            });
            
            googlePlacesService = new google.maps.places.PlacesService(map);
        };
                
        var moveMap = function (location) {
            map.setCenter(location);
            //console.log('set center: ');
            //console.log(location);
        };

        var gmapSearch = function(requestOptions) {
            requestOptions.location = userLatLng;
            googlePlacesService.textSearch(requestOptions, searchCallback);

        }

        /* var searchCallback = function (results, status) {
            console.log('searchCallback');
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                clearMarkers();
                for (var i = 0; i < results.length; i++) {
                    var place = results[i];
                    //console.log(place);
                    createMarker(results[i]);
                }
                moveMap(markers[0].position);
                //$scope.$digest();
            }
        }; */

        var clearMarkers = function() {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers.length = 0;
        }

        var createMarker = function(place) {

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
            //marker.addListener('click', mapMarkerClick);
            marker.addListener('click', markerClickCallBack);

            if (place.photos !== undefined && place.photos.length > 0) {
                console.log(place.photos.length);
                place.photos.forEach(function (element) {
                    //console.log(element);
                    marker.photos.push(element.getUrl({ maxWidth: 640 }));
                });
            }
            //console.log(place);
            

            markers.push(marker);
            
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(place.name);
                infowindow.open(map, this);
            });
        }

        // Controller function to call when map marker is clicked
        var setMarkerClickCallBack = function (callback) {
            markerClickCallBack = callback;
        }
        
        var setSearchCallback = function (callback) {
            searchCallback = callback;
        }
        
    return {
        SetMarkerClickCallBack: setMarkerClickCallBack,
        SetSearchCallback: setSearchCallback,
        GetGeoLocationAPI: getGeoLocationAPI,
        CreateMap: createMap,
        ClearMarkers: clearMarkers,
        CreateMarker: createMarker,
        GmapSearch: gmapSearch,
        MoveMap: moveMap,
        GetMarkers: getMarkers,
    };
  }
]);
