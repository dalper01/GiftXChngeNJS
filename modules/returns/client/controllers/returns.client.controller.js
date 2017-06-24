angular.module('returns').controller('ReturnsController', ['$http', '$scope', '$stateParams', '$location', 'Authentication', 'Articles', 'searchProduct',
    function ($http, $scope, $stateParams, $location, Authentication, Articles, searchProduct) {

        // assign to service reference
        $scope.searchResults = searchProduct.getProductSearch();
        var promise;
        $scope.authentication = Authentication;
        
        $scope.NewUPC = '';
        //$scope.productReturns = [];
        
        $scope.confirmationPage = false;
        
        $scope.checkInput = function () {
            if ($scope.NewUPC.length < 1) {
                alert('Please Enter UPC');
                return 0;
            }
            return 1;
        }
        
        $scope.RemoveReturn = function (productReturn) {
            var index = $scope.productReturns.indexOf(productReturn);
            if (index > -1) {
                $scope.productReturns.splice(index, 1);
            }
        }
        
        
        $scope.AddToReturn = function (productReturn) {
            $scope.productReturns.push(productReturn);
        }
        
        $scope.findKeyword = function (NewUPC) {
            if (!$scope.checkInput())
                return
            
            
            promise = searchProduct.findKeyword(NewUPC);
            promise.then(function (data) {
                //if (data == undefined) {
                //    alert('Product Not Found');
                //    return;
                //}
                //$scope.productsLookUp = data.data.items;
                //$scope.total = data.data.total;
                //$scope.offset = data.data.offset;
                console.log('returned data:');
                console.log(data);
                console.log('$scope.searchResults');
                console.log($scope.searchResults);
                
            }, function (error) {
                alert(error);
                console.log(error);
            });
        }
        
        
        $scope.findUPC = function () {
            if (!$scope.checkInput())
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
                searchProduct.setProductSearch(data.data);
                $scope.productsLookUp = data.data.items;
                console.log($scope.productsLookUp);
                //$scope.productReturns.push(data);
                //$scope.NewUPC = '';

            }).error(function (data, status, headers, config) {
                alert(status);
                console.log(status);
            });


        };
        
        
        $scope.SaveReturns = function () {
            $http({
                url: '/MyExchange/SaveReturns',
                method: "POST",
                data: $scope.productReturns, //this is your json data string
                headers: {
                    'Content-type': 'application/json'
                },
            //responseType: 'arraybuffer'
            }).success(function (data, status, headers, config) {
                //var blob = new Blob([data], { type: "application/pdf" });
                //saveAs(blob, 'Resume.pdf');
                console.log(data);
                $scope.Return = data;
                $scope.confirmationPage = true;

            }).error(function (data, status, headers, config) {
            //upload failed
            });

        }



    }]);