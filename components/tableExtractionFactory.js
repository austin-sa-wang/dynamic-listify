'use strict';

/**
 * Implements table extraction logic
 * When extraction is done, pushes the tables onto a list and broadcast a ready event.
 */
angular
  .module('tableExtractionFactory', ['tableUtilityFactory'])

  .factory('TableExtractionFactory', ['$http', '$rootScope', 'TableUtilityFactory', function TableExtractionFactory($http, $rootScope, TableUtilityFactory) {
    TableExtractionFactory.TABLE_READY_EVENT = 'table:ready';
    TableExtractionFactory.HTTP_REQUEST_TIMEOUT = 2000;
    TableExtractionFactory.MIN_TABLE_ROW_COUNT_TO_QUALITY = 10;

    var isCorsDependencyOnline = true;

    /**
     * Array for lsTable component to access the extracted table markup
     * @type {Array}
     */
    TableExtractionFactory.tables = [];

    /**
     * Prepare the url for Whatever Origin JSONP request to overcome CORS restriction
     * @param {string} url Target url
     * @returns {string} JSONP request url
     */
    var getCorsUrl = function (url) {
      return 'http://whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=JSON_CALLBACK';
    };

    TableExtractionFactory.broadcastTableReady = function (tableCount) {
      $rootScope.$broadcast(TableExtractionFactory.TABLE_READY_EVENT, tableCount);
    };

    TableExtractionFactory.callHandlerWhenTableReady = function (callback) {
      $rootScope.$on(TableExtractionFactory.TABLE_READY_EVENT, callback);
    };

    /**
     * Locate tables in markup. Use HTMLElement to do this. (Alternative: parse the markup manually)
     * Push table HTMLElement tree onto list of tables. Return the number of tables found.
     * @param {String} markup
     * @returns {number} tableCount Number of tables found
     */
    TableExtractionFactory.getTables = function (markup) {
      var tableCount = 0;

      var domHead = document.createElement('div');
      domHead.innerHTML = markup;
      var tableList = domHead.getElementsByTagName('table');

      TableExtractionFactory.tables = [];

      // Find table with qualifying child count, remove it from dom, and push it onto tables
      var currentTable, childCount, detachedTable;
      for (var i = 0; i < tableList.length;) {
        currentTable = tableList[i];
        childCount = currentTable.getElementsByTagName('tbody')[0].children.length;
        if (childCount > TableExtractionFactory.MIN_TABLE_ROW_COUNT_TO_QUALITY) {
          detachedTable = currentTable.parentNode.removeChild(currentTable);
          TableExtractionFactory.tables.push(detachedTable);
          tableCount++;
        } else {
          // Dynamic HTML node list. Avoid increment when an item is removed
          i++;
        }
      }
      return tableCount;
    };

    /**
     * Extract tables from the url
     * @param {String} url Target url
     * @returns {Promise} promise Promise to the http request
     */
    TableExtractionFactory.extract = function (url) {
      var promise = $http.jsonp(getCorsUrl(url), {timeout: TableExtractionFactory.HTTP_REQUEST_TIMEOUT})
        .success(function (data) {
          var markup = TableUtilityFactory.fixRelativeLinks(url, data.contents);
          var tableCount = TableExtractionFactory.getTables(markup);
          TableExtractionFactory.broadcastTableReady(tableCount);
        });
      return promise;
    };

    /**
     * Extract tables from the url without cors bypass
     * Mainly for offline demo
     * @param {String} url Target url
     */
    TableExtractionFactory.extractWithoutCorsBypass = function (url) {
      console.log('get' + url);
      $http.get(url)
        .success(function (data) {
          var markup = TableUtilityFactory.fixRelativeLinks(url, data.contents);
          var tableCount = TableExtractionFactory.getTables(markup);
          TableExtractionFactory.broadcastTableReady(tableCount);
        });
    };

    return TableExtractionFactory;
  }]);
