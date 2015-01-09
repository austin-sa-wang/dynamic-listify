angular
  .module('listExtractionFactory', [

  ])

  .factory('ListExtractionFactory', function ListExtractionFactory ($http, $rootScope) {
    ListExtractionFactory.EVENT_NAME = 'lists:ready';
    ListExtractionFactory.MIN_CHILD_COUNT_TO_QUALITY = 4;

    ListExtractionFactory.lists = [];

    var broadcast = function (data) {
      $rootScope.$broadcast(ListExtractionFactory.EVENT_NAME, data)
    };

    ListExtractionFactory.listen = function (callback) {
      $rootScope.$on(ListExtractionFactory.EVENT_NAME, callback);
    };

    ListExtractionFactory.extract = function (url) {
      var promise = $.get(url).
        done(function (data) {
          ListExtractionFactory.extractLists(data);
        });
      return promise;
    };

    ListExtractionFactory.extractLists = function (markup) {
      var domHead = document.createElement('div');
      domHead.innerHTML = markup;

      var tableCount = 0;

      // find table with more than
      var tableList = domHead.getElementsByTagName('table');

      var currentTable;
      var childCount;
      for (var i = 0; i < tableList.length;) {
        currentTable = tableList[i];
        childCount = currentTable.getElementsByTagName('tbody')[0].children.length;
        if (childCount >= ListExtractionFactory.MIN_CHILD_COUNT_TO_QUALITY) {
          ListExtractionFactory.pushListResource(currentTable);
          tableCount++;
        } else {
          i++;
        }
      }
      broadcast(tableCount);
      return tableCount;
    };

    ListExtractionFactory.pushListResource = function (tableElement) {
      var listHead = document.createDocumentFragment();
      var listData = document.createDocumentFragment();
      listData.appendChild(tableElement.getElementsByTagName('tbody')[0]);
      listHead.appendChild(tableElement);
      var headDataPair = {
        head: tableElement,
        data: listData.childNodes[0]
      };
      ListExtractionFactory.lists.push(headDataPair);
    };

    return ListExtractionFactory;
  });
