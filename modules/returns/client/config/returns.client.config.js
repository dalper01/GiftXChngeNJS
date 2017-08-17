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
    state: 'returns',
    roles: ['user']
  });

  // Add the dropdown create item
  //Menus.addSubMenuItem('topbar', 'articles', {
  //  title: 'Create Articles',
  //  state: 'articles.create',
  //  roles: ['user']
  //});
}
]);
