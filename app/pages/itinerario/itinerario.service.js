(function() {

  'use strict';

  function itinerarioService($q, sqlService) {

    var $public = {};

    $public.get = function(linhaId) {
      if (!sqlService.isAvailable()) {
        return $q.reject('ERR_DB');
      }

      var sql = squel.select()
        .from('Linhas', 'l')
        .field('l.*')
        .field('e.nome', 'nomeEmpresa')
        .where('l.id = ?', linhaId)
        .join('Empresas', 'e', 'e.id = l.empresaId');

      return sqlService.fetch(sql.toParam())
      .then(function(linha) {

        var sql2 = squel.select()
          .from('Itinerarios')
          .where('linhaId = ?', linha.id);

        return $q.all([
          sqlService.getAll(sql2.clone().where('sentido = ?', 1).toParam()),
          sqlService.getAll(sql2.clone().where('sentido = ?', 2).toParam())
        ])
        .then(function(itinerarios) {
          linha.itinerariosIda = itinerarios[0];
          linha.itinerariosVolta = itinerarios[1];
          return linha;
        });
      });
    };

    return $public;
  }

  itinerarioService.$inject = ['$q', 'sqlService'];

  angular.module('services.itinerario', [
    'services.sql'
  ])
  .factory('itinerarioService', itinerarioService);

}());
