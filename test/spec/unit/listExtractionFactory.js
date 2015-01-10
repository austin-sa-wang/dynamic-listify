'use strict';

describe('listExractionFactory', function() {
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
    ListExtractionFactory.MIN_CHILD_COUNT_TO_QUALITY = 4;
  }));

  it('check the existence of ListExtractionFactory factory', function () {
    expect(ListExtractionFactory).toBeDefined();
  });

  it('.listen method should listen to the correct event', function (done) {
    ListExtractionFactory.listen(function (event) {
      expect(event.name).toEqual(EXPECTED_EVENT_NAME);
      done();
    });
    $rootScope.$broadcast(EXPECTED_EVENT_NAME);
  });

  // Test broadcast in it's isolated jasmine.done block
  describe("broadcast when done", function() {
    beforeEach(function (done) {
      spyOn($rootScope, "$broadcast");

      ListExtractionFactory.extract(URL)
        .then(function () {
          done();
        });
    });

    it('broadcast when done', function () {
      expect($rootScope.$broadcast).toHaveBeenCalledWith(EXPECTED_EVENT_NAME, jasmine.any(Number));
    });

  });

  describe('determine the correct number of lists', function () {
    var markup;

    beforeEach(function (done) {
      $.get(URL).
        done(function (data) {
          markup = data;
          done();
        });
    });

    it('determine the correct number of lists', function () {
      var numberOfLists = ListExtractionFactory.extractLists(markup);
      expect(numberOfLists).toEqual(2);
    });

    it('makes list data accessible', function() {
      ListExtractionFactory.extractLists(markup);
      expect(ListExtractionFactory.lists[0].head.id).toEqual('four-rows');
      expect(ListExtractionFactory.lists[0].data.children.length).toEqual(4);
      expect(ListExtractionFactory.lists[1].head.id).toEqual('six-rows');
      expect(ListExtractionFactory.lists[1].data.children.length).toBeDefined(6);

    });
  });


});
