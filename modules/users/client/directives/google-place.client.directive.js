'use strict';
/*global google*/

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
                    //console.log('element')
                    //console.log(element)
                });
            });
        }
    };
});
