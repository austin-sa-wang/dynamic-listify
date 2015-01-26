'use strict';

angular
  .module('tableExtractionFactory', [])

  .factory('TableExtractionFactory', ['$http', '$rootScope', function TableExtractionFactory($http, $rootScope) {
    TableExtractionFactory.TABLE_READY_EVENT = 'table:ready';
    TableExtractionFactory.HTTP_REQUEST_TIMEOUT = 2000;
    TableExtractionFactory.MIN_TABLE_ROW_COUNT_TO_QUALITY = 10;

    TableExtractionFactory.tables = [];

    var corsUrl = function (url) {
      return 'http://whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=JSON_CALLBACK';
    };

    var pushTable = function (tableElement) {
      TableExtractionFactory.tables.push(tableElement);
    };

    /**
     *
     * @param data
     */
    TableExtractionFactory.broadcastTableReady = function (data) {
      $rootScope.$broadcast(TableExtractionFactory.TABLE_READY_EVENT, data);
    };

    TableExtractionFactory.triggerWhenTableReady = function (callback) {
      $rootScope.$on(TableExtractionFactory.TABLE_READY_EVENT, callback);
    };

    TableExtractionFactory.fixRelativeLinks = function (url, markup) {
      var link = document.createElement('a');
      link.href = url;
      var hostname = link.hostname;

      var httpPrefix = '';
      if (url.search('https://') !== -1) {
        httpPrefix = 'https://';
      } else if (url.search('http://') !== -1) {
        httpPrefix = 'http://';
      }

      var aRegex = /href="\//g;
      var a = 'href=\"' + httpPrefix + hostname + '/';
      var imgRegex = /src="\//g;
      var img = 'src=\"' + httpPrefix + hostname + '/';
      var newMarkup = markup.replace(aRegex, a);
      newMarkup = newMarkup.replace(imgRegex, img);

      return newMarkup;
    };

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
          pushTable(detachedTable);
          tableCount++;
        } else {
          // Dynamic HTML node list. Avoid increment when an item is removed
          i++;
        }
      }

      return tableCount;
    };

    TableExtractionFactory.extract = function (url) {
      var promise = $http.jsonp(corsUrl(url), {timeout: TableExtractionFactory.HTTP_REQUEST_TIMEOUT})
        .success(function (data) {
          var markup = TableExtractionFactory.fixRelativeLinks(url, data.contents);
          var tableCount = TableExtractionFactory.getTables(markup);
          TableExtractionFactory.broadcastTableReady(tableCount);
        });
      return promise;
    };

    TableExtractionFactory.breakNodeGroupIntoChunks = function (container, chunkSize) {
      var children = container.children;
      var chunkList = [];
      var currentSplit, count;
      while(children.length > 0) {
        currentSplit = document.createDocumentFragment();

        if (children.length > chunkSize) {
          count = chunkSize;
        } else {
          count = children.length;
        }

        while (count > 0) {
          currentSplit.appendChild(children[0]);
          count--;
        }

        chunkList.push(currentSplit);
      }
      return chunkList;
    };

    return TableExtractionFactory;
  }]);
