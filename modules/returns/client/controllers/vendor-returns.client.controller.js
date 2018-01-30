'use strict';
angular.module('returns').directive('deciFormat', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;

            ctrl.$formatters.unshift(function (a) {
                return $filter('number')(ctrl.$modelValue);
            });

            elem.bind('blur', function(event) {
                var plainNumber = elem.val().replace(/[^\d|\-+|\.+]/g, '');
                elem.val($filter('number')(plainNumber));
                elem.val($filter('number')(ctrl.$modelValue, 2));
            });
        }
    };
}]);
angular.module('returns').controller('VendorReturnsController', ['$http', '$scope', '$state', '$stateParams', 'Authentication', 'customerReturnService', '$filter',
    function ($http, $scope, $state, $stateParams, Authentication, customerReturnService, $filter) {
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


        $scope.createOffer = function(returnRequest) {

            console.log('returnRequest');
            console.log(returnRequest);
            /* requesting hash of returnRequest["_id"] raises linter error */
            var idAccessor="_id";
/*             $http({
                url: '/api/createoffer/'+ returnRequest[idAccessor],
                method: "POST",                
                data: { 'returnRequest': returnRequest },
                headers: {
                    'Content-type': 'application/json'
                },
            })
                .success(function (data, status, headers, config) {
                console.log(data);
            })
                .error(function (error) {
            });
 */
/* 
            $http({
                url: '/api/returns',
                method: "POST",
                data: $scope.newCustomerReturn,
                headers: {
                    'Content-type': 'application/json'
                },
            }).success(function (data, status, headers, config) {
                console.log(data);
                customerReturnService.clearNewCustomerReturn();
                $state.go('confirmreturn', { confirmReturn: data });
                //$scope.Return = data;
                //$scope.confirmationPage = true;

            }).error(function (data, status, headers, config) {
                //upload failed
            }); */

            returnRequest.offer = false;
            console.log('returnRequest');
            console.log(returnRequest);
        };


        $scope.validateCurrency = function(offerAmount) {
            offerAmount = $filter('currency')(offerAmount);
        };




        // get all returns for Vendor

        $http({
            url: 'api/returns',
            method: "GET"
        })
            .success(function (data, status, headers, config) {
            //angular.copy(data.data, _productSearch);
            $scope.returnsRequests = data;
            //deferred.resolve(data);
        })
            .error(function (error) {
            //deferred.reject(error);
        });



    }]);
