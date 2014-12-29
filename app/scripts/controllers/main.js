'use strict';

/**
 * @ngdoc function
 * @name listItApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the listItApp
 */
angular.module('listItApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
