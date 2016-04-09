describe('horario.service', function() {

  var horarioService;
  var q;
  var rootScope;

  var sqlServiceMock = function() {};

  beforeEach(module('services.horario', function($provide) {
    $provide.service('sqlService', sqlServiceMock);
  }));

  beforeEach(inject(function(_horarioService_, sqlService, $q, $rootScope) {
    horarioService = _horarioService_;
    q = $q;
    rootScope = $rootScope;
  }));

  it('should return error if db is not available', function(done) {
    sqlServiceMock.prototype.isAvailable = function() {
      return false;
    };

    horarioService
      .get(1, 0)
      .catch(function(err) {
        expect(err).toBe('ERR_DB');
        done();
      });

    rootScope.$digest();
  });

  it('should return error if a db call fails', function(done) {
    sqlServiceMock.prototype.isAvailable = function() {
      return true;
    };

    sqlServiceMock.prototype.fetch = function() {
      return q.reject('fake error');
    };

    horarioService
      .get(1, 0)
      .catch(function(err) {
        expect(err).toBe('fake error');
        done();
      });

    rootScope.$digest();
  });

  it('should return the response on success', function(done) {
    sqlServiceMock.prototype.isAvailable = function() {
      return true;
    };

    sqlServiceMock.prototype.fetch = function() {
      return q.resolve({
        id: 1
      });
    };

    sqlServiceMock.prototype.getAll = function() {
      return q.resolve([]);
    };

    horarioService
      .get(1, 0)
      .then(function(linha) {
        expect(linha).toEqual(jasmine.objectContaining({
          id: 1
        }));
        done();
      });

    rootScope.$digest();
  });
});
