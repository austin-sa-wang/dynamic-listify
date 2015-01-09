angular
  .module('liveSearchList', [
  ])

  .controller('LiveSearchListCtrl', function() {
    this.filterExpr = '';
  })

  .directive('liveSearchList', function() {
    return {
      scope: {
        // Expect srcMarkup to be ready before being added during runtime
        srcMarkup: '='
      },
      templateUrl: 'scripts/live-search-list.html',
      controller: 'LiveSearchListCtrl',
      controllerAs: 'ctrl',
      link: function (scope, element) {
        var domList = element.children('div')[0];
        var header = scope.srcMarkup.head;
        var listContent = scope.srcMarkup.data;

        domList.appendChild(header);
        header.appendChild(listContent);

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
  })
;



