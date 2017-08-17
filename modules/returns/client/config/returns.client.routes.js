'use strict';

// Configure the 'chat' module routes
angular.module('returns').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
        .state('newreturn', {
            url: '/newreturn',
            templateUrl: 'modules/returns/client/views/returns.client.createReturn.html',
            controller: 'NewReturnsController',
            data: {
                //roles: ['user', 'admin']
            }
        })
        .state('productsearch', {
            url: '/productsearch',
            templateUrl: 'modules/returns/client/views/returns.client.view.findproducts.html',
            controller: 'NewReturnsController',
            data: {
                //roles: ['user', 'admin']
            }
        })
        .state('testconfirmreturn', {
            url: '/testconfirmreturn',            
            templateUrl: 'modules/returns/client/views/returns.client.confirmReturnView.html',
            controller: 'testConfirmController',
            data: {
                //roles: ['user', 'admin']
            }
        })
        .state('confirmreturn', {
            url: '/confirmreturn',
            params: {
                confirmReturn: null
            },            
            templateUrl: 'modules/returns/client/views/returns.client.confirmReturnView.html',
            controller: 'confirmController',
            data: {
                roles: ['user']
            }
        })
        .state('returns', {
            url: '/returns',
            params: {
                confirmReturn: null
            },            
            templateUrl: 'modules/returns/client/views/returns.client.myReturnsView.html',
            controller: 'MyReturnsController',
            data: {
                roles: ['user']
            }
        });
    }
]);
