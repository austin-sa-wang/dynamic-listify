angular.module('liveSearchListContainer', [

])
  .directive('liveSearchListContainer', function ($compile, ListExtractionFactory) {
    return {
      scope: {

      },
      link: function (scope, element) {
        var addNewLiveSearchList = function  (event, listCount) {
          for (var i = 0; i < listCount; i++) {
            var newDomListMarkup = '<div live-search-list="" list-number=\"' + i + '\"></div>';
            var newDomList = $compile(newDomListMarkup)(scope);
            element.append(newDomList);
          }
        };

        ListExtractionFactory.listen(addNewLiveSearchList);
      }
    }
  });
