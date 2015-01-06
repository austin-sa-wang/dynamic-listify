'use strict';

describe('live search app', function () {

  // load the controller's module
  beforeEach(module('LiveSearchApp'));

  var ctrl,
    scope,
    listFilterFactory;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ctrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  //beforeEach(function() {
  //  inject(function($injector) {
  //    listFilterFactory = $injector.get('listFilterFactory');
  //  })
  //});

  beforeEach(inject(function(_listFilterFactory_) {
    listFilterFactory = _listFilterFactory_;
  }));

  it('check the existence of listFilterFactory factory', inject(function(listFilterFactory) {
    expect(listFilterFactory).toBeDefined();
  }));

  it('should return filtered list', function () {
    var tbody = document.createElement('tbody');
    var dataMarkup = '<tr><td>a</td></tr>' +
      '<tr><td>b</td></tr>' +
      '<tr><td>c</td></tr>';
    tbody.innerHTML = dataMarkup;

    var filteredList = listFilterFactory.filterList(tbody, 'b');
    expect(filteredList.innerText).toEqual('b');
  });
});
