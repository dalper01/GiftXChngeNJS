'use strict';

(function() {
  // Password controller Spec
  describe('PasswordController', function() {
    // Initialize global variables
    var PasswordController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      $window;

    beforeEach(function() {
      jasmine.addMatchers({
        toEqualData: function(util, customEqualityTesters) {
          return {
            compare: function(actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Load the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    describe('Logged in user', function() {
      beforeEach(inject(function($controller, $rootScope, _Authentication_, _$stateParams_, _$httpBackend_, _$location_) {
        // Set a new global scope
        scope = $rootScope.$new();

        // Point global variables to injected services
        $stateParams = _$stateParams_;
        $httpBackend = _$httpBackend_;
        $location = _$location_;
        $location.path = jasmine.createSpy().and.returnValue(true);

        // Mock logged in user
        _Authentication_.user = {
          email: 'testPassClientCont@test.com',
          roles: ['user']
        };

        // Initialize the Authentication controller
        PasswordController = $controller('PasswordController', {
          $scope: scope
        });
      }));

      it('should redirect logged in user to home', function() {
        expect($location.path).toHaveBeenCalledWith('/');
      });
    });

    describe('Logged out user', function() {
      beforeEach(inject(function($controller, $rootScope, _$window_, _$stateParams_, _$httpBackend_, _$location_) {
        // Set a new global scope
        scope = $rootScope.$new();

        // Point global variables to injected services
        $stateParams = _$stateParams_;
        $httpBackend = _$httpBackend_;
        $location = _$location_;
        $location.path = jasmine.createSpy().and.returnValue(true);
        $window = _$window_;
        $window.user = null;

        // Initialize the Authentication controller
        PasswordController = $controller('PasswordController', {
          $scope: scope
        });
      }));

      it('should not redirect to home', function() {
        expect($location.path).not.toHaveBeenCalledWith('/');
      });

      describe('askForPasswordReset', function() {
        var credentials = {
          email: 'testPassClientCont@test.com',
          password: 'P@ssw0rd!!'
        };
        beforeEach(function() {
          scope.credentials = credentials;
        });

        it('should clear scope.success and scope.error', function() {
          scope.success = 'test';
          scope.error = 'test';
          scope.askForPasswordReset(true);
          setTimeout(function() { 
            it('should clear form', function() {
              expect(scope.success).toBeNull();
            });

            it('should set error to response message', function() {
              expect(scope.error).toBeNull();
            });
          }, 300);
          
        });

        describe('POST error', function() {
          var errorMessage = 'No account with that Email has been found';
          beforeEach(function() {
            $httpBackend.when('POST', '/api/auth/forgot', credentials).respond(400, {
              'message': errorMessage
            });

            scope.askForPasswordReset(true);
            $httpBackend.flush();
          });

          // add timeout for Controller to respond to error
          setTimeout(function() { 
            it('should clear form', function() {
              expect(scope.credentials).toBe(null);
            });

            it('should set error to response message', function() {
              expect(scope.error).toBe(errorMessage);
            });
          }, 300);

        });

        describe('POST success', function() {
          var successMessage = 'An email has been sent to the provided email with further instructions.';
          beforeEach(function() {
            $httpBackend.when('POST', '/api/auth/forgot', credentials).respond({
              'message': successMessage
            });

            scope.askForPasswordReset(true);
            $httpBackend.flush();
          });

          setTimeout(function() { 
            it('should clear form', function() {
              expect(scope.credentials).toBe(null);
            });

            it('should set error to response message', function() {
              expect(scope.error).toBe(successMessage);
            });
          }, 300);
        });
      });

      describe('resetUserPassword', function() {
        var token = 'testToken';
        var passwordDetails = {
          password: 'test'
        };
        beforeEach(function() {
          $stateParams.token = token;
          scope.passwordDetails = passwordDetails;
        });

        it('should clear scope.success and scope.error', function() {
          scope.success = 'test';
          scope.error = 'test';
          scope.resetUserPassword(true);

          expect(scope.success).toBeNull();
          expect(scope.error).toBeNull();
        });

        it('POST error should set scope.error to response message', function() {
          var errorMessage = 'Passwords do not match';
          $httpBackend.when('POST', '/api/auth/reset/' + token, passwordDetails).respond(400, {
            'message': errorMessage
          });

          // block problems from view loads during flush
          $httpBackend.when('GET', /\.html$/).respond('');          

          scope.resetUserPassword(true);
          $httpBackend.flush();

          expect(scope.error).toBe(errorMessage);
          /* setTimeout(function() { 
            expect(scope.error).toBe(errorMessage);
          }, 300); */
          

        });

        describe('POST success', function() {
          var user = {
            username: 'test'
          };
          beforeEach(function() {
            $httpBackend.when('POST', '/api/auth/reset/' + token, passwordDetails).respond(user);
            
            // block problems from view loads during flush
            $httpBackend.when('GET', /\.html$/).respond(''); 
            
            scope.resetUserPassword(true);
            $httpBackend.flush();
          });

          it('should clear password form', function() {
            expect(scope.passwordDetails).toBe(null);
          });

          it('should attach user profile', function() {
            expect(scope.authentication.user).toEqual(user);
          });

          it('should redirect to password reset success view', function() {
            expect($location.path).toHaveBeenCalledWith('/password/reset/success');
          });
        });
      });
    });
  });
}());
