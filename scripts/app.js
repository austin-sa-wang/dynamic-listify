'use strict';

/**
 * @ngdoc overview
 * @name listItApp
 * @description
 * # listItApp
 *
 * Main module of the application.
 */
angular
  .module('listItApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

angular.element(document).ready(function() {
  angular.bootstrap(document, ['listItApp']);
});
