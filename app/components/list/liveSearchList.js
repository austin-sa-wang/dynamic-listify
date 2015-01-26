'use strict';
/*global $:false */

/**
 * liveSearchList component is consisted of the following elements:
 *   - table
 *   - table search bar
 *   - table hide & show toggle
 *
 */
angular
  .module('liveSearchList', [])

  .controller('LiveSearchListCtrl', function () {
    this.filterExpr = '';

    // hide & show toggle view model
    this.tableToggle = {
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

  .directive('liveSearchList', ['ListExtractionFactory', '$interval', function (ListExtractionFactory, $interval) {
    return {
      scope: {
        // Expect srcMarkup to be ready before being added during runtime
        listNumber: '@'
      },
      templateUrl: 'components/list/live-search-list.html',
      controller: 'LiveSearchListCtrl',
      controllerAs: 'ctrl',
      link: function (scope, element) {

        /**
         * Push table onto DOM. Push table data in chunks to reduce UI freeze (primarily Chrome) caused by heavy DOM redraw.
         * This function replaces the <tbody> node
         * @param table Table element to be pushed onto DOM
         */
        var pushTableOntoDom = function (table) {
          var CHUNK_SIZE = 32;
          var DOM_PUSH_INTERVAL = 150;

          var listContent = table.getElementsByTagName('tbody')[0];

          // Detach data from table. Push data onto DOM in chunks later
          table.removeChild(listContent);

          // Create empty tbody to host table data
          var domTbodyNode = document.createElement('tbody');
          table.appendChild(domTbodyNode);

          element.children('div')[0].appendChild(table);

          // Array chunking
          var chunkList = ListExtractionFactory.breakNodeGroupIntoChunks(listContent, CHUNK_SIZE);

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
         * @param element Target element containing the data to be filtered
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

        var table = ListExtractionFactory.lists[scope.listNumber];

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
