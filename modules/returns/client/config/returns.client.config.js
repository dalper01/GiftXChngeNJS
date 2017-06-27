'use strict';

 //Configuring the Returns module
angular.module('articles').run(['Menus',
function (Menus) {
  // Add the articles dropdown item
  Menus.addMenuItem('topbar', {
    title: 'Returns',
    //state: 'articles',
    //type: 'dropdown',
    roles: ['user']
  });

  // Add the dropdown list item
  Menus.addSubMenuItem('topbar', 'articles', {
    title: 'My Returns',
    state: 'myreturns'
  });

  // Add the dropdown create item
  //Menus.addSubMenuItem('topbar', 'articles', {
  //  title: 'Create Articles',
  //  state: 'articles.create',
  //  roles: ['user']
  //});
}
]);
