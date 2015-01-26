'use strict';

angular
  .module('lsTableContainer', [])

  .directive('lsTableContainer', ['$compile', 'TableExtractionFactory', function ($compile, TableExtractionFactory) {
    return {
      scope: {},
      link: function (scope, element) {
        var addLiveSearchTableToDom = function (event, tableCount) {
          element.empty();
          var newTableMarkup, newTable;
          for (var i = 0; i < tableCount; i++) {
            newTableMarkup = '<div ls-table table-number=\"' + i + '\"></div>';
            newTable = $compile(newTableMarkup)(scope);
            element.append(newTable);
          }
        };

        TableExtractionFactory.triggerWhenTableReady(addLiveSearchTableToDom);
      }
    };
  }]);
