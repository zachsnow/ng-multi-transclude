(function() {
  var module = angular.module('multi-transclude', []);

  module.directive('ngMultiTemplate', function() {
    return {
      transclude: true,
      templateUrl: function(element, attrs) {
        return attrs.ngMultiTemplate;
      },
      controller: Ctrl
    };
  });

  module.directive('ngMultiTranscludeController', function() {
    return {
      controller: Ctrl
    };
  });

  module.directive('ngMultiTransclude', function() {
    return {
      require: ['?^ngMultiTranscludeController', '?^ngMultiTemplate'],
      link: function(scope, element, attrs, ctrls) {
        // one type of multi-transclude parent directive must be present
        var ctrl;
        if(ctrls[0] && ctrls[1]) {
          // both controllers are present so pick the deepest in the DOM tree
          ctrl = ctrls[0].deepest(ctrls[1]);
        } else {
          ctrl = ctrls[0] || ctrls[1];
        }
        if(ctrl) {
          // receive transcluded content
          ctrl.transclude(attrs.ngMultiTransclude, element);
        }
      }
    };
  });

  Ctrl.$inject = ['$scope', '$element', '$transclude'];
  function Ctrl($scope, $element, $transclude) {
    // ensure we're transcluding or nothing will work
    if(!$transclude) {
      throw new Error(
        'Illegal use of ngMultiTransclude controller. No directive ' +
        'that requires a transclusion found.');
    }

    var _toTransclude = null;

    $scope.$on('$destroy', function() {
      _toTransclude.remove();
    });

    // transclude content that matches name into element
    this.transclude = function(name, element) {
      for(var i = 0; i < _toTransclude.length; ++i) {
        // uses the argument as the `name` attribute directly, but we could
        // evaluate it or interpolate it or whatever
        var el = angular.element(_toTransclude[i]);
        if(el.attr('name') === name) {
          element.append(el);
          return;
        }
      }
    };

    // pick the deepest controller in the DOM tree
    this.deepest = function(ctrl) {
      if($element.inheritedData(
        '$ngMultiTranscludeControllerController') === ctrl ||
        $element.inheritedData('$ngMultiTemplateController') === ctrl) {
        // ctrl is a parent of this, so return this
        return this;
      }
      // ctrl is not a parent, return ctrl
      return ctrl;
    };

    // get content to transclude
    $transclude(function(clone) {
      _toTransclude = clone;
    });
  }
})();
