'use strict';

/**
 * Show notification when browser is Chrome
 */
angular
  .module('ifChrome', [])

  .directive('ifChrome', function () {
    return {
      compile: function (tElem) {
        var isChrome = /chrome/i.test(navigator.userAgent);
        if (isChrome) {
          tElem.removeClass('hidden');
        }
      }
    };
  });
