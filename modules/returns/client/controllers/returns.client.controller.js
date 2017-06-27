angular.module('returns').controller('ReturnsController', ['$http', '$scope', '$state', '$stateParams', '$location', 'Authentication', 'customerReturnService', 'searchProductService',
    function ($http, $scope, $state, $stateParams, $location, Authentication, customerReturnService, searchProductService) {
        $scope.user = Authentication.user;
        //console.log($scope.user);
        //console.log($scope.user.displayName);
        // bind return service to be used from markup
        //$scope.customerReturnService = customerReturnService;

        // assign to service reference
        $scope.customerReturns = customerReturnService.getCustomerReturns();
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
        }
        
        $scope.RemoveReturn = function (productReturn, allReturns) {
            var index = allReturns.indexOf(productReturn);
            if (index > -1) {
                allReturns.splice(index, 1);
            }
        }
        
        
        $scope.AddToReturn = function (productReturn) {
            //$scope.productReturns.push(productReturn);
            customerReturnService.addReturnItem(productReturn);
            console.log($scope.customerReturns);
        }
        
        $scope.findKeyword = function (keyword) {
            if (!$scope.checkInput(keyword, 'keyword'))
                return
            
            
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
        }
        
        
        $scope.findUPC = function (upc) {
            if (!$scope.checkInput(upc, 'UPC'))
                return
            
            $http({
                url: '/api/validupc/' + $scope.NewUPC,
                //url: '/api/returns/' + $scope.NewUPC,
                method: "GET",
            }).success(function (data, status, headers, config) {
                console.log(data);
                //if (data.UPC == undefined || data.UPC.length == 0 || data.description == undefined || data.description.length == 0) {
                if (data == undefined) {
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
            console.log($scope.customerReturns);
            
            // if user not logged in, prompt for login
            if ($scope.user.displayName == null || $scope.user.displayName == undefined)
                alert('Login / Register to complete return')
            $http({
                url: '/api/returns',
                method: "POST",
                data: $scope.customerReturns,
                headers: {
                    'Content-type': 'application/json'
                },
            }).success(function (data, status, headers, config) {
                console.log(data);
                customerReturnService.clearCustomerReturns();
                $state.go('confirmreturn', { confirmReturn: data });
                //$scope.Return = data;
                //$scope.confirmationPage = true;

            }).error(function (data, status, headers, config) {
                //upload failed
            });

        }



    }]);