'use strict';
/*global $:false */

angular
  .module('LiveSearchCore', [
    'ngAnimate', 'ngResource'
  ])
  .controller('MainCtrl', function ($scope) {
    $scope.srcURL = '';
    $scope.srcMarkup = '';
    $scope.filterRegex = '';

    $scope.getSrcMarkup = function () {
      $.get(proxyUrl($scope.srcURL), function (response) {
        $scope.srcMarkup = response;
        $scope.$digest();
      });
    };

    function proxyUrl(srcUrl) {
      var proxySegment = 'http://www.corsproxy.com/';
      var srcURLSegment = srcUrl.replace('http://', '');
      //return 'sample.html';
      return proxySegment + srcURLSegment;
    }
  })
  .directive('myCompiler', function () {
    return {
      link: function (scope, element) {
        scope.$watch('srcMarkup', function () {
          setMarkup();
          updateList();
        });

        scope.$watch('filterRegex', function () {
          updateList();
        });

        var root = document.createElement('div');
        document.createDocumentFragment().appendChild(root);

        function setMarkup() {
          root.innerHTML = scope.srcMarkup;
        }

        function updateList() {
          if (!root.childElementCount) {
            return;
          }
          setMarkup();
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
  });
