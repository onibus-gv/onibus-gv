(function() {

  'use strict';

  function HomeCtrl($scope, $state) {
    $scope.formData = {
      searchQuery: ''
    };

    $scope.search = function() {
      $state.go('search', {
        searchQuery: $scope.formData.searchQuery
      });
    };
  }

  HomeCtrl.$inject = ['$scope', '$state'];

  angular.module('home', []).controller('HomeCtrl', HomeCtrl);

}());
