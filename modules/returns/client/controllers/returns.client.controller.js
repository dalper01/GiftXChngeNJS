angular.module('returns').controller('ReturnsController', ['$http', '$scope', '$stateParams', '$location', 'Authentication', 'Articles',
    function ($http, $scope, $stateParams, $location, Authentication, Articles) {
        
        $scope.authentication = Authentication;
        
        $scope.NewUPC = '';
        $scope.productReturns = [];
        
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
            //var index = $scope.productReturns.indexOf(productReturn);
            //if (index > -1) {
            //    $scope.productReturns.splice(index, 1);
            //}
            
            $scope.productReturns.push(productReturn);

        }
        
        $scope.findKeyword = function () {
            if (!$scope.checkInput())
                return
            
            $http({
                url: '/api/keywordsearch/' + encodeURIComponent($scope.NewUPC),
                method: "GET"
                //params: { keyword: $scope.NewUPC }
            }).success(function (data, status, headers, config) {
                console.log(data);
                //if (data.UPC == undefined || data.UPC.length == 0 || data.description == undefined || data.description.length == 0) {
                if (data == undefined) {
                    alert('Product Not Found');
                    return;
                } 
                
                $scope.productsLookUp = data.data.items;
                $scope.total = data.data.total;
                $scope.offset = data.data.offset;
                console.log($scope.productsLookUp);

            }).error(function (data, status, headers, config) {
                alert(status);
                console.log(status);
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