app.controller('dashboardPersonalDetailController', function ($scope, $rootScope, $window, $uibModal, httpFactory, sessionAuthFactory) {
    console.log("dashboardController==>");
    $scope.userData = sessionAuthFactory.getAccess("userData");
    console.log(" $scope.userData: " + JSON.stringify($scope.userData));
    $scope.loginType = $scope.userData.loginType;
    $scope.userName = $scope.userData.userName;
    var id = $scope.userData.id;
    $scope.propertyJson = $rootScope.propertyJson;
    console.log("dashboardPersonalDetailController-->");

    $scope.getschoollogoPath = function () {
        console.log("getschoollogoPath----------->");
        var schoolName = $scope.userData.schoolName;
        console.log("schoolName: " + schoolName);
        var api = $scope.propertyJson.VC_getSchoolData + "/" + schoolName;
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.schoolLogoPath = data.data.data.logoPath;
                console.log("$scope.schoolLogoPath: " + $scope.schoolLogoPath);
                //   $scope.css = $scope.teacherData[0].css;
                //   console.log("$scope.css: " + JSON.stringify($scope.css));
            } else {
                console.log("data.status: " + data.status);
            }
        })
    }

    if ($scope.loginType == 'teacher' || $scope.loginType == 'studParent') {
        $scope.getschoollogoPath();
    }

    $scope.getUserDetails = function (id) {
        console.log("getTeacherData-->");
        if ($scope.loginType == 'teacher' || $scope.loginType == 'admin' || $scope.loginType == 'vc4allAdmin') {
            var api = $scope.propertyJson.VC_teacherDetail + "/" + id;
        } else if ($scope.loginType == 'studParent') {
            var api = $scope.propertyJson.VC_studentDetail + "/" + id;
        }
        //var api = "http://localhost:5000/vc/teacherDetail" + "/" + id;
        //var api = "http://localhost:5000/vc/eventGet";
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            //console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.userData = data.data.data;
                console.log("teacherData: " + JSON.stringify($scope.userData));
                //   $scope.css = $scope.teacherData[0].css;
                //   console.log("$scope.css: " + JSON.stringify($scope.css));
            } else {

            }

        })
        console.log("<--getTeacherData");
    }
    $scope.getUserDetails(id);



})