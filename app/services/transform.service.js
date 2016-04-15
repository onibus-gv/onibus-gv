(function() {

  'use strict';

  function transformService($q) {

    var $public = {};

    $public.singleTransform = function(results) {
      if (results.rows.length >= 1) {
        return results.rows.item(0);
      } else {
        return $q.reject('Nenhum resultado');
      }
    };

    $public.transformMultQuery = function(arr) {

      if (angular.isArray(arr)) {
        var models = [];

        angular.forEach(arr, function(object) {
          models.push($public.transformObject(object));
        });

        return models;

      } else {
        return null;
      }
    };

    $public.transformObject = function(results) {

      var models = [];

      for (var i = 0; i < results.rows.length; i++) {
        models.push(results.rows.item(i));
      }

      return models;
    };

    return $public;
  }

  transformService.$inject = ['$q'];

  angular.module('services.transform', [])
    .factory('transformService', transformService);

}());
