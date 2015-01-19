'use strict';

angular
  .module('lsSearchBar', [
    'listExtractionFactory',
    'urlUtilFactory',
    'ui.bootstrap'
  ])

  .controller('lsSearchBarCtrl', ['$scope', '$timeout', 'ListExtractionFactory', 'UrlUtilFactory', function ($scope, $timeout, ListExtractionFactory, UrlUtilFactory) {
    //TODO: Refactor - Extract status UI out of lsSearchBarCtrl
    var NO_TABLE_ALERT_MSG = 'No table found on target page. If there IS a table, then the table implementation is not supported. This app finds tables by the HTML <table> element.';
    var PROCESSING_MSG = 'Processing...';
    var ERROR_MSG = 'Extraction failed. Try a different site.';
    var UNRESPONSIVE_MSG = 'Target site is unresponsive. Try a different site.';
    var EMPTY_URL_MSG = 'Empty URL';

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
      //TODO: Refactor - Consolidate error checking
      if (this.srcUrl === '') {
        _alert.error(EMPTY_URL_MSG);
        return;
      }
      _alert.warning(PROCESSING_MSG);
      var regex = /^http/;
      if ( !regex.test(this.srcUrl) ) {
        this.srcUrl = 'http://' + this.srcUrl;
      }

      /*
       * HACK: Compensate for the silent failure of $.getJSON in ListExtractionFactory.extract method when target URL is unavailable
       * Run in parallel with extract to save 700ms. The 700ms is the turn-around time when target url is available.
       * TODO: Better logic for testing the availability of target url
       */
      //
      UrlUtilFactory.testUrlStatus(this.srcUrl)
        .valid(function() {
          console.log('valid');
        })
        .invalid(function() {
          $timeout(function() {
            _alert.error(UNRESPONSIVE_MSG);
          });
        });

      ListExtractionFactory.extract(this.srcUrl)
        .success(function() {
          $timeout(function() {
            _alert.reset();
          });
        })
        .error(function() {
          $timeout(function() {
            _alert.error(ERROR_MSG);
          });
        });
    };

    this.getPresetSite = function(url) {
      this.srcUrl = url;
      this.getTables();
    };

  }])

  .directive('lsSearchBar', function () {
    return {
      scope: {},
      templateUrl: 'components/search_bar/ls-search-bar.html',
      controller: 'lsSearchBarCtrl',
      controllerAs: 'ctrl'
    };
  });
