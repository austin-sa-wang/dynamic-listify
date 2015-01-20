'use strict';
/*global $:false */

describe('listExtractionFactory', function() {
  var URL = 'base/test/fixtures/fullSample.html';
  var EXPECTED_EVENT_NAME;
  var ListExtractionFactory,
    $rootScope;

  // load modules
  beforeEach(module('listExtractionFactory'));

  beforeEach(inject(function(_$rootScope_, _ListExtractionFactory_) {
    $rootScope = _$rootScope_;
    ListExtractionFactory = _ListExtractionFactory_;
    EXPECTED_EVENT_NAME = ListExtractionFactory.EVENT_NAME;

    // Override min count to quality for the test sample
    ListExtractionFactory.MIN_CHILD_COUNT_TO_QUALITY = 3;
  }));

  it('check the existence of ListExtractionFactory factory', function () {
    expect(ListExtractionFactory).toBeDefined();
  });

  it('.listen method should subscribe to the correct event', function (done) {
    ListExtractionFactory.listen(function (event) {
      expect(event.name).toEqual(EXPECTED_EVENT_NAME);
      done();
    });
    $rootScope.$broadcast(EXPECTED_EVENT_NAME);
  });

  it('broadcast correct event', function () {
    var arbitraryNumber = 0;
    spyOn($rootScope, '$broadcast');
    ListExtractionFactory.broadcast(arbitraryNumber);
    expect($rootScope.$broadcast).toHaveBeenCalledWith(EXPECTED_EVENT_NAME, jasmine.any(Number));
  });

  describe('dependency of AJAX response', function() {
    var markup;
    beforeEach(function (done) {
      $.get(URL).
        done(function (data) {
          markup = data;
          done();
        });
    });

    it('determine correct table count', function () {
      var tableCount = ListExtractionFactory.getTables(markup);
      expect(tableCount).toEqual(2);
    });

    it('make list content available', function() {
      ListExtractionFactory.getTables(markup);
      expect(ListExtractionFactory.lists[0].getElementsByTagName('tbody')[0].children.length).toEqual(4);
      expect(ListExtractionFactory.lists[1].getElementsByTagName('tbody')[0].children.length).toEqual(6);
    });
  });

  it('break table body into chunks', function () {
    var markup = '<tr><td>data00</td></tr>' +
      '<tr><td>data01</td></tr>' +
      '<tr><td>data10</td></tr>';

    var tbody = document.createElement('tbody');
    tbody.innerHTML = markup;

    var fragList = ListExtractionFactory.breakTableBodyIntoFragments(tbody, 2);
    //console.log(fragList[0]);
    expect(fragList.length).toEqual(2);
    expect(fragList[0].childNodes[0].innerText).toEqual('data00');
    expect(fragList[0].childNodes[1].innerText).toEqual('data01');
    expect(fragList[1].childNodes[0].innerText).toEqual('data10');
  });

  it('Prefixes all relative links with host name', function () {
    var markup = '<thead></thead><tbody><tr><td><a href="/child">text</a><img src="/img"></td></tr>' +
      '<tr><td><a href="/child">text</a><img src="/img"></td></tr></tbody>';
    var url = 'http://text.com/page';

    var newMarkup = ListExtractionFactory.fixRelativeLinks(url, markup);
    expect(newMarkup).toEqual('<thead></thead><tbody><tr><td><a href="http://text.com/child">text</a><img src="http://text.com/img"></td></tr>' +
      '<tr><td><a href="http://text.com/child">text</a><img src="http://text.com/img"></td></tr></tbody>');
  });
});
