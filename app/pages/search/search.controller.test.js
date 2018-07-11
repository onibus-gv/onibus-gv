describe("SearchCtrl", function() {
  beforeEach(module("search"));

  var rootScope;
  var scopeMock = {};
  var deferredSearch;
  var stateMock;
  var stateParamsMock;
  var ionicLoadingMock;
  var ionicPopupMock;
  var searchServiceMock;

  beforeEach(inject(function($controller, $q, $rootScope) {
    deferredSearch = $q.defer();
    scopeMock = jasmine.createSpyObj("$scope spy", ["$broadcast"]);
    stateMock = jasmine.createSpyObj("$state spy", ["go"]);
    stateParamsMock = {
      searchQuery: "searchQuery"
    };
    ionicLoadingMock = jasmine.createSpyObj("$ionicLoading", ["show", "hide"]);
    ionicPopupMock = jasmine.createSpyObj("$ionicPopup", ["alert"]);
    searchServiceMock = {
      search: jasmine
        .createSpy("search spy")
        .and.returnValue(deferredSearch.promise)
    };
    rootScope = $rootScope;
    $controller("SearchCtrl", {
      $scope: scopeMock,
      $state: stateMock,
      $stateParams: stateParamsMock,
      $ionicLoading: ionicLoadingMock,
      $ionicPopup: ionicPopupMock,
      searchService: searchServiceMock
    });
  }));

  it("should show $ionicLoading on enter", function() {
    expect(ionicLoadingMock.show).toHaveBeenCalledWith({
      template: "Carregando..."
    });
  });

  describe("$scope.goToDetails", function() {
    it("should change state to to tabs.horarios", function() {
      scopeMock.goToDetails(1);
      expect(stateMock.go).toHaveBeenCalledWith("tabs.horarios", {
        linha: 1,
        dia: 0
      });
    });
  });

  describe("$scope.loadMoreData", function() {
    it("should load more data on success", function() {
      scopeMock.loadMoreData();

      // Loading 0 items
      deferredSearch.resolve([]);

      rootScope.$digest();

      expect(scopeMock.loading).toBe(false);
      expect(scopeMock.loaded).toBe(true);
      expect(scopeMock.$broadcast).toHaveBeenCalledWith(
        "scroll.infiniteScrollComplete"
      );
      expect(ionicLoadingMock.hide).toHaveBeenCalledWith();
      expect(scopeMock.offset).toBe(0);
      expect(scopeMock.noMoreItemsAvailable).toBe(true);
    });

    it("should load more data on success", function() {
      scopeMock.loadMoreData();

      // Loading 2 items
      deferredSearch.resolve([1, 2]);

      rootScope.$digest();

      expect(scopeMock.loading).toBe(false);
      expect(scopeMock.loaded).toBe(true);
      expect(scopeMock.$broadcast).toHaveBeenCalledWith(
        "scroll.infiniteScrollComplete"
      );
      expect(ionicLoadingMock.hide).toHaveBeenCalledWith();
      expect(scopeMock.offset).toBe(2);
      expect(scopeMock.noMoreItemsAvailable).toBe(false);
    });

    it("should alert on error", function() {
      scopeMock.loadMoreData();

      // Failing the promise
      deferredSearch.reject();

      rootScope.$digest();

      expect(scopeMock.loading).toBe(false);
      expect(scopeMock.loaded).toBe(true);
      expect(scopeMock.$broadcast).toHaveBeenCalledWith(
        "scroll.infiniteScrollComplete"
      );
      expect(ionicLoadingMock.hide).toHaveBeenCalledWith();
      expect(scopeMock.offset).toBe(0);
      expect(scopeMock.noMoreItemsAvailable).toBe(true);

      expect(ionicPopupMock.alert).toHaveBeenCalledWith({
        title: "Erro ao buscar, tente novamente"
      });
    });
  });
});
