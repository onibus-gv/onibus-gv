describe('HomeCtrl', function() {

  beforeEach(module('home'));

  var $controller;

  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));

  describe('$scope.search', function() {
    it('should change state to to search and pass searchQuery', function() {

      // $scope mock
      var $scope = {
        formData: {
          searchQuery: ''
        }
      };

      // $state mock
      var stateMock = jasmine.createSpyObj('$state spy', ['go']);

      // HomeCtrl mock
      $controller('HomeCtrl', {
        $scope: $scope,
        $state: stateMock
      });

      // Fake input and search
      $scope.formData.searchQuery = 'searchQuery';
      $scope.search();

      expect(stateMock.go).toHaveBeenCalledWith('search', {
        searchQuery: 'searchQuery'
      });
    });
  });
});
