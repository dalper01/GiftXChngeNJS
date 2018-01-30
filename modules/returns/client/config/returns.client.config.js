'use strict';

 //Configuring the Returns module
angular.module('articles').run(['Menus',
function (Menus) {

  // Add the returns dropdown item
  Menus.addMenuItem('topbar', {
    title: 'Returns',
    state: 'returns',
    type: 'dropdown',
    roles: ['user', 'vendor']
  });

  // Add the myreturns list item
  Menus.addSubMenuItem('topbar', 'returns', {
    title: 'Returns',
    state: 'vendor-returns',
    roles: ['vendor']
  });
  Menus.addSubMenuItem('topbar', 'returns', {
    title: 'my Returns',
    state: 'myReturns',
    roles: ['user']
  });
  Menus.addSubMenuItem('topbar', 'returns', {
    title: 'New Return',
    state: 'newreturn',
    roles: ['user']
  });
  // Add the dropdown create item
/*    Menus.addSubMenuItem('topbar', 'returns', {
    title: 'myReturns',
    state: 'myReturns',
    roles: ['user']
  });  */
}
]);
