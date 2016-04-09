describe('number filter', function() {

  beforeEach(module('filters'));

  var $filter;

  beforeEach(inject(function(_$filter_){
    $filter = _$filter_;
  }));

  it('returns 01 when given 1', function() {
    var numberFixedLen = $filter('numberFixedLen');
    expect(numberFixedLen(1, 2)).toEqual('01');
  });

  it('returns 10 when given 10', function() {
    var numberFixedLen = $filter('numberFixedLen');
    expect(numberFixedLen(10, 2)).toEqual('10');
  });
});
