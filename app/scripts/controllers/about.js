'use strict';

/**
 * @ngdoc function
 * @name listItApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the listItApp
 */
angular.module('listItApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.myHTML =
      'I am an <code>HTML</code>string with ' +
      '<a href="#">links!</a> and other <em>stuff</em>';
  });
