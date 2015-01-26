'use strict';
/*global $:false */

/**
 * lsTable component implements of the following:
 *   - table
 *   - table search bar
 *   - table hide & show toggle
 *
 * Table data location is passed-in by the table-number attribute of the directive markup, provided by lsTableContainer
 */
angular
  .module('lsTable', [])

  .controller('lsTableCtrl', function () {
    this.filterExpr = '';

    // hide & show toggle view model
    this.tableDisplayToggle = {
      isTableHidden: false,
      buttonText: 'Hide',

      toggle: function () {
        if (this.isTableHidden) {
          this.isTableHidden = false;
          this.buttonText = 'Hide';
        } else {
          this.isTableHidden = true;
          this.buttonText = 'Show';
        }
      }
    };

  })

  .directive('lsTable', ['TableExtractionFactory', '$interval', 'TableUtilityFactory', function (TableExtractionFactory, $interval, TableUtilityFactory) {
    return {
      scope: {
        // Expect srcMarkup to be ready before being added during runtime
        tableNumber: '@'
      },
      templateUrl: 'components/lsTable/ls-table.html',
      controller: 'lsTableCtrl',
      controllerAs: 'ctrl',
      link: function (scope, element) {

        /**
         * Push table onto DOM. Push table data in chunks to reduce UI freeze (primarily Chrome) caused by heavy DOM redraw.
         * This function replaces the <tbody> node
         * @param {!Element} table Table element to be pushed onto DOM
         */
        var pushTableOntoDom = function (table) {
          var CHUNK_SIZE = 32;
          var DOM_PUSH_INTERVAL = 150;

          var tableBody = table.getElementsByTagName('tbody')[0];

          // Detach body from table. Push data onto DOM in chunks later
          table.removeChild(tableBody);

          // Create empty tbody to host table data
          var domTbodyNode = document.createElement('tbody');
          table.appendChild(domTbodyNode);

          element.children('div')[0].appendChild(table);

          // Array chunking
          var chunkList = TableUtilityFactory.breakNodeGroupIntoChunks(tableBody, CHUNK_SIZE);

          $interval(function(){
            domTbodyNode.appendChild(chunkList.shift());
          }, DOM_PUSH_INTERVAL, chunkList.length);
        };

        /**
         * Run callback with the element removed from the DOM (and thus being
         * out-of-the-flow).  Upon returning, the element will be inserted at its
         * original position even if callback rises an exception.
         * @source https://developers.google.com/speed/articles/javascript-dom
         *
         * @param {!Element} element The element to be temporarily removed.
         * @param {function(): T} callback The function to call.
         * @return {T} Value returned by the callback function.
         * @template T
         */
        var updateDomWithElementRemoved = function (element, callback) {
          var parentNode = element.parentNode;
          var nextSibling = element.nextSibling;
          parentNode.removeChild(element);
          var retval;
          try {
            retval = callback();
          }
          finally {
            parentNode.insertBefore(element, nextSibling);
          }
          return retval;
        };

        /**
         * Update table with filter. Filter by testing the text content of each node. Update css style accordingly.
         * @param {!Element} element Target element containing the data to be filtered
         * @param {String} filterExpr Filter expression to be tested against
         */
        var updateTableWithFilter = function (element, filterExpr) {
          updateDomWithElementRemoved(element, function () {
            var regex = new RegExp(filterExpr, 'i');
            var dataNodes = element.children;
            var currentNode;

            for (var i = 0; i < dataNodes.length; i++) {
              currentNode = $(dataNodes[i]);
              if (!regex.test(currentNode.text())) {
                currentNode.css('display', 'none');
              } else {
                currentNode.css('display', '');
              }
            }
          });
        };

        var table = TableExtractionFactory.tables[scope.tableNumber];

        // Table pre-process: Add Bootstrap table style
        table.classList.add('table');
        table.classList.add('table-condensed');

        // Table pre-process: Move misplaced <th> in <tbody> to <thead>
        var firstRow = table.getElementsByTagName('tbody')[0].children[0];
        if (firstRow.children[0].tagName === 'TH') {
          var thead = table.appendChild(document.createElement('thead'));
          thead.appendChild(firstRow);
        }

        pushTableOntoDom(table);

        // Get reference to the new tbody node, as the original one is replaced in pushTableOntoDom function call
        var tableBody = table.getElementsByTagName('tbody')[0];
        scope.$watch('ctrl.filterExpr', function () {
          updateTableWithFilter(tableBody, scope.ctrl.filterExpr);
        });
      }
    };
  }]);
