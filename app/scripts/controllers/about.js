'use strict';

/**
 * @ngdoc function
 * @name listItApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the listItApp
 */
angular.module('listItApp')
  .controller('AboutCtrl', function ($scope, $compile) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.newToDo = '';

    $scope.addItem = function () {
      $scope.awesomeThings.push($scope.newTodo);
    }

    $scope.itemTemplate = '<div ng-repeat="item in awesomeThings">{{item}}</div>';
  });
