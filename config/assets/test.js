'use strict';

module.exports = {
  tests: {
    client: [
      'modules/*/tests/client/**/*.js',
      //'modules/articles/tests/client/**/*.js',      
      //'modules/articles/tests/client/articles.client.controller.tests.js',  
      /* 'modules/core/tests/client/core.client.tests.js',           
      'modules/core/tests/client/header.client.controller.tests.js',  */          
      //'modules/articles/tests/client/config/.js',
      //'modules/articles/tests/client/core.client.tests.js'
    ],
    server: [
      'modules/articles/tests/server/**/*.js', 
      'modules/users/tests/server/**/*.js', 
  ],
  core: ['modules/core/tests/server/**/*.js'],
  e2e: ['modules/*/tests/e2e/**/*.js']
  }
};
