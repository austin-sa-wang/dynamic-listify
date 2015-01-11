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
      templateUrl: 'components/search_bar/ls-search-bar.html',
      controller: 'lsSearchBarCtrl',
      controllerAs: 'ctrl'
    }
  });
