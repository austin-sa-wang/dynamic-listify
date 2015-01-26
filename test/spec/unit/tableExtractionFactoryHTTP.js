'use strict';

describe('tableExtractionFactory http logic', function() {
  var TARGET_URL = 'http://test.com';
  var EXPECTED_URL = 'http://whateverorigin.org/get?url=' + encodeURIComponent(TARGET_URL) + '&callback=JSON_CALLBACK';
  var FULFILLED_DATA = {
    contents: 'fulfilled_callback_data'
  };
  var REJECTED_REASON = {
    contents: 'rejected_callback_reason'
  };

  var $q,
    $rootScope,
    $httpBackend,
    TableExtractionFactory,
    authRequestHandler;

  // load modules
  beforeEach(module('tableExtractionFactory'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');

    authRequestHandler = $httpBackend.when('JSONP', EXPECTED_URL)
      .respond(FULFILLED_DATA);

    $rootScope = $injector.get('$rootScope');
    $q = $injector.get('$q');
    TableExtractionFactory = $injector.get('TableExtractionFactory');

    // Override timeout time
    TableExtractionFactory.HTTP_REQUEST_TIMEOUT = 300;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('make JSON request', function () {
    $httpBackend.expectJSONP(EXPECTED_URL);
    TableExtractionFactory.extract(TARGET_URL);
    $httpBackend.flush();
  });

  describe('should trigger promise callbacks', function () {
    var fulfilledData;
    var rejectedReason;

    beforeEach(function() {
      fulfilledData = undefined;
      rejectedReason = undefined;
    });

    var expectFulfill = function () {
      expect(fulfilledData).toBeUndefined();
      expect(rejectedReason).toBeUndefined();
      $httpBackend.flush();
      expect(fulfilledData).toEqual(FULFILLED_DATA);
      expect(rejectedReason).toBeUndefined();
    };

    var expectReject = function () {
      expect(fulfilledData).toBeUndefined();
      expect(rejectedReason).toBeUndefined();
      $httpBackend.flush();
      expect(fulfilledData).toBeUndefined();
      expect(rejectedReason).toEqual(REJECTED_REASON);
    };

    var callTimedJsonpFactoryGet = function () {
      return TableExtractionFactory.extract(TARGET_URL)
        .success(
        function (data) {
          fulfilledData = data;
        })
        .error(function (reason) {
          rejectedReason = reason;
          console.log(reason);
        });
    };

    it('propogate fulfilled', function () {
      callTimedJsonpFactoryGet();
      expectFulfill();
    });

    it('propogate rejected', function () {
      authRequestHandler.respond(500, REJECTED_REASON);
      callTimedJsonpFactoryGet();
      expectReject();
    });

    /*
     * BLOCKER: Test case blocked by https://github.com/angular/angular.js/issues/4891
     * AngularJS httpBackend mock does not reject promise on numeric timeout,
     * which contradicts the real behavior
     */
    describe('when timeout', function() {
      beforeEach(function(done) {
        var timeAfterTimeout = TableExtractionFactory.HTTP_REQUEST_TIMEOUT + 100;
        callTimedJsonpFactoryGet();

        setTimeout(function() {
          $httpBackend.flush();
          done();
        }, timeAfterTimeout);

        expect(fulfilledData).toBeUndefined();
        expect(rejectedReason).toBeUndefined();
      });

      it('reject when timeout', function () {
        //expect(fulfilledData).toBeUndefined();
        //expect(rejectedReason).toEqual(TimedJsonpFactory.timeoutReason);
        expect(fulfilledData).toBeDefined();
        expect(rejectedReason).toBeUndefined();
      });
    });

    describe('when delayed response before timeout', function() {
      beforeEach(function(done) {
        var timeBeforeTimeout = TableExtractionFactory.HTTP_REQUEST_TIMEOUT - 100;
        callTimedJsonpFactoryGet();

        setTimeout(function() {
          $httpBackend.flush();
          done();
        }, timeBeforeTimeout);

        expect(fulfilledData).toBeUndefined();
        expect(rejectedReason).toBeUndefined();
      });

      it('fulfill correctly', function () {
        expect(fulfilledData).toEqual(FULFILLED_DATA);
        expect(rejectedReason).toBeUndefined();
      });
    });

  });
});
