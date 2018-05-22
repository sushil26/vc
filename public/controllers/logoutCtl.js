app.controller('logoutCtl', function ($scope, $rootScope, $window, httpFactory, sessionAuthFactory) {
    console.log("logoutCtl==>");
    sessionAuthFactory.clearAccess();
    $scope.userData = sessionAuthFactory.getAccess("userData");
    $scope.propertyJson = $rootScope.propertyJson;
    $window.location.href = '/';
    // userName = $scope.userData.userName;
    // $scope.loginType = $scope.userData.loginType;
    console.log("<--vcLogout");
})