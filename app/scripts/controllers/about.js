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

    $scope.markupSrc;

    $scope.newToDo = '';

    $scope.addItem = function () {
      $scope.awesomeThings.push($scope.newTodo);
    };

    $scope.extra = '';
    $scope.changeTemplate = function () {
      $scope.extra = $scope.extra + "<p>allo' </p>";
    };

    $scope.srcURL = 'bindingofisaacrebirth.gamepedia.com/Items';

    $scope.filterRegex = 'speed';

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
      $scope.markupSrc = source;
      console.log("Done fetching" + $scope.itemTemplate);
      var list = source.split('\n');
      $scope.awesomeThings = list;
      console.log(list.length);
      $scope.$digest();
    }
  });
