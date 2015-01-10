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
        domList.appendChild(header);
        header.appendChild(listContent);

        scope.$watch('ctrl.filterExpr', function () {
          updateListWithHTMLDisplay(listContent);
        });

        /**
         * Run callback with the element removed from the DOM (and thus being
         * out-of-the-flow).  Upon returning, the element will be inserted at its
         * original position even if callback rises an exception.
         * @source https://developers.google.com/speed/articles/javascript-dom
         *
         * @param {!Element} element The element to be temporarily removed.
         * @param {function(): T} callback The function to call.
         * @return {T} Value returned by the callback function.
         * @template T
         */
        function updateDomWithElementRemoved(element, callback) {
          var parentNode = element.parentNode;
          var nextSibling = element.nextSibling;
          parentNode.removeChild(element);
          try {
            var retval = callback();
          }
          finally {
            parentNode.insertBefore(element, nextSibling);
          }
          return retval;
        }

        function updateListWithHTMLDisplay(element) {
          updateDomWithElementRemoved(element, function() {
            var regex = new RegExp(scope.ctrl.filterExpr, 'i');
            var listChildren = element.children;
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
          });
        }
      }
    }
  });
