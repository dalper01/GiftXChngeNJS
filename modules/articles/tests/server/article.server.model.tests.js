'use strict';
console.log('Article Model Unit Tests');
/**
 * Module dependencies.
 */
var should = require('should'),
//  assert = require('assert'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Article = mongoose.model('Article');

/**
 * Globals
 */
var user, article;

/**
 * Unit tests
 */
describe('Article Model Unit Tests:', function () {

  beforeEach(function (done) {
    user = new User({
      name: 'Full Name',
      displayName: 'Full Name',
      email: 'testAMUT@test.com',
      password: 'M3@n.jsI$Aw3$0m3',
      provider: 'local'
    });

    user.save(function () {
      article = new Article({
        title: 'Article Title',
        content: 'Article Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      article.save(function (err) {
        //console.log('Method Save success');
        //console.log(err);
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      article.title = '';

      article.save(function (err) {
        //console.log('article.save no title');
        //console.log(err);
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Article.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
