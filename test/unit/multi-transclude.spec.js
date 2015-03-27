(function () {
  'use strict';

  angular.module('testModule', [])
    .directive('ngAnotherDirective', function(){
      return {
        transclude: true,
        templateUrl: '/directive-template.html',
        link: function(scope, element, attrs){
          // Some fancy logic.
        }
      }
    });

  describe('when transcluding with ngMultiTemplate', function () {
    beforeEach(module('multi-transclude'));
    beforeEach(module('test-partials'));
    beforeEach(module('testModule'));

    it('should replace the original markup', inject(function ($compile, $rootScope) {
      var el = angular.element('<div ng-multi-template="/some-template.html"><div name="some-block">Some Block</div><div name="another-block">Another Block</div>');
      el = $compile(el)($rootScope);
      var scope = el.scope();
      scope.$apply();

      expect(el[0].querySelector('div[ng-multi-template]')).toBeNull();
    }));

    it('should transclude the blocks', inject(function ($compile, $rootScope) {
      var el = angular.element('<div ng-multi-template="/some-template.html"><div name="some-block">Some Block</div><div name="another-block">Another Block</div>');
      el = $compile(el)($rootScope);
      var scope = el.scope();
      scope.$apply();

      expect(angular.element(el[0].querySelector('.main-content div[name=some-block]')).text()).toBe('Some Block');
      expect(angular.element(el[0].querySelector('.secondary-content div[name=another-block]')).text()).toBe('Another Block');
    }));

    it('can transclude scope values', inject(function ($compile, $rootScope) {
      var el = angular.element('<div ng-multi-template="/some-template.html"><div name="some-block">fu{{foo}}</div><div name="another-block">Eat {{several}}</div>');
      var scope = $rootScope.$new();
      scope.foo = 'bar';
      scope.several = 'squirrels';

      el = $compile(el)(scope);
      scope.$apply();

      expect(angular.element(el[0].querySelector('.main-content div[name=some-block]')).text()).toBe('fubar');
      expect(angular.element(el[0].querySelector('.secondary-content div[name=another-block]')).text()).toBe('Eat squirrels');
    }));

    it('can transclude from within a custom directive', inject(function ($compile, $rootScope) {
      var el = angular.element('<div ng-another-directive><div name="some-block">Massive</div><div name="another-block">Explosions</div></div>');
      var scope = $rootScope.$new();

      el = $compile(el)(scope);
      scope.$apply();

      expect(angular.element(el[0].querySelector('.main-content div[name=some-block]')).text()).toBe('Massive');
      expect(angular.element(el[0].querySelector('.secondary-content div[name=another-block]')).text()).toBe('Explosions');
    }));
  });
})();
