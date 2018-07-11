describe("HorarioCtrl", function() {
  beforeEach(module("horario"));

  var rootScope;
  var scopeMock = {};
  var deferredHorario;
  var stateParamsMock;
  var ionicLoadingMock;
  var ionicPopupMock;
  var horarioServiceMock;
  var linhaServiceMock;
  var helperServiceMock;

  beforeEach(inject(function($controller, $q, $rootScope) {
    deferredHorario = $q.defer();
    scopeMock = {};
    stateParamsMock = {
      linha: 1,
      dia: 0
    };
    ionicPopupMock = jasmine.createSpyObj("$ionicPopup", ["alert"]);
    ionicLoadingMock = jasmine.createSpyObj("$ionicPopup", ["show", "hide"]);
    horarioServiceMock = {
      get: jasmine
        .createSpy("search spy")
        .and.returnValue(deferredHorario.promise)
    };
    linhaServiceMock = jasmine.createSpyObj("linhaService spy", ["set"]);
    helperServiceMock = jasmine.createSpyObj("helperServiceMock spy", [
      "diaInteiroToEnum"
    ]);
    rootScope = $rootScope;
    $controller("HorarioCtrl", {
      $scope: scopeMock,
      $stateParams: stateParamsMock,
      $ionicLoading: ionicLoadingMock,
      $ionicPopup: ionicPopupMock,
      horarioService: horarioServiceMock,
      linhaService: linhaServiceMock,
      helperService: helperServiceMock
    });
  }));

  it("should show loading on enter", function() {
    expect(ionicLoadingMock.show).toHaveBeenCalled();
  });

  it("should set linhaService to equal $stateParams.linha on enter", function() {
    expect(linhaServiceMock.set).toHaveBeenCalledWith(1);
  });

  it("should call loadHorarios on enter", function() {
    expect(horarioServiceMock.get).toHaveBeenCalled();
  });

  describe("$scope.onClickTab", function() {
    it("should switch tab and call loadHorarios", function() {
      scopeMock.onClickTab(2);
      expect(horarioServiceMock.get).toHaveBeenCalled();
      expect(ionicLoadingMock.show).toHaveBeenCalled();
      expect(scopeMock.currentTab).toEqual(2);
    });

    it("should update $scope.linha on success", function() {
      scopeMock.onClickTab(2);
      deferredHorario.resolve({});
      rootScope.$digest();
      expect(scopeMock.linha).toEqual({});
      expect(ionicLoadingMock.hide).toHaveBeenCalled();
    });

    it("should call $ionicPopup.alert on error", function() {
      scopeMock.onClickTab(2);
      deferredHorario.reject();
      rootScope.$digest();
      expect(ionicPopupMock.alert).toHaveBeenCalled();
      expect(ionicLoadingMock.hide).toHaveBeenCalled();
    });
  });

  describe("$scope.isActiveTab", function() {
    it("should check if the given tab is active", function() {
      scopeMock.onClickTab(2);
      expect(scopeMock.isActiveTab(2)).toBe(true);
      expect(scopeMock.isActiveTab(1)).toBe(false);
    });
  });
});
