'use strict';

/**
 * Test dependency server status.
 * Display error when dependency is offline.
 */
angular
  .module('dependencyUnavailable', [])

  .directive('dependencyUnavailable', function () {
    var DEPENDENCY_URL = 'http://www.whateverorigin.org/';
    return {
      compile: function (tElem) {
        var script = document.body.appendChild(document.createElement('script'));
        script.onerror = function () {
          tElem.removeClass('hidden');
        };
        script.src = DEPENDENCY_URL;

        script.parentNode.removeChild(script);
        script = null;
      }
    };
  });
