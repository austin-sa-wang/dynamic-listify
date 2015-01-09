angular
  .module('lsSearchBar', [
    'listExtractionFactory'
  ])

  .controller('lsSearchBarCtrl', function ($scope, ListExtractionFactory) {
    this.srcUrl = '';
    this.extractLists = function () {
      ListExtractionFactory.listen( function (event, data) {
        console.log(data);
      });
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
