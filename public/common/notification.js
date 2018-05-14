	
app.directive('notification',function ($compile) {
    return {
        transclude: false,
        restrict: 'E',
       
        link: function(scope, element, attrs){
           scope.$watch("message", function() {
                console.log("watched message is:"+attrs.displaytype);
                if(attrs.displaytype.toLowerCase()=="success")
                {
                     element.html("<div class=\"alert alert-success\"><strong>Success! </strong>"+attrs.message+"</div>");
                }
                if(attrs.displaytype.toLowerCase()=="error")
                {
                      element.html("<div class=\"alert alert-danger\"><strong>ERROR! </strong> "+attrs.message+"</div>");
                }
                if(attrs.displaytype.toLowerCase()=="info"){
                     element.html("<div class=\"alert alert-info\"><strong>Info! </strong> "+attrs.message+"</div>");
                }

            if(attrs.ngModel){
                element.find('input').attr('ng-model', attrs.ngModel);
                $compile(element.contents())(scope.$parent);
            }
            });
           
           
 
        }
    };
  })