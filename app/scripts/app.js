'use strict';

/**
 * @ngdoc overview
 * @name LiveSearchApp
 * @description
 * # LiveSearchApp
 *
 * Main module of the application.
 */
angular
  .module('LiveSearchApp', [
    'LiveSearchCore',
    'liveSearchList'
  ])
  .controller('srcMarkUpCtrl', function ($scope, listFilterFactory) {
    $scope.list1 = {
      head: 'HEAD',
      data: 'HELLO'
    };

    $.get('sample.html', function (response) {
      var trueSrc = document.createElement('div');
      trueSrc.innerHTML = response;
      var listHead = document.createDocumentFragment();
      var listData = document.createDocumentFragment();
      listData.appendChild(trueSrc.getElementsByTagName('tbody')[0]);
      listHead.appendChild(trueSrc.children[0]);
      $scope.list1.head = listHead.childNodes[0];
      $scope.list1.listContent = listData.childNodes[0];
      $scope.list1.data = response;
      console.log($scope.list1.head);
      console.log($scope.list1.data);
      listFilterFactory.filterList($scope.list1.listContent, 'a');
    });
  })
  .factory('listFilterFactory', function listFilterFactory () {
    listFilterFactory.filterList = function (_list, filterExpr) {
      var list = _list.cloneNode(true);
      var listChildren = list.children;
      var regex = new RegExp(filterExpr, 'i');
      var currentNode;

      for (var i = 0; i < listChildren.length; ) {
        currentNode = listChildren[i];
        if (!regex.exec(currentNode.innerText)) {
          list.removeChild(currentNode);
          i++;
        }
      }

      return list;
    }
    return listFilterFactory;
  });


