'use strict';

module.exports = {
  tests: {
    client: [
      'modules/*/tests/client/**/*.js',
    ],
    server: [
      'modules/articles/tests/server/**/*.js', 
      'modules/users/tests/server/**/*.js', 
  ],
  core: ['modules/core/tests/server/**/*.js'],
  e2e: ['modules/*/tests/e2e/**/*.js']
  }
};
