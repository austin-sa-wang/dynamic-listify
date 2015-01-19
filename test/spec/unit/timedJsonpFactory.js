'use strict';

describe('timedJsonpFactory', function() {
  var TARGET_URL = 'http://test.com';
  var FULFILLED_DATA = {
    contents: 'fulfilled_callback_data'
  };
  var REJECTED_REASON = {
    contents: 'rejected_callback_reason'
  };

  var $q,
    $rootScope,
    $httpBackend,
    TimedJsonpFactory,
    authRequestHandler;

  // load modules
  beforeEach(module('timedJsonpFactory'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');

    authRequestHandler = $httpBackend.when('JSONP', TARGET_URL)
      .respond(FULFILLED_DATA);

    $rootScope = $injector.get('$rootScope');
    $q = $injector.get('$q');
    TimedJsonpFactory = $injector.get('TimedJsonpFactory');
    // Override timeout time
    TimedJsonpFactory.timeoutTimeeee = 300;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('make JSON request', function () {
    $httpBackend.expectJSONP(TARGET_URL);
    TimedJsonpFactory.get(TARGET_URL);
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
      return TimedJsonpFactory.get(TARGET_URL).then(
        function (data) {
          fulfilledData = data;
          console.log('oh yues I got fulfilled');
        },
        function (reason) {
          rejectedReason = reason;
          console.log('oh noes I got rejected');
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

    describe('when timeout', function() {
      var $timeout;
      beforeEach(inject(function($injector) {
        $timeout = $injector.get('$timeout');
      }));

      beforeEach(function(done) {
        var timeAfterTimeout = TimedJsonpFactory.TIMEOUT_TIME + 100;
        callTimedJsonpFactoryGet();

        setTimeout(function() {
          $httpBackend.flush();
          done();
        }, timeAfterTimeout);

        expect(fulfilledData).toBeUndefined();
        expect(rejectedReason).toBeUndefined();
      });

      it('reject when timeout', function () {
        expect(fulfilledData).toBeUndefined();
        expect(rejectedReason).toEqual(TimedJsonpFactory.timeoutReason);
      });
    });

    describe('when delayed response before timeout', function() {
      var $timeout;
      beforeEach(inject(function($injector) {
        $timeout = $injector.get('$timeout');
      }));

      beforeEach(function(done) {
        var timeBeforeTimeout = TimedJsonpFactory.TIMEOUT_TIME - 100;
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
