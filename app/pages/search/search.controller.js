(function() {
  "use strict";

  function SearchCtrl(
    $scope,
    $state,
    $stateParams,
    $ionicLoading,
    $ionicPopup,
    searchService
  ) {
    $scope.searchQuery = $stateParams.searchQuery;
    $scope.linhas = [];
    $scope.offset = 0;
    $scope.noMoreItemsAvailable = false;
    $scope.loaded = false;
    $scope.loading = false;

    if ($scope.linhas.length === 0) {
      $ionicLoading.show({
        template: "Carregando..."
      });
    }

    $scope.goToDetails = function(linhaId) {
      $state.go("tabs.horarios", {
        linha: linhaId,
        dia: 0
      });
    };

    $scope.loadMoreData = function() {
      $scope.loading = true;

      searchService
        .search($scope.searchQuery, $scope.offset)
        .then(function(result) {
          if (result.length === 0) {
            $scope.noMoreItemsAvailable = true;
          }
          $scope.linhas = $scope.linhas.concat(result);
          $scope.offset += result.length;
        })
        .catch(function(err) {
          $scope.noMoreItemsAvailable = true;
          $ionicPopup.alert({
            title:
              err === "ERR_DB"
                ? "Erro ao abrir banco de dados, se o erro persistir reinstale o aplicativo"
                : "Erro ao buscar, tente novamente"
          });
        })
        .then(function() {
          $ionicLoading.hide();
          $scope.loaded = true;
          $scope.loading = false;
          $scope.$broadcast("scroll.infiniteScrollComplete");
        });
    };
  }

  SearchCtrl.$inject = [
    "$scope",
    "$state",
    "$stateParams",
    "$ionicLoading",
    "$ionicPopup",
    "searchService"
  ];

  angular
    .module("search", ["services.search"])
    .controller("SearchCtrl", SearchCtrl);
})();
