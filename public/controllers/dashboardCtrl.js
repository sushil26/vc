app.controller('dashboardController', function ($scope, $window, httpFactory) {
    console.log("dashboardController==>");
    var id = localStorage.getItem("id");
    $scope.loginType = localStorage.getItem("loginType");
     $scope.userName = localStorage.getItem("userName");

    $scope.logOut = function () {
        console.log("logOut-->");
        localStorage.removeItem("userData");
        localStorage.removeItem("userName");
        localStorage.removeItem("status");
        localStorage.removeItem("email");
        localStorage.removeItem("loginType");
        localStorage.removeItem("id");
        localStorage.removeItem("css");
        window.location.href = "https://norecruits.com";
        console.log("<--logOut");
    }





})