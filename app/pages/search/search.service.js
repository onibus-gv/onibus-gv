(function() {
  "use strict";

  function searchService($q, sqlService, helperService, transformService) {
    var table = "Linhas";
    var perPage = 10;

    var getHorarios = function(ids, sentido) {
      if (typeof ids == "undefined" || ids.length == 0) return;

      var time = new Date(),
        hour = time.getHours(),
        minutes = time.getMinutes(),
        dia = helperService.diaInteiroToEnum();

      var sql = squel.select().from("Horarios", "h");

      if (hour === 23) {
        sql = sql.clone().where("(hora >= ? OR hora = 0)", hour);
      } else {
        sql = sql.clone().where("hora >= ?", hour);
      }

      sql = sql
        .clone()
        .where(
          "minuto >= (CASE WHEN hora = ? THEN ? ELSE 0 END)",
          hour,
          minutes
        )
        .where("dia = ?", dia)
        .where("sentido = ?", sentido)
        .limit(4);

      var sql2 = [];

      for (var i = 0; i < ids.length; i++) {
        var _sql = sql
          .clone()
          .where("linhaId = ?", ids[i])
          .toParam();
        sql2.push(_sql);
      }

      return sqlService.multQuery(sql2);
    };

    var getObservacoes = function(ids) {
      var sql = squel
        .select()
        .from("Observacaos")
        .where("linhaId IN(" + ids + ")");

      return sqlService.getAll(sql.toParam());
    };

    var $public = {};

    $public.search = function(search, page) {
      if (!sqlService.isAvailable()) {
        return $q.reject("ERR_DB");
      }

      var sql = squel
        .select()
        .from(table, "l")
        .field("l.*")
        .field("e.nome", "nomeEmpresa");

      if (typeof search !== "undefined") {
        if (search !== "") {
          sql.where(
            "l.linha LIKE ? or l.saida LIKE ? or l.destino LIKE ? " +
              "or l.nome LIKE ?",
            "%" + search + "%",
            "%" + search + "%",
            "%" + search + "%",
            "%" + search + "%",
            "%" + search + "%"
          );
        }
      }

      sql
        .join("Empresas", "e", "e.id = l.empresaId")
        .group("l.id")
        .offset(page)
        .limit(perPage);

      return sqlService.getAll(sql.toParam()).then(function(linhas) {
        if (linhas.length === 0) return [];

        var ids = linhas.reduce(function(old, linha) {
          old.push(linha.id);
          return old;
        }, []);

        return $q
          .all([getHorarios(ids, 1), getHorarios(ids, 2), getObservacoes(ids)])
          .then(function(result) {
            var horariosIda = transformService.transformMultQuery(result[0]);
            var horariosVolta = transformService.transformMultQuery(result[1]);

            return linhas.map(function(linha, i) {
              linha.horariosIda = horariosIda[i] || [];
              linha.horariosVolta = horariosVolta[i] || [];

              var allHorarios = linha.horariosIda.concat(linha.horariosVolta);

              linha.observacoes = result[2].filter(function(obs) {
                return allHorarios.filter(function(h) {
                  return h.siglaObs == obs.sigla && h.linhaId == linha.id;
                }).length;
              });

              return linha;
            });
          });
      });
    };

    return $public;
  }

  searchService.$inject = [
    "$q",
    "sqlService",
    "helperService",
    "transformService"
  ];

  angular
    .module("services.search", [
      "services.sql",
      "services.helper",
      "services.transform"
    ])
    .factory("searchService", searchService);
})();
