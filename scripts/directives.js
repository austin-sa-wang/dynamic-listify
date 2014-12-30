'use strict';

/* Directives */
angular.module('listItApp')
.directive('myCompiler', ['$compile', function ($compile) {
    return {
      link: function ( scope, element, attrs ) {
        scope.$watch('markupSrc', function(newValue, oldValue) {
          setSource();
          updateList();
        });

        scope.$watch('filterRegex', function(newValue, oldValue) {
          updateList();
        });

        var root;

        function setSource () {
          var tmp = document.createDocumentFragment();
          root = document.createElement('div');
          tmp.appendChild(root);
          root.innerHTML = scope.markupSrc;
        }

        function updateList () {
          root.innerHTML = scope.markupSrc;
          var childRef = root.getElementsByTagName('tbody')[0].children;
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
