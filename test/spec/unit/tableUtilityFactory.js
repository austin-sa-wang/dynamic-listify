'use strict';

describe('TableUtilityFactory', function() {
  var TableUtilityFactory;

  beforeEach(module('tableUtilityFactory'));

  beforeEach(inject(function($injector) {
    TableUtilityFactory = $injector.get('TableUtilityFactory');
  }));

  it('break table body into chunks', function () {
    var markup = '<tr><td>data00</td></tr>' +
      '<tr><td>data01</td></tr>' +
      '<tr><td>data10</td></tr>';

    var tbody = document.createElement('tbody');
    tbody.innerHTML = markup;

    var fragList = TableUtilityFactory.breakNodeGroupIntoChunks(tbody, 2);
    expect(fragList.length).toEqual(2);
    expect(fragList[0].childNodes[0].innerText).toEqual('data00');
    expect(fragList[0].childNodes[1].innerText).toEqual('data01');
    expect(fragList[1].childNodes[0].innerText).toEqual('data10');
  });

  it('Prefixes all relative links with host name', function () {
    var markup = '<thead></thead><tbody><tr><td><a href="/child">text</a><img src="/img"></td></tr>' +
      '<tr><td><a href="/child">text</a><img src="/img"></td></tr></tbody>';
    var url = 'http://text.com/page';

    var newMarkup = TableUtilityFactory.fixRelativeLinks(url, markup);
    expect(newMarkup).toEqual('<thead></thead><tbody><tr><td><a href="http://text.com/child">text</a><img src="http://text.com/img"></td></tr>' +
    '<tr><td><a href="http://text.com/child">text</a><img src="http://text.com/img"></td></tr></tbody>');
  });

});

