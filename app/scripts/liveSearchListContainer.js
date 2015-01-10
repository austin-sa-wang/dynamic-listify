angular.module('liveSearchListContainer', [

])

  .controller('LiveSearchListContainerCtrl', function($scope, ListExtractionFactory) {

  })

  .directive('liveSearchListContainer', function ($compile, ListExtractionFactory) {
    return {
      scope: {

      },
      controller: 'LiveSearchListContainerCtrl',
      controllerAs: 'ctrl',
      link: function (scope, element) {
        ListExtractionFactory.listen(addNewLiveSearchList);

        function addNewLiveSearchList (event, listCount) {
          for (var i = 0; i < listCount; i++) {
            var newDomListMarkup = '<div live-search-list="" list-number=\"' + i + '\"></div>';
            var newDomList = $compile(newDomListMarkup)(scope);
            element.append(newDomList);
          }
        }
      }
    }
  });
