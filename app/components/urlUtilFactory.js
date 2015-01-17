'use strict';

angular
  .module('urlUtilFactory', [])

  .factory('UrlUtilFactory', function UrlUtilFactory () {
    var onload = {
      callback: undefined,
      triggered: false
    };
    var onerror = {
      callback: undefined,
      triggered: false
    };

    UrlUtilFactory.testUrlStatus = function (url) {
      onload.triggered = false;
      onerror.triggered = false;

      var script = document.body.appendChild(document.createElement('script'));
      script.onload = function () {
        if (onload.callback) {
          onload.callback();
        } else {
          onload.triggered = true;
        }

      };
      script.onerror = function () {
        if (onerror.callback) {
          onerror.callback();
        } else {
          onerror.triggered = true;
        }
      };
      script.src = url;

      script.parentNode.removeChild(script);
      script = null;

      return UrlUtilFactory;
    };

    UrlUtilFactory.valid = function (callback) {
      if (onload.triggered) {
        callback();
      } else {
        onload.callback = callback;
      }
      return UrlUtilFactory;
    };

    UrlUtilFactory.invalid = function (callback) {
      if (onerror.triggered) {
        callback();
      } else {
        onerror.callback = callback;
      }
      return UrlUtilFactory;
    };

    return UrlUtilFactory;
  });
