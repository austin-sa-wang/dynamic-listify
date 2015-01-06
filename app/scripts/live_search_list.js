angular
  .module('liveSearchList', [])

  .controller('liveSearchListCtrl', function() {
    this.filterExpr = '';
  })

  .directive('liveSearchList', function() {
    return {
      scope: {
        // Expect srcMarkup to be ready before being added during runtime
        srcMarkup: '='
      },
      templateUrl: 'scripts/live_search_list.html',
      controller: 'liveSearchListCtrl',
      controllerAs: 'ctrl',
      link: function (scope, element) {
        var src = document.createElement('div');
        var domList = element.children('div')[0];
        var fragList;
        var filteredFragList = document.createDocumentFragment();
        var regex;

        // PROTOTYPE
        var trueSrc = document.createElement('div');
        trueSrc.innerHTML = scope.srcMarkup.data;

        resetList();
        fragList = src.getElementsByTagName('tbody')[0].children;

        scope.$watch('ctrl.filterExpr', function () {
          updateList();
        });

        function updateList() {
          if (!src.childElementCount) {
            return;
          }
          resetList();
          filterList();
          domList.innerHTML = '';
          domList.appendChild(filteredFragList);
        }

        function resetList() {
          //src.innerHTML = scope.srcMarkup.data;
          src = trueSrc.cloneNode(true);
          fragList = src.getElementsByTagName('tbody')[0].children;
        }

        function filterList () {
          regex = new RegExp(scope.ctrl.filterExpr, 'i');
          var tmp;
          for (var i = 0; i < fragList.length; i++) {
            tmp = fragList[i];
            if (regex.exec(tmp.innerText)) {
              filteredFragList.appendChild(tmp);
            }
          }
        }
      }
    }
  })
;



