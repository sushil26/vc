app.controller('logoutCtl', function ($scope, $window, httpFactory, sessionAuthFactory) {
    console.log("logoutCtl==>");
    sessionAuthFactory.clearAccess();
    $scope.userData = sessionAuthFactory.getAccess("userData");
    $window.location.href = '/';
    // userName = $scope.userData.userName;
    // $scope.loginType = $scope.userData.loginType;
    console.log("<--vcLogout");
})