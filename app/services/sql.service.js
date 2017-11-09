(function() {

  'use strict';

  function sqlService($q, $timeout, transformService) {

    var db = null;

    var onDeviceReady = function() {
      if (typeof window.sqlitePlugin !== 'undefined') {
        // Deleta DB's antigos
        // TODO: Arrumar um jeito de melhorar isso
        window.sqlitePlugin.deleteDatabase({
          name: 'onibus-4011.db',
          location: 'default'
        });

        db = window.sqlitePlugin.openDatabase({
          name: 'onibus-4012.db',
          location: 'default',
          createFromLocation: 1
        });
      } else if (window.openDatabase) {
        db = window.openDatabase('onibus-4012.db', '1', 'db', 1024 * 1024 * 100);
      }
    };

    var $public = {};

    $public.isAvailable = function() {
      return db;
    };

    $public.init = function() {

      var def = $q.defer();

      // are we running in native app or in a browser?
      window.isphone = false;

      if (document.URL.indexOf('http://') === -1 &&
          document.URL.indexOf('https://') === -1) {
        window.isphone = true;
      }

      if ( window.isphone ) {
        document.addEventListener('deviceready', function() {

          onDeviceReady();

          $timeout(function() {
            def.resolve();
          }, 1);
        }, false);
      } else {

        onDeviceReady();
        $timeout(function() {
          def.resolve();
        }, 1);
      }

      return def.promise;
    };

    $public.query = function(q) {
      var deferred = $q.defer();
      db.transaction(function(tx) {
        tx.executeSql(q.text, q.values, function(tx, results) {
          deferred.resolve(results);
        }, function(tx, e) {
          deferred.reject(e);
        });
      });
      return deferred.promise;
    };

    $public.fetch = function(q) {

      var deferred = $q.defer();

      $public.query(q).then(function(res) {

        var obj = transformService.singleTransform(res);
        deferred.resolve(obj);

      }, deferred.reject);

      return deferred.promise;
    };

    $public.getAll = function(q) {

      var deferred = $q.defer();

      $public.query(q).then(function(res) {

        var obj = transformService.transformObject(res);
        deferred.resolve(obj);

      }, deferred.reject);

      return deferred.promise;
    };

    $public.multQuery = function(queries) {
      var requests = [], def = $q.defer();

      db.transaction(function(tx) {
        angular.forEach(queries, function(q) {
          var deferred = $q.defer();

          tx.executeSql(q.text, q.values, function(tx, results) {
            deferred.resolve(results);
          }, function(tx, e) {
            deferred.reject(e);
          });

          requests.push(deferred.promise);
        });

        def.resolve();
      });

      return def.promise.then(function() {
        return $q.all(requests);
      });
    };

    $public.batchInsert = function(tableName, dados) {
      var sql1 = squel.insert().into(tableName), queries = [];

      angular.forEach(dados, function(fields) {
        var sql2 = sql1.clone().setFields(fields).toParam();
        queries.push(sql2);
      });

      return this.multQuery(queries);
    };

    return $public;
  }

  sqlService.$inject = ['$q', '$timeout', 'transformService'];

  angular.module('services.sql', [
    'services.transform'
  ])
  .factory('sqlService', sqlService);

}());
