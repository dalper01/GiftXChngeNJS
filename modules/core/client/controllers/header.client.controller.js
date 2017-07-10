'use strict';

//angular.module('core')
//  .filter('hello', function () {
//    return function (input) {
//        return 'hello ' + input;
//    }
//});

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
    function ($scope, $state, Authentication, Menus) {
        
        $scope.totalMessages = 0;
        $scope.urgentMessages = 0;
        $scope.unreadMessages = 0;


        $scope.countMessagesTypes = function () {
            if ($scope.authentication.user) {

                $scope.totalMessages = $scope.authentication.user.messages.length;
                
                $scope.authentication.user.messages.forEach(function (element) {
                    if (element.status.urgent)
                        $scope.urgentMessages++;
                    
                    if (element.status.unRead)
                        $scope.unreadMessages++;
                });
            }
        }

        // Expose view variables
        $scope.$state = $state;
        $scope.authentication = Authentication;
        console.log($scope.authentication.user);
        //if ($scope.authentication.user) {
        //    $scope.urgentMessages = $scope.authentication.user.messages.count;
        //}
        // Get the topbar menu
        $scope.menu = Menus.getMenu('topbar');
        
        // Toggle the menu items
        $scope.isCollapsed = false;
        $scope.toggleCollapsibleMenu = function () {
            $scope.isCollapsed = !$scope.isCollapsed;
        };
        
        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function () {
            $scope.isCollapsed = false;
        });

        $scope.countMessagesTypes();
    }
]);
