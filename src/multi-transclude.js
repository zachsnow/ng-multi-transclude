angular.module('multi-transclude', []).directive('ngMultiTransclude', [
  function(){
    return {
      compile: function($element, $attrs, $transclude){
        return function(scope, element, attrs, ctrl, transcludeFn){
          var selector = '[name=' + attrs.ngMultiTransclude + ']';
      
          // Replace this element's HTML with the correct
          // part of the clone.
          var attach = function(clone){
            element.html('');
            
            var $part = clone.find(selector).addBack(selector);
            if($part.length){
              element.append($part);
            }
          };
          
          // Only link the clone if we haven't already; store
          // the already-linked clone on the `compile` method's
          // `$transclude` as that function is shared by all
          // instances of the `ng-multi-transclude` directive,
          // whereas `transcludeFn` is not.  We can still use
          // `transcludeFn` to link, though.
          if($transclude.$$element){
            attach($transclude.$$element);
          }
          else {
            transcludeFn(function(clone){
              $transclude.$$element = clone;
              attach(clone);
            });
          }
        };
      }
    };
  }
]);
