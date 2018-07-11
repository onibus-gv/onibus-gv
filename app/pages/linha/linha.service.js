(function() {
  "use strict";

  function linhaService() {
    var linhaId = null;

    var $public = {};

    $public.get = function() {
      return linhaId;
    };

    $public.set = function(value) {
      linhaId = value;
    };

    return $public;
  }

  linhaService.$inject = [];

  angular.module("services.linha", []).factory("linhaService", linhaService);
})();
