'use strict';

angular
  .module('dependencyUnavailable', [])

  .directive('dependencyUnavailable', function () {
    var DEPENDENCY_URL = 'http://www.whateverorigin.org/';
    return {
      compile: function (tElem) {
        console.log('dependencyUnavailable');
        var script = document.body.appendChild(document.createElement('script'));
        script.onerror = function () {
          console.log('unavailable');
          tElem.removeClass('hidden');
        };
        script.src = DEPENDENCY_URL;

        script.parentNode.removeChild(script);
        script = null;
      }
    };
  });