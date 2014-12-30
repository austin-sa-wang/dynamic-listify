'use strict';

/* Directives */
angular.module('listItApp')
.directive('myCompiler', ['$compile', function ($compile) {
    return {
      link: function ( scope, element, attrs ) {
        console.log(scope);
        console.log('woooohoooo' + scope.awesomeThings);

        scope.$watch('itemTemplate', function(newValue, oldValue) {
          console.log('$watch triggered. Value changed from ' + oldValue + ' to ' + newValue);
          updateList(newValue);
        });

        function updateList (template) {
          var el = $compile( template )( scope );
          console.log(el);
          element.html("");
          element.append( el );
        }
      }
    };
  }]);
