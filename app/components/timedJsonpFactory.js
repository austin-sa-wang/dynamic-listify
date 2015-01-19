'use strict';

angular
  .module('timedJsonpFactory', [])

  .factory('TimedJsonpFactory', ['$http', '$q', function TimedJsonpFactory($http, $q) {
    TimedJsonpFactory.timeoutReason = 'error:timeout';
    TimedJsonpFactory.TIMEOUT_TIME = 1000;

    TimedJsonpFactory.get = function (url) {
      var q = $q(function(resolve, reject) {
        var timeoutID = setTimeout(
          function () {
            reject(TimedJsonpFactory.timeoutReason);
        }, TimedJsonpFactory.TIMEOUT_TIME);

        $http.jsonp(url)
          .success(function (data) {
            resolve(data);
            window.clearTimeout(timeoutID);
          })
          .error(function (reason) {
            reject(reason);
            window.clearTimeout(timeoutID);
          });
      });

      return q;
    };

    return TimedJsonpFactory;
  }]);
