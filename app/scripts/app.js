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
  .controller('srcMarkUpCtrl', function ($scope) {
    $scope.list1 = {
      head: 'HEAD',
      data: 'DATA'
    };

    $.get('sample.html', function (response) {
      var trueSrc = document.createElement('div');
      trueSrc.innerHTML = response;
      var listHead = document.createDocumentFragment();
      var listData = document.createDocumentFragment();
      listData.appendChild(trueSrc.getElementsByTagName('tbody')[0]);
      listHead.appendChild(trueSrc.children[0]);
      $scope.list1.head = listHead.childNodes[0];
      $scope.list1.data = listData.childNodes[0];
    });
  });


