'use strict';

/**
 * Container for the lsTable components
 * Listen to tableExtractionFactory. When tables are ready, add lsTable components onto DOM
 */
angular
  .module('lsTableContainer', [])

  .directive('lsTableContainer', ['$compile', 'TableExtractionFactory', function ($compile, TableExtractionFactory) {
    return {
      scope: {},
      link: function (scope, element) {
        var addLiveSearchTableToDom = function (event, tableCount) {
          // Remove existing tables
          element.empty();

          for (var i = 0; i < tableCount; i++) {
            element.append( $compile('<div ls-table table-number=\"' + i + '\"></div>')(scope) );
          }
        };

        TableExtractionFactory.callHandlerWhenTableReady(addLiveSearchTableToDom);
      }
    };
  }]);
