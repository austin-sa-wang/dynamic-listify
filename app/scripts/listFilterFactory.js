angular.module('listFilterFactory', [])
.factory('ListFilterFactory', function ListFilterFactory () {

  ListFilterFactory.filterList = function (_list, filterExpr) {
    var filteredList = _list.cloneNode(true);
    var regex = new RegExp(filterExpr, 'i');

    var listChildren = filteredList.children;
    var currentNode;

    // Remove filtered nodes
    for (var i = 0; i < listChildren.length; ) {
      currentNode = listChildren[i];
      if (!regex.exec(currentNode.innerText)) {
        filteredList.removeChild(currentNode);
      } else {
        i++;
      }
    }

    return filteredList;
  };

  return ListFilterFactory;
});
