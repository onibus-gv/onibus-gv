(function() {

  'use strict';

  function HorarioCtrl($scope, $stateParams, $ionicLoading, $ionicPopup,
                       horarioService, linhaService, helperService) {

    var enumDia = helperService.diaInteiroToEnum();
    $scope.currentTab = enumDia;
    linhaService.set($stateParams.linha);

    $scope.onClickTab = function(dia) {
      loadHorarios(dia);
      $scope.currentTab = dia;
    };

    $scope.isActiveTab = function(dia) {
      return dia == $scope.currentTab;
    }

    var loadHorarios = function(dia) {
      $ionicLoading.show({
        template: 'Carregando...'
      });
      horarioService.get($stateParams.linha, dia)
      .then(function(res) {
        $scope.linha = res;
      })
      .catch(function(err) {
        $ionicPopup.alert({
          title: err === 'ERR_DB'
            ? 'Erro ao abrir banco de dados, se o erro persistir reinstale o aplicativo'
            : 'Erro ao buscar horários, tente novamente'});
      })
      .then(function() {
        $ionicLoading.hide();
      });
    };
    loadHorarios(enumDia);
  }

  HorarioCtrl.$inject = [
    '$scope',
    '$stateParams',
    '$ionicLoading',
    '$ionicPopup',
    'horarioService',
    'linhaService',
    'helperService'
  ];

  angular.module('horario', [
    'services.horario',
    'services.helper',
    'services.linha'
  ])
  .controller('HorarioCtrl', HorarioCtrl);

}());
