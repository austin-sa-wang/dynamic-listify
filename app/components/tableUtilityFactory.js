'use strict';

angular.module('tableUtilityFactory', [])

  .factory('TableUtilityFactory', function TableUtilityFactory () {

    /**
     * Scan through the whole markup and prepend host name to relative links (a href and image src)
     * @param {String} url Source url of the provided markup
     * @param {String} markup Markup to be modified
     * @returns {String} newMarkup Modified markup
     */
    TableUtilityFactory.fixRelativeLinks = function (url, markup) {
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

    /**
     *
     * @param {!Element} container Element containing the node group
     * @param {Number} chunkSize Number of nodes for each chunk
     * @returns {Array} chunkList List of node chunks
     */
    TableUtilityFactory.breakNodeGroupIntoChunks = function (container, chunkSize) {
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

    return TableUtilityFactory;
  });
