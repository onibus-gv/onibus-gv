(function() {

  'use strict';

  function LinhaCtrl($scope, linhaService) {
    $scope.linha = null;
    $scope.$on('$ionicView.enter', function() {
      $scope.linha = linhaService.get();
    });
  }

  LinhaCtrl.$inject = [
    '$scope',
    'linhaService',
  ];

  angular.module('linha', [
    'services.linha'
  ])
  .controller('LinhaCtrl', LinhaCtrl);

}());
