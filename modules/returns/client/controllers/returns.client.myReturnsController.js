'use strict';

angular.module('returns').controller('MyReturnsController', ['$http', '$scope', '$state', '$stateParams', '$location', 'Authentication', 'customerReturnService', 'searchProductService',
    function ($http, $scope, $state, $stateParams, $location, Authentication, customerReturnService, searchProductService) {
    	$scope.user = Authentication.user;
        
        $scope.dateFormat = function (dateString) {
            var date = new Date(dateString);
            var year = date.getFullYear();
            ///// Add 1 because JavaScript months start at 0
            var month = (1 + date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = date.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            return month + '/' + day + '/' + year;
        };
        $http({
            //url: constants.uriReturns,
            url: 'api/returns',
            method: "GET"
                //params: { keyword: $scope.NewUPC }
        })
            .success(function (data, status, headers, config) {
            //angular.copy(data.data, _productSearch);
            $scope.myReturns = data;
            //deferred.resolve(data);
        })
            .error(function (error) {
            //deferred.reject(error);
        });



    }]);
