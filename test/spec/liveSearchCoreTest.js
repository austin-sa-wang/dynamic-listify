'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('listItApp'));
  beforeEach(module('LiveSearchCore'));

  var ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ctrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('unused', function () {
    expect(true);
  });
});
