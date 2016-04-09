(function() {

  'use strict';

  function horarioService($q, sqlService, helperService) {

    var getHorarios = function(linhaId, empresaId, sentido, dia) {
      var dia = dia || helperService.diaInteiroToEnum();
      var sql = squel.select()
        .from('Horarios')
        .where('linhaId = ?', linhaId)
        .where('dia = ?', dia)
        .where('sentido = ?', sentido)
        .toParam();

      return sqlService.getAll(sql);
    };

    var getLinha = function(linhaId) {
      var sql = squel.select()
        .from('Linhas', 'l')
        .field('l.*')
        .field('e.nome', 'nomeEmpresa')
        .where('l.id = ?', linhaId)
        .join('Empresas', 'e', 'e.id = l.empresaId');

      return sqlService.fetch(sql.toParam());
    };

    var getObservacao = function(linhaId) {
      var sql = squel.select()
        .from('Observacaos')
        .where('linhaId = ?', linhaId);

      return sqlService.getAll(sql.toParam());
    };

    var $public = {};

    $public.get = function(linhaId, dia) {
      if (!sqlService.isAvailable()) {
        return $q.reject('ERR_DB');
      }

      return getLinha(linhaId)
      .then(function(linha) {
        return $q.all([
          getHorarios(linha.id, linha.empresaId, 1, dia),
          getHorarios(linha.id, linha.empresaId, 2, dia),
          getObservacao(linha.id)
        ])
        .then(function(res) {
          linha.horariosIda = res[0];
          linha.horariosVolta = res[1];
          linha.observacoes = res[2];
          return linha;
        });
      });
    };

    return $public;
  }

  horarioService.$inject = [
    '$q',
    'sqlService',
    'helperService'
  ];

  angular.module('services.horario', [
    'services.sql',
    'services.helper'
  ])
  .factory('horarioService', horarioService);

}());
