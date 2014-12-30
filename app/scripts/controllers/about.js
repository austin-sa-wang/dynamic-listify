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

    $scope.srcURL = 'bindingofisaacrebirth.gamepedia.com/Items';

    $scope.filterRegex = '';

    $scope.proceed = function () {
      var corsProxySegment = 'http://www.corsproxy.com/';
      var urlField = $scope.srcURL;
      var urlFieldSegment = urlField.replace('http://', '');

      var url = corsProxySegment + urlFieldSegment;
      url = '/sample.html';
      $.get(url, function(response) {
        $scope.markupSrc = response;
        $scope.$digest();
      });
    }
  });
