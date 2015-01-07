'use strict';

describe('live search app', function () {

  // load the controller's module
  beforeEach(module('listFilterFactory'));

  beforeEach(inject(function(_ListFilterFactory_) {
    ListFilterFactory = _ListFilterFactory_;
  }));

  var ListFilterFactory;

  it('check the existence of ListFilterFactory factory', inject(function(ListFilterFactory) {
    expect(ListFilterFactory).toBeDefined();
  }));

  it('should return filtered list', function () {
    var tbody = document.createElement('tbody');
    var dataMarkup = '<tr><td>a</td></tr>' +
      '<tr><td>b</td></tr>' +
      '<tr><td>c</td></tr>' +
      '<tr><td>e</td></tr>' +
      '<tr><td>f</td></tr>';
    tbody.innerHTML = dataMarkup;

    var filteredList = ListFilterFactory.filterList(tbody, 'b');
    expect(filteredList.innerText).toEqual('b');
  });

});
