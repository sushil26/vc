app.controller('allUserCtl', function ($scope, $state, $window,$uibModal, httpFactory, sessionAuthFactory) {
    console.log("allUserCtl==>");
    $scope.userData = sessionAuthFactory.getAccess("userData");
    console.log(" $scope.userData : " + JSON.stringify($scope.userData));

    $scope.getSchoolList = function () {
        console.log("getSchoolList-->");
        var api = "https://norecruits.com/vc/getSchoolList";
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.schoolList = data.data.data;
                console.log("schoolList: " + JSON.stringify($scope.schoolList));

                console.log(data.data.message);
            }
            else {
                console.log("Sorry");
            }

        })

        console.log("<--getSchoolList");
    }
    $scope.getSchoolList();

    $scope.schoolUserData = function (schoolName) {
        console.log("schoolUserData-->");
        var api = "https://norecruits.com/vc/getSchoolUser/" + schoolName;
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                var schoolUser = data.data.data;
                // console.log("schoolList: " + JSON.stringify(schoolUser));
                $scope.teacherData = schoolUser.schoolTeacherList;
                $scope.studentData = schoolUser.schoolStudentList;
                console.log(" $scope.teacherData: " + JSON.stringify($scope.teacherData));
                console.log("$scope.studentData: " + JSON.stringify($scope.studentData));
                console.log(data.data.message);
            }
            else {
                console.log("Sorry");
            }

        })
        console.log("<--schoolUserData");
    }

    $scope.updateAdminStatus = function (id, status, index) {
        console.log("updateUserStatus-->");
        var api = "https://norecruits.com/vc/updateUserStatus";
        //var api = "http://localhost:5000/vc/updateUserStatus";

        var obj = {
            "id": id,
            "status": status
        }

        httpFactory.post(api, obj).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.teacherData[index].status = status;
                var loginAlert = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/html/templates/dashboardsuccess.html',
                    windowClass: 'show',
                    backdropClass: 'static',
                    keyboard: false,
                    controller: function ($scope, $uibModalInstance) {
                      $scope.message = "Updated Status Successfully";
                    }
                  })
              //  alert("Updated Status Successfully");
            }
            else {
                var loginAlert = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/html/templates/dashboardwarning.html',
                    windowClass: 'show',
                    backdropClass: 'static',
                    keyboard: false,
                    controller: function ($scope, $uibModalInstance) {
                      $scope.message = "Status updated failed, try again ";
                    }
                  })
               // alert("Status updated failed, try again ");

            }

        })

        console.log("<--updateUserStatus");
    }

    $scope.viewUser = function (id, loginT) {
        console.log("viewUser-->");
        $state.go('dashboard.viewUser', { 'id': id, 'loginType': loginT });
    }

    console.log("<--viewUser");
})