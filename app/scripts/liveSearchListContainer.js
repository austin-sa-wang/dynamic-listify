angular.module('liveSearchListContainer', [

])

  .controller('LiveSearchListContainerCtrl', function($scope) {
    $scope.list1 = {
      head: 'HEAD',
      data: 'DATA'
    };
    $.get('sample.html', function (response) {
      var trueSrc = document.createElement('div');
      trueSrc.innerHTML = response;
      var listHead = document.createDocumentFragment();
      var listData = document.createDocumentFragment();
      listData.appendChild(trueSrc.getElementsByTagName('tbody')[0]);
      listHead.appendChild(trueSrc.children[0]);
      $scope.list1.head = listHead.childNodes[0];
      $scope.list1.data = listData.childNodes[0];
    });
  })

  .directive('liveSearchListContainer', function ($compile) {
    return {
      scope: {

      },
      controller: 'LiveSearchListContainerCtrl',
      controllerAs: 'ctrl',
      link: function (scope, element) {
        var newDomListMarkup = '<div live-search-list="" src-markup="list1"></div>';
        var newDomList = $compile(newDomListMarkup)(scope);
        element.append(newDomList);
      }
    }
  });
