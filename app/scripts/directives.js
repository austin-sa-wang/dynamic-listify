'use strict';

/* Directives */
angular.module('listItApp')
.directive('myCompiler', ['$compile', function ($compile) {
    return {
      link: function ( scope, element, attrs ) {
        scope.$watch('awesomeThings', function(newValue, oldValue) {
          updateList();
        });

        scope.$watch('filterRegex', function(newValue, oldValue) {
          updateList();
        });

        function updateList () {
          var root = document.createDocumentFragment();
          var container = document.createElement('div');
          root.appendChild(container);
          container.innerHTML = scope.markupSrc;

          var childRef = container.getElementsByTagName('tbody')[0].children;
          var filteredRoot = document.createDocumentFragment();
          var regex = new RegExp(scope.filterRegex, 'i');
          var tmp;
          for (var i = 0; i < childRef.length; i++) {
            tmp = childRef[i];
            if (regex.exec(tmp.innerText)) {
              filteredRoot.appendChild(tmp);
            }
          }

          element.html('');
          element.append(filteredRoot);
        }
      }
    };
  }]);
