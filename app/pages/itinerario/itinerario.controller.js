(function() {
  "use strict";

  function ItinerarioCtrl(
    $scope,
    $stateParams,
    $ionicLoading,
    $ionicPopup,
    linhaService,
    itinerarioService
  ) {
    linhaService.set($stateParams.linha);

    $ionicLoading.show({
      template: "Carregando..."
    });

    itinerarioService
      .get($stateParams.linha)
      .then(function(res) {
        $scope.linha = res;
      })
      .catch(function(err) {
        $ionicPopup.alert({
          title:
            err === "ERR_DB"
              ? "Erro ao abrir banco de dados, se o erro persistir reinstale o aplicativo"
              : "Erro ao buscar itinerários, tente novamente"
        });
      })
      .then(function() {
        $ionicLoading.hide();
      });
  }

  ItinerarioCtrl.$inject = [
    "$scope",
    "$stateParams",
    "$ionicLoading",
    "$ionicPopup",
    "linhaService",
    "itinerarioService"
  ];

  angular
    .module("itinerario", ["services.itinerario", "services.linha"])
    .controller("ItinerarioCtrl", ItinerarioCtrl);
})();
