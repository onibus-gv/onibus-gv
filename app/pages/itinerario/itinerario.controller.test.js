describe('ItinerarioCtrl', function() {

  beforeEach(module('itinerario'));

  var rootScope;
  var scopeMock = {};
  var deferredItinerario;
  var stateParamsMock;
  var ionicLoadingMock;
  var ionicPopupMock;
  var itinerarioServiceMock;
  var linhaServiceMock;

  beforeEach(inject(function($controller, $q, $rootScope) {
    deferredItinerario = $q.defer();
    scopeMock = {};
    stateParamsMock = {
      linha: 1
    };
    ionicPopupMock = jasmine.createSpyObj('$ionicPopup', ['alert']);
    ionicLoadingMock = jasmine.createSpyObj('$ionicLoadingMock', ['show', 'hide']);
    itinerarioServiceMock = {
      get: jasmine.createSpy('search spy')
                .and.returnValue(deferredItinerario.promise)
    };
    linhaServiceMock = jasmine.createSpyObj('linhaService spy', ['set']);
    rootScope = $rootScope;
    $controller('ItinerarioCtrl', {
      $scope: scopeMock,
      $stateParams: stateParamsMock,
      $ionicLoading: ionicLoadingMock,
      $ionicPopup: ionicPopupMock,
      linhaService: linhaServiceMock,
      itinerarioService: itinerarioServiceMock
    });
  }));

  it('should show loading on enter', function() {
    expect(ionicLoadingMock.show).toHaveBeenCalled();
  });

  it('should set linhaService to equal $stateParams.linha on enter', function() {
    expect(linhaServiceMock.set).toHaveBeenCalledWith(1);
  });

  it('should load itinerarios on enter', function() {
    expect(itinerarioServiceMock.get).toHaveBeenCalled();
  });

  it('should update $scope.linha on success', function() {
    deferredItinerario.resolve({});
    rootScope.$digest();
    expect(scopeMock.linha).toEqual({});
    expect(ionicLoadingMock.hide).toHaveBeenCalled();
  });

  it('should call $ionicPopup.alert on error', function() {
    deferredItinerario.reject();
    rootScope.$digest();
    expect(ionicPopupMock.alert).toHaveBeenCalled();
    expect(ionicLoadingMock.hide).toHaveBeenCalled();
  });
});
