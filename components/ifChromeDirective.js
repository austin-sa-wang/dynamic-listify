'use strict';

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
