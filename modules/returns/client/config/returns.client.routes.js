'use strict';

// Configure the 'chat' module routes
angular.module('returns').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
      .state('newreturn', {
            url: '/newreturn',
            templateUrl: 'modules/returns/client/views/returns.client.createReturn.html',
            controller: 'ReturnsController',
            data: {
                //roles: ['user', 'admin']
            }
        });
    }
]);
