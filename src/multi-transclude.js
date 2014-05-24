angular.module('multi-transclude', []).directive('ngMultiTransclude', function(){
  return {
    link: function($scope, $element, $attrs, controller, transcludeFn){
      var selector = '[name=' + $attrs.ngMultiTransclude + ']';
      
      var attach = function(clone){
        $element.html('');
        
        var $part = clone.find(selector).addBack(selector);
        if($part.length){
          $element.append($part);
        }
      };
       
      if(transcludeFn.$$element){
        attach(transcludeFn.$$element);
      }
      else {
        transcludeFn(function(clone){
          transcludeFn.$$element = clone;
          attach(clone);
        });
      }
    }
  };
});
