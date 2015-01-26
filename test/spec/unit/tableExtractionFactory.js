'use strict';
/*global $:false */

describe('tableExtractionFactory', function() {
  var URL = 'base/test/fixtures/fullSample.html';
  var EXPECTED_EVENT_NAME;
  var TableExtractionFactory,
    $rootScope;

  // load modules
  beforeEach(module('tableExtractionFactory'));

  beforeEach(inject(function(_$rootScope_, _TableExtractionFactory_) {
    $rootScope = _$rootScope_;
    TableExtractionFactory = _TableExtractionFactory_;
    EXPECTED_EVENT_NAME = TableExtractionFactory.TABLE_READY_EVENT;

    // Override min count to quality for the test sample
    TableExtractionFactory.MIN_TABLE_ROW_COUNT_TO_QUALITY = 3;
  }));

  it('check the existence of TableExtractionFactory factory', function () {
    expect(TableExtractionFactory).toBeDefined();
  });

  it('.callHandlerWhenTableReady method should subscribe to the correct event', function (done) {
    TableExtractionFactory.callHandlerWhenTableReady(function (event) {
      expect(event.name).toEqual(EXPECTED_EVENT_NAME);
      done();
    });
    $rootScope.$broadcast(EXPECTED_EVENT_NAME);
  });

  it('broadcast correct event', function () {
    var arbitraryNumber = 0;
    spyOn($rootScope, '$broadcast');
    TableExtractionFactory.broadcastTableReady(arbitraryNumber);
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
      var tableCount = TableExtractionFactory.getTables(markup);
      expect(tableCount).toEqual(2);
    });

    it('make table content available', function() {
      TableExtractionFactory.getTables(markup);
      expect(TableExtractionFactory.tables[0].getElementsByTagName('tbody')[0].children.length).toEqual(4);
      expect(TableExtractionFactory.tables[1].getElementsByTagName('tbody')[0].children.length).toEqual(6);
    });
  });
});
