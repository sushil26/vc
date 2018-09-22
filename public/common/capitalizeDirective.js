careatorApp.directive('capitalizeDirective', ['$parse', function ($parse) {
   
        return {
            require: 'ngModel',
                restrict: 'A',
               link: function(scope, element, attrs, modelCtrl) {
                   modelCtrl.$parsers.push(function(inputValue) {
         
       
                       var transformedInput = inputValue.toLowerCase();
                      
                        return transformedInput.substring(0,1).toUpperCase()+transformedInput.substring(1);
                       
                   });
               }
           };
    
}])