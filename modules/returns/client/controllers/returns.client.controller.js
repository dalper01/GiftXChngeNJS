'use strict';

angular.module('returns').controller('NewReturnsController', ['$http', '$scope', '$state', '$stateParams', '$location', 'Authentication', 'customerReturnService', 'searchProductService',
    function ($http, $scope, $state, $stateParams, $location, Authentication, customerReturnService, searchProductService) {
        $scope.user = Authentication.user;
        console.log('$scope.user');
        console.log($scope.user);
        console.log($scope.user.displayName);
        // bind return service to be used from markup
        //$scope.newCustomerReturnservice = customerReturnService;

        // assign to service reference
        $scope.newCustomerReturn = customerReturnService.getNewCustomerReturn();
        $scope.searchResults = searchProductService.getProductSearch();
        $scope.searchType = 'UPC';
        var promise;
        $scope.authentication = Authentication;
        
        
        $scope.NewUPC = '';
        //$scope.productReturns = [];
        
        $scope.confirmationPage = false;
        
        $scope.checkInput = function (field, fieldName) {
            if (field.length < 1) {
                alert('Please Enter ' + fieldName);
                return 0;
            }
            return 1;
        };
        
        $scope.newReturnHasItems = function() {
            return $scope.newCustomerReturn.returnItems.length > 0;
        };

        $scope.removeItemFromReturn = function (productReturn, allReturns) {
            var index = allReturns.indexOf(productReturn);
            if (index > -1) {
                allReturns.splice(index, 1);
            }
            console.log('product not found');
        };
        
        
        $scope.AddToReturn = function (productReturn) {
            //$scope.productReturns.push(productReturn);
            customerReturnService.addReturnItem(productReturn);
            console.log($scope.newCustomerReturn);
        };
        
        $scope.findKeyword = function (keyword) {
            if (!$scope.checkInput(keyword, 'keyword'))
                return;
            
            
            promise = searchProductService.findKeyword(keyword);
            promise.then(function (data) {
                console.log('returned data:');
                console.log(data);
                console.log('$scope.searchResults');
                console.log($scope.searchResults);
                
            }, function (error) {
                alert(error);
                console.log(error);
            });
        };
        
        
        $scope.findUPC = function (upc) {
            if (!$scope.checkInput(upc, 'UPC'))
                return;
            
            $http({
                url: '/api/validupc/' + $scope.NewUPC,
                //url: '/api/returns/' + $scope.NewUPC,
                method: "GET",
            }).success(function (data, status, headers, config) {
                console.log(data);
                //if (data.UPC == undefined || data.UPC.length == 0 || data.description == undefined || data.description.length == 0) {
                if (data === undefined) {
                    alert('Product Not Found');
                    return;
                }
                searchProductService.setProductSearch(data.data);
                $scope.productsLookUp = data.data.items;
                console.log($scope.productsLookUp);

            }).error(function (data, status, headers, config) {
                alert(status);
                console.log(status);
            });


        };
        
        
        $scope.SaveReturns = function () {
            console.log('customerReturns');
            console.log($scope.newCustomerReturn);
            
            // if user not logged in, prompt for login
            if ($scope.user.name === null || $scope.user.name === undefined) {
                alert('Login / Register to complete return');
                return;
            }
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
            });

        };



    }]);