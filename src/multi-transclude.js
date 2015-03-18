(function(){
  var module = angular.module('multi-transclude', []);

  var Ctrl = ['$scope', '$element', '$transclude', function($scope, $element, $transclude){
    // Ensure we're transcluding or nothing will work.
    if(!$transclude){
      throw new Error(
        'Illegal use of ngMultiTransclude controller. No directive ' +
        'that requires a transclusion found.'
      );
    }

    // There's not a good way to ask Angular to give you the closest
    // controller from a list of controllers, we get all multi-transclude
    // controllers and select the one that is the child of the other.
    this.$element = $element;
    this.isChildOf = function(otherCtrl){
      return otherCtrl.$element[0].contains(this.$element[0]);
    };

    // Destination for transcluded content.
    var toTransclude;
    $scope.$on('$destroy', function(){
      if(toTransclude){
        toTransclude.remove();
        toTransclude = null;
      }
    });

    // A temporary container for transcluded content, so that content will not
    // be detached from the DOM during link. This ensures that controllers and
    // other data parent nodes are accessible within the transcluded content.
    var transcludeContainer = angular.element('<div style="display:none;"></div>');

    // Transclude content that matches name into element.
    this.transclude = function(name, element){
      for(var i = 0; i < toTransclude.length; ++i){
        // Uses the argument as the `name` attribute directly, but we could
        // evaluate it or interpolate it or whatever.
        var el = angular.element(toTransclude[i]);
        if(el.attr('name') === name){
          element.empty();
          element.append(el);
          return;
        }
      }
    };

    // Should be called after all transclusions are complete to clean up the
    // temporary container.
    this.transcluded = function(){
      if(transcludeContainer){
        transcludeContainer.remove();
        transcludeContainer = null;
      }
    };

    // Transclude content and keep track of it; be sure to keep it in the DOM
    // by attaching it to `$element`.
    $transclude(function(clone){
      toTransclude = clone;

      transcludeContainer.append(clone);
      $element.append(transcludeContainer);
    });
  }];

  module.directive('ngMultiTemplate', function(){
    return {
      transclude: true,
      templateUrl: function(element, attrs){
        return attrs.ngMultiTemplate;
      },
      controller: Ctrl,
      link: function(scope, element, attrs, ctrl){
        ctrl.transcluded();
      }
    };
  });

  module.directive('ngMultiTranscludeController', function(){
    return {
      controller: Ctrl,
      link: function(scope, element, attrs, ctrl){
        ctrl.transcluded();
      }
    };
  });

  module.directive('ngMultiTransclude', function(){
    return {
      require: ['?^ngMultiTranscludeController', '?^ngMultiTemplate'],
      link: function(scope, element, attrs, ctrls){
        // Find the deepest controller (closes to this element).
        var ctrl1 = ctrls[0];
        var ctrl2 = ctrls[1];
        var ctrl;
        if(ctrl1 && ctrl2){
          ctrl = ctrl1.isChildOf(ctrl2) ? ctrl1 : ctrl2;
        }
        else {
          ctrl = ctrl1 || ctrl2;
        }

        // A multi-transclude parent directive must be present.
        if(!ctrl){
          throw new Error('Illegal use of ngMultiTransclude. No wrapping controller.')
        }

        // Receive transcluded content.
        ctrl.transclude(attrs.ngMultiTransclude, element);
      }
    };
  });
})();
