careatorApp.controller("careatorCommAppCtrl", function ($scope,$state) {
    console.log("Chat controller==>");

$scope.gotToDashboard = function(){
    console.log("gotToDashboard-->");
    $state.go('Cdashboard', {});
}

})