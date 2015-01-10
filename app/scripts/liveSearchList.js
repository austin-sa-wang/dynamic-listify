angular
  .module('liveSearchList', [
  ])

  .controller('LiveSearchListCtrl', function() {
    this.filterExpr = '';
  })

  .directive('liveSearchList', function(ListExtractionFactory) {
    return {
      scope: {
        // Expect srcMarkup to be ready before being added during runtime
        listNumber: '@'
      },
      templateUrl: 'scripts/live-search-list.html',
      controller: 'LiveSearchListCtrl',
      controllerAs: 'ctrl',
      link: function (scope, element) {
        var domList = element.children('div')[0];
        var list = ListExtractionFactory.lists[scope.listNumber];
        var separatedList = ListExtractionFactory.separateTableIntoContainerAndContent(list);
        var header = separatedList.container;
        var listContent = separatedList.content;
        console.log('start append list container');
        domList.appendChild(header);
        console.log('end append list container');
        console.log('start append list content');
        header.appendChild(listContent);
        console.log('end append list content');

        scope.$watch('ctrl.filterExpr', function () {
          updateListWithHTMLDisplay();
        });

        function updateListWithHTMLDisplay () {
          var regex = new RegExp(scope.ctrl.filterExpr, 'i');

          var listChildren = listContent.children;
          var currentNode;

          // Remove filtered nodes
          for (var i = 0; i < listChildren.length; i++) {
            currentNode = listChildren[i];
            if (!regex.exec(currentNode.innerText)) {
              currentNode.style.display = 'none';
            } else {
              currentNode.style.display = '';
            }
          }
        }

      }
    }
  });
