angular
  .module('liveSearchList', [
    'listFilterFactory'
  ])

  .controller('LiveSearchListCtrl', function() {
    this.filterExpr = '';
  })

  .directive('liveSearchList', ['ListFilterFactory', function(ListFilterFactory) {
    return {
      scope: {
        // Expect srcMarkup to be ready before being added during runtime
        srcMarkup: '='
      },
      templateUrl: 'scripts/live-search-list.html',
      controller: 'LiveSearchListCtrl',
      controllerAs: 'ctrl',
      link: function (scope, element) {
        var header = scope.srcMarkup.head;
        var listContent = scope.srcMarkup.data;
        var filteredList;

        var domList = element.children('div')[0];

        domList.appendChild(header);
        header.appendChild(listContent);

        scope.$watch('ctrl.filterExpr', function () {
          updateList();
        });

        function updateList() {
          console.log(scope.ctrl.filterExpr);
          filteredList = ListFilterFactory.filterList(listContent, scope.ctrl.filterExpr);
          domList.replaceChild(filteredList, domList.lastChild);
        }
      }
    }
  }])
;



