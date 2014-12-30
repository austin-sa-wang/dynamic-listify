'use strict';

/* Directives */
angular.module('listItApp')
.directive('myCompiler', ['$compile', function ($compile) {
    return {
      link: function ( scope, element, attrs ) {
        console.log('woooohoooo' + scope.awesomeThings);
        var el = $compile( scope.itemTemplate )( scope );
        console.log(el);
        element.html("");
        element.append( el );
      }
    };
  }]);
