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

    $scope.newToDo = '';

    $scope.addItem = function () {
      $scope.awesomeThings.push($scope.newTodo);
    };

    $scope.extra = '';
    $scope.changeTemplate = function () {
      $scope.extra = $scope.extra + "<p>allo' </p>";
    };

    $scope.srcURL = 'bindingofisaacrebirth.gamepedia.com/Items';

    $scope.itemTemplate = 'unintialized';

    $scope.proceed = function () {
      var corsProxySegment = 'http://www.corsproxy.com/';
      var urlField = $scope.srcURL;
      var urlFieldSegment = urlField.replace('http://', '');

      var url = corsProxySegment + urlFieldSegment;
      url = '/sample.html';
      console.log(url);
      $.get(url, function(response) {
        composeNewPage(response);
      });
    }

    function composeNewPage (source) {
      console.log("Done fetching" + $scope.itemTemplate);
      console.log(source.length);
      var list = source.split('\n');
      $scope.awesomeThings = list;
      console.log(list.length);
      $scope.itemTemplate ='<div ng-repeat="item in awesomeThings">{{item}}</div>' ;
      $scope.$digest();
    }
  });
