angular
  .module('lsSearchBar', [
    'listExtractionFactory'
  ])

  .controller('lsSearchBarCtrl', function ($scope, ListExtractionFactory) {
    this.srcUrl = 'http://bindingofisaacrebirth.gamepedia.com/Items';
    this.extractLists = function () {
      ListExtractionFactory.extract(this.srcUrl);
    };
  })

  .directive('lsSearchBar', function () {
    return {
      scope: {},
      controller: 'lsSearchBarCtrl',
      controllerAs: 'ctrl',
      templateUrl: 'scripts/ls-search-bar.html'
    }
  });
