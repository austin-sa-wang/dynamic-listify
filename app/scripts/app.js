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
    'liveSearchList',
    'liveSearchListContainer',
    'lsSearchBar'
  ])
  .controller('MainCtrl', function() {
    this.srcUrl = 'www.google.com';
    this.getSrcMarkup = function () {
      console.log('Extract List: ' + this.srcUrl);
    };
  });


