'use strict';

angular
  .module('lsSearchBar', [
    'listExtractionFactory',
    'ui.bootstrap'
  ])

  .controller('lsSearchBarCtrl', ['$scope', '$timeout', 'ListExtractionFactory', function ($scope, $timeout, ListExtractionFactory) {
    //TODO: Refactor - Extract status UI out of lsSearchBarCtrl
    var NO_TABLE_ALERT_MSG = 'No table found on target page. If there IS a table, then the table implementation is not supported. This app finds tables by the HTML <table> element.';
    var PROCESSING_MSG = 'Processing...';
    var UNRESPONSIVE_MSG = 'Target site is unresponsive. Try again or try a different site.';
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
      // url empty
      if (this.srcUrl === '') {
        _alert.error(EMPTY_URL_MSG);
        return;
      }

      /* HACK: url missing protocol
       * Potential problem: protocol could be https
       */
      var regex = /^http/;
      if ( !regex.test(this.srcUrl) ) {
        this.srcUrl = 'http://' + this.srcUrl;
      }

      _alert.warning(PROCESSING_MSG);

      ListExtractionFactory.extract(this.srcUrl)
        .success(function() {
            _alert.reset();
        })
        .error(function() {
            _alert.error(UNRESPONSIVE_MSG);
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
