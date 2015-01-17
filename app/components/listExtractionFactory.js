'use strict';

angular
  .module('listExtractionFactory', [])

  .factory('ListExtractionFactory', ['$http', '$rootScope', function ListExtractionFactory($http, $rootScope) {
    ListExtractionFactory.EVENT_NAME = 'lists:ready';
    ListExtractionFactory.MIN_CHILD_COUNT_TO_QUALITY = 10;

    ListExtractionFactory.lists = [];

    var pushListResource = function (tableElement) {
      ListExtractionFactory.lists.push(tableElement);
    };

    var proxyUrl = function (srcUrl) {
      var proxySegment = 'http://www.corsproxy.com/';
      var srcURLSegment = srcUrl;

      // Remove http/https prefix
      if (srcUrl.search('https://') !== -1) {
        srcURLSegment = srcUrl.substr(8);
      } else if (srcUrl.search('http://') !== -1) {
        srcURLSegment = srcUrl.substr(7);
      }

      console.log('extract from' + proxySegment + srcURLSegment);
      return proxySegment + srcURLSegment;
    };

    ListExtractionFactory.broadcast = function (data) {
      $rootScope.$broadcast(ListExtractionFactory.EVENT_NAME, data);
    };

    ListExtractionFactory.listen = function (callback) {
      $rootScope.$on(ListExtractionFactory.EVENT_NAME, callback);
    };

    ListExtractionFactory.fixRelativeLinks = function (url, markup) {
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

    ListExtractionFactory.getTables = function (markup) {
      var tableCount = 0;

      var domHead = document.createElement('div');
      domHead.innerHTML = markup;
      var tableList = domHead.getElementsByTagName('table');

      ListExtractionFactory.lists = [];

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

      console.log('Found ' + tableCount + ' tables');
      return tableCount;
    };

    ListExtractionFactory.extractWhateverorigin = function (url) {
      var promise = $.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?')
        .done(function (response) {
          var markup = ListExtractionFactory.fixRelativeLinks(url, response.contents);
          var tableCount = ListExtractionFactory.getTables(markup);
          ListExtractionFactory.broadcast(tableCount);
        });
      return promise;
    };

    ListExtractionFactory.extract = function (url) {
      var promise = $http.get(proxyUrl(url)).
        success(function (response) {
          var markup = ListExtractionFactory.fixRelativeLinks(url, response);
          var tableCount = ListExtractionFactory.getTables(markup);
          ListExtractionFactory.broadcast(tableCount);
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

    return ListExtractionFactory;
  }]);
