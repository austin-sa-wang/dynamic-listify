'use strict';

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
    spyOn($rootScope, "$broadcast");
    ListExtractionFactory.broadcast(arbitraryNumber);
    expect($rootScope.$broadcast).toHaveBeenCalledWith(EXPECTED_EVENT_NAME, jasmine.any(Number));
  });

  describe("dependency of AJAX response", function() {
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

  it('separate table container and content', function () {
    var table = document.createElement('table');
    var markup = '<thead></thead><tbody><tr><td>text</td></tr></tbody>';
    table.innerHTML = markup;
    var result = ListExtractionFactory.separateTableIntoContainerAndContent(table);
    expect(result.container.nodeName).toEqual('TABLE');
    expect(result.container.firstChild.nodeName).toEqual('THEAD');
    expect(result.container.children.length).toEqual(1);
    expect(result.content.nodeName).toEqual('TBODY');
    expect(result.content.innerText).toEqual('text');
  });

});
