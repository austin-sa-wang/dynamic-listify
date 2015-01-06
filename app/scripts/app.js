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
      data: 'HELLO'
    };
    $.get('sample.html', function (response) {
      $scope.list1.data = response;
    });
  });

