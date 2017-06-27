'use strict';

//Product service used for communicating with the articles REST endpoints
angular.module('returns').factory('searchProductService', ['$resource', '$http', '$q',
    function ($resource, $http, $q) {
        
        // url's for http call -- should be centralized
        var constants = {
            uriSearchKeyword: '/api/keywordsearch/',
            uriSearchKeywordTest: '/api/bditemsearch/',
            uriSearchProvideUPC: ''
        };
        
        // product search response repo        
        var _productSearch = {};
        
        
        // service object with data setters and getters
        var returnService = {
            getProductSearch: function () {
                return _productSearch;
            },
            setProductSearch: function (data) {
                angular.copy(data, _productSearch);
            }
        };
        
        
        // Search for product-items by keyword descriptions and filters        
        returnService.findKeyword = function (NewUPC) {
            var deferred = $q.defer();
            
            $http({
                url: constants.uriSearchKeyword + encodeURIComponent(NewUPC),
                method: "GET"
                //params: { keyword: $scope.NewUPC }
            })
            .success(function (data, status, headers, config) {
                //setProductSearch() -- refactor
                angular.copy(data.data, _productSearch);
                deferred.resolve(data);
            })
            .error(function (error) {
                deferred.reject(error);
            });
            
            return deferred.promise;
        }

        return returnService;

    }]);
