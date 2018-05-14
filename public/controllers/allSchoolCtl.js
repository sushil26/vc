app.controller('allSchoolCtl', function ($scope, $state, $window, $uibModal, httpFactory, sessionAuthFactory) {
    console.log("allSchoolCtl==>");
    $scope.userData = sessionAuthFactory.getAccess("userData");
    console.log(" $scope.userData : " + JSON.stringify($scope.userData));

    $scope.getAllSchool = function () {
        console.log("getAllSchool-->");
        var api = "https://norecruits.com/vc/getAllSchool";
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.allSchool = data.data.data;
                console.log("getAllSchool: " + JSON.stringify($scope.allSchool));
                console.log(data.data.message);
            }
            else {
                console.log("Sorry");
            }
        })
        console.log("<--getAllSchool");
    }
    $scope.getAllSchool();

    $scope.viewUser = function (id, loginT) {
        console.log("viewUser-->");
        $state.go('dashboard.viewUser', { 'id': id, 'loginType': loginT });
        console.log("<--viewUser");
    }

    $scope.updateSchoolStatus = function (id, status, index) {
        console.log("updateUserStatus-->");
        var api = "https://norecruits.com/vc/updateSchoolStatus";
        //var api = "http://localhost:5000/vc/updateUserStatus";
        var obj = {
            "id": id,
            "status": status
        }
        httpFactory.post(api, obj).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.allSchool[index].status = status;

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
          
               // alert("Updated Status Successfully");
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
})