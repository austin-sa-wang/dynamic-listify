'use strict';

angular
  .module('lsUrlExtractBar', [
    'listExtractionFactory',
    'ui.bootstrap'
  ])

  .controller('lsUrlExtractBarCtrl', ['$scope', '$timeout', 'ListExtractionFactory', function ($scope, $timeout, ListExtractionFactory) {
    //TODO: Refactor - Extract status UI out of lsUrlExtractBarCtrl
    var NO_TABLE_ALERT_MSG = 'No table found on target page. If there IS a table, then the table implementation is not supported. This app finds tables by the HTML <table> element.';
    var PROCESSING_MSG = 'Processing...';
    var UNRESPONSIVE_MSG = 'Target site is unresponsive. Try a different site.';
    var FAST_FAIL_MSG = 'There\'s a slight hiccup with the request. It should work within 3 tries. (The issue is being resolved)';
    var NOT_HTTP_MSG = 'Invalid URL. Note: The url should be preceded with http(s)://';

    this.srcUrl = '';
    this.alert = {
      show: false,
      type: '',
      msg: '',

      reset: function () {
        this.show = false;
      },

      warning: function (msg) {
        this.show = true;
        this.type = '';
        this.msg = msg;
      },

      error: function (msg) {
        this.show = true;
        this.type = 'danger';
        this.msg = msg;
      }
    };

    var _alert = this.alert;

    ListExtractionFactory.listen(function (event, data) {
      if (data === 0) {
        $timeout(function() {
          _alert.warning(NO_TABLE_ALERT_MSG);
        });
      }
    });

    this.getTables = function () {
      // Check url validity. Only http(s) protocol is allowed
      var regex = /^https?:\/\/.+/;
      if ( !regex.test(this.srcUrl) ) {
        _alert.error(NOT_HTTP_MSG);
        return;
      }

      /* Hack: get around intermittent failure when the http request fails immediately (possibly caused by whatever origin)
       * (cannot differentiate between this and timeout because both callback arguments are empty)
       * Cancel the timer in the extract error callback. If too soon, throw retry message.
       */
      var timer = $timeout(function(){}, 1000);

      _alert.warning(PROCESSING_MSG);
      ListExtractionFactory.extract(this.srcUrl)
        .success(function() {
            _alert.reset();
        })
        .error(function() {
          // HACK: Part of the Hack described above
          if ($timeout.cancel(timer)) {
            _alert.error(FAST_FAIL_MSG);
          } else {
            _alert.error(UNRESPONSIVE_MSG);
          }
        });
    };

    this.getPresetSite = function(url) {
      this.srcUrl = url;
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
