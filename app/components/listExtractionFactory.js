angular
  .module('listExtractionFactory', [])

  .factory('ListExtractionFactory', function ListExtractionFactory($http, $rootScope) {
    ListExtractionFactory.EVENT_NAME = 'lists:ready';
    ListExtractionFactory.MIN_CHILD_COUNT_TO_QUALITY = 10;

    ListExtractionFactory.lists = [];

    var pushListResource = function (tableElement) {
      ListExtractionFactory.lists.push(tableElement);
    };

    var broadcast = function (data) {
      $rootScope.$broadcast(ListExtractionFactory.EVENT_NAME, data)
    };

    var proxyUrl = function (srcUrl) {
      var proxySegment = 'http://www.corsproxy.com/';
      var srcURLSegment = srcUrl;

      // Remove http/https prefix
      if (srcUrl.search('https://') != -1) {
        srcURLSegment = srcUrl.substr(8);
      } else if (srcUrl.search('http://') != -1) {
        srcURLSegment = srcUrl.substr(7);
      }

      console.log('extract from' + proxySegment + srcURLSegment);
      return proxySegment + srcURLSegment;
    };

    // This extraction method targets table elements only
    ListExtractionFactory.extractLists = function (markup) {
      var tableCount = 0;

      var domHead = document.createElement('div');
      domHead.innerHTML = markup;
      var tableList = domHead.getElementsByTagName('table');

      // Find table with qualifying child count, remove it from dom, and push it onto lists
      var currentTable, childCount, detachedTable;
      for (var i = 0; i < tableList.length;) {
        currentTable = tableList[i];
        childCount = currentTable.getElementsByTagName('tbody')[0].children.length;
        if (childCount > ListExtractionFactory.MIN_CHILD_COUNT_TO_QUALITY) {
          detachedTable = currentTable.parentNode.removeChild(currentTable);
          pushListResource(detachedTable);

          tableCount++;
        } else {
          // Dynamic HTML node list. Avoid increment when an item is removed
          i++;
        }
      }

      console.log('extraction done with ' + tableCount + ' lists');
      broadcast(tableCount);
    };

    ListExtractionFactory.extract = function (url) {
      var promise = $http.get(proxyUrl(url)).
        success(function (response) {
          console.log('list markup extracted');
          //ListExtractionFactory.extractLists(response);
        });
      return promise;
    };

    ListExtractionFactory.separateTableIntoContainerAndContent = function (tableElement) {
      var content = tableElement.getElementsByTagName('tbody')[0];
      var detachedContent = tableElement.removeChild(content);

      return {
        container: tableElement,
        content: detachedContent
      };
    };

    ListExtractionFactory.listen = function (callback) {
      $rootScope.$on(ListExtractionFactory.EVENT_NAME, callback);
    };

    return ListExtractionFactory;
  });
