'use strict';

/**
 * Test dependency server status. If the server fails to respond before timeout, display the error element
 *  when dependency is offline.
 */
angular
  .module('ifDependencyUnavailable', [])

  .controller('ifDependencyUnavailable', function ($scope, TableExtractionFactory) {
    $scope.getExample = function () {
      var url = 'offline_resource/binding_of_issac_items.html';
      TableExtractionFactory.extract(url);
    };
  })

  .directive('ifDependencyUnavailable', function ($timeout) {
    var TIMEOUT_TIME = 600;
    var DEPENDENCY_URL = 'http://www.whateverorigin.org/';
    return {
      scope: true,
      controller: 'ifDependencyUnavailable',
      compile: function (tElem) {
        var script = document.createElement('script');
        document.body.appendChild(script);

        var timer = $timeout(function() {
          tElem.removeClass('hidden');
        }, TIMEOUT_TIME);

        script.onload = function () {
          $timeout.cancel(timer);
        };

        script.src = DEPENDENCY_URL;



        script.parentNode.removeChild(script);
        script = null;
      }
    };
  });
