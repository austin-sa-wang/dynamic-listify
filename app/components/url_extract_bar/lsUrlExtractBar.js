'use strict';

angular
  .module('lsUrlExtractBar', [
    'listExtractionFactory',
    'ui.bootstrap'
  ])

  .controller('lsUrlExtractBarCtrl', ['$scope', '$timeout', 'ListExtractionFactory', function ($scope, $timeout, ListExtractionFactory) {
    var ALERT_MSG = {
      PROCESSING: 'Processing...',
      NO_TABLE: 'No table found on target page. If there IS a table, then the table implementation is not supported. This app finds tables by the HTML <table> element.',
      UNRESPONSIVE: 'Target site is unresponsive. Try a different site.',
      FAST_FAIL: 'There\'s a slight hiccup with the request. It should work within 3 tries. (The issue is being resolved)',
      NOT_HTTP: 'Invalid URL. Note: The url should be preceded with http(s)://'
    };

    this.alert = {
      show: false,
      type: '',
      msg: '',

      hide: function () {
        this.show = false;
      },

      showWarning: function (msg) {
        this.show = true;
        this.type = '';
        this.msg = msg;
      },

      showError: function (msg) {
        this.show = true;
        this.type = 'danger';
        this.msg = msg;
      }
    };
    var _alert = this.alert;

    this.targetUrl = '';

    // Listen to extraction completion broadcast
    ListExtractionFactory.triggerWhenListReady(function (event, tableCount) {
      if (tableCount === 0) {
        $timeout(function() {
          _alert.showWarning(ALERT_MSG.NO_TABLE);
        });
      }
    });

    this.getTables = function () {
      // Check url validity. Only http(s) protocol is allowed
      var regex = /^https?:\/\/.+/;
      if ( !regex.test(this.targetUrl) ) {
        _alert.showError(ALERT_MSG.NOT_HTTP);
        return;
      }

      /* Hack: get around intermittent failure when the http request fails immediately (possibly caused by whatever origin)
       * (cannot differentiate between this and timeout because both callback arguments are empty)
       * Cancel the timer in the extract error callback. If too soon, throw retry message.
       */
      var timer = $timeout(function(){}, 1000);

      _alert.showWarning(ALERT_MSG.PROCESSING);
      ListExtractionFactory.extract(this.targetUrl)
        .success(function() {
            _alert.hide();
        })
        .error(function() {
          // HACK: Part of the Hack described above
          if ($timeout.cancel(timer)) {
            _alert.showError(ALERT_MSG.FAST_FAIL);
          } else {
            _alert.showError(ALERT_MSG.UNRESPONSIVE);
          }
        });
    };

    this.getPresetSite = function(url) {
      this.targetUrl = url;
      this.getTables();
    };

  }])

  .directive('lsUrlExtractBar', function () {
    return {
      scope: {},
      templateUrl: 'components/url_extract_bar/ls-url-extract-bar.html',
      controller: 'lsUrlExtractBarCtrl',
      controllerAs: 'ctrl'
    };
  });
