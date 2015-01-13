angular
  .module('liveSearchListContainer', [])

  .directive('liveSearchListContainer', function ($compile, ListExtractionFactory) {
    return {
      scope: {},
      link: function (scope, element) {
        var addLiveSearchListToDom = function (event, listCount) {
          element.empty();
          var newDomListMarkup, newDomList;
          for (var i = 0; i < listCount; i++) {
            newDomListMarkup = '<div live-search-list="" list-number=\"' + i + '\"></div>';
            newDomList = $compile(newDomListMarkup)(scope);
            element.append(newDomList);
          }
        };

        ListExtractionFactory.listen(addLiveSearchListToDom);
      }
    }
  });
