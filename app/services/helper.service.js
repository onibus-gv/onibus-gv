(function() {

  'use strict';

  function helperService() {

    var $public = {};

    $public.diaInteiroToEnum = function() {

      var dia = new Date().getDay();

      /*
       * ['Domingo', 'Segunda', ... ,'Sábado']
       *
       * Feriados = 4????
       * Domingo = 3
       * Sábado  = 2
       * Dia da semana = 1
       */
      return dia === 0 ? 3 : (dia === 6 ? 2 : 1);
    };

    return $public;
  }

  helperService.$inject = [];

  angular.module('services.helper', [])
    .factory('helperService', helperService);

}());
