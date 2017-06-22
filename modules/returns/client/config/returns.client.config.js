'use strict';

// Configuring the Chat module
angular.module('returns').run(['Menus',
    function (Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', {
            title: 'New Return',
            state: 'newReturn'
        });
    }
]);
