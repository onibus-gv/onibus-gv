(function() {

  'use strict';

  angular.module('filters', [])
    .filter('numberFixedLen', function () {
      return function(a, b) {
        return(1e4+a+'').slice(-b);
      };
    });
}());
