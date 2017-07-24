'use strict';

angular.module('returns').directive('customerReturn', [function ($compile) {
        return {
            restrict: "AE",
            //controller: 'navController',
            //scope: {
            //    settab: '=',
            //    updateFn: '&'
            //},
            
            templateUrl: "/modules/returns/client/views/returns.client.customerReturnView.html"
        };
    }]);