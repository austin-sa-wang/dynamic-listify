angular
  .module('lsSearchBar', [
    'listExtractionFactory',
    'ui.bootstrap'
  ])

  .controller('lsSearchBarCtrl', function ($scope, ListExtractionFactory) {
    var ALERT_MSG = 'Try again. Extraction failed.';
    var SEVERE_ALERT_MSG = 'Try a different web page. The app is unable to retrieve source data due to cross-origin resource sharing restrictions.';

    this.srcUrl = 'http://bindingofisaacrebirth.gamepedia.com/Items';
    this.alert = {
      show: false,
      type: '',
      count: 0,
      msg: ALERT_MSG
    };
    var _alert = this.alert;

    var showAlert = function() {
      if (_alert.count == 2) {
        _alert.msg = SEVERE_ALERT_MSG;
        _alert.type = 'danger';
      }
      _alert.show = true;
      _alert.count++;
    };

    var resetAlert = function() {
      _alert.show = false;
      _alert.type = '';
      _alert.msg = ALERT_MSG;
      _alert.count = 0;
    };

    this.getTables = function () {
      ListExtractionFactory.extract(this.srcUrl)
        .success(resetAlert)
        .error(showAlert);
    };

  })

  .directive('lsSearchBar', function () {
    return {
      scope: {},
      templateUrl: 'components/search_bar/ls-search-bar.html',
      controller: 'lsSearchBarCtrl',
      controllerAs: 'ctrl'
    }
  });
