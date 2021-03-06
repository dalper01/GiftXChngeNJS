﻿'use strict';

//Product service used for communicating with the articles REST endpoints
angular.module('returns').factory('customerReturnService', ['$resource', '$http', '$q',
    function ($resource, $http, $q) {
        
        // url's for http call -- should be centralized
        var constants = {
            //uriSearchKeyword: '/api/keywordsearch/',
            //uriSearchKeywordTest: '/api/bditemsearch/',
            //uriSearchProvideUPC: ''
            uriReturns: '/api/returns'
        };
        
        var customerReturnService = {};
        
        // initialize product search response repo        
        var _newCustomerReturn = {
            returnItems: []
        };
        
        customerReturnService.getNewCustomerReturn = function () {
            return _newCustomerReturn;
        };
        
        customerReturnService.setNewCustomerReturn = function (data) {
            angular.copy(data, _newCustomerReturn);
        };
        
        customerReturnService.clearNewCustomerReturn = function () {
            customerReturnService.setNewCustomerReturn({ returnItems: [] });
        };
        
        customerReturnService.addReturnItem = function (item) {
            _newCustomerReturn.returnItems.push(item);
        };
        
        customerReturnService.removeReturnItem = function (item) {
            _newCustomerReturn.returnItems.push(item);
        };
        
        // Search for product-items by keyword descriptions and filters
        customerReturnService.getReturns = function () {
            var deferred = $q.defer();
            
            $http({
                url: constants.uriReturns,
                method: "GET"
                //params: { keyword: $scope.NewUPC }
            })
            .success(function (data, status, headers, config) {
                //setProductSearch() -- refactor
                //angular.copy(data.data, _productSearch);
                deferred.resolve(data);
            })
            .error(function (error) {
                deferred.reject(error);
            });
            
            return deferred.promise;
        };

        
        
        
        
        return customerReturnService;

    }]);
