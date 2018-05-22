app.controller('allAdminCtl', function ($scope, $rootScope, $state, $uibModal, $window, httpFactory, sessionAuthFactory) {
    console.log("allAdminCtl==>");
    $scope.userData = sessionAuthFactory.getAccess("userData");
    console.log(" $scope.userData : " + JSON.stringify($scope.userData));
    $scope.propertyJson = $rootScope.propertyJson;

    $scope.getAllAdmin = function () {
        console.log("getAllAdmin-->");
        var api = $scope.propertyJson.VC_getAllAdmin;
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.adminList = data.data.data;
                console.log("adminList: " + JSON.stringify($scope.adminList));

                console.log(data.data.message);
            }
            else {
                console.log("Sorry");
            }

        })

        console.log("<--getAllAdmin");
    }
    $scope.getAllAdmin();
    $scope.updateAdminStatus = function (id, status, index) {
        console.log("updateUserStatus-->");
        var api = $scope.propertyJson.VC_updateUserStatus;
        var obj = {
            "id": id,
            "status": status
        }

        httpFactory.post(api, obj).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.adminList[index].status = status;
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
            }
            else {
                var loginAlert = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/html/templates/dashboardwarning.html',
                    windowClass: 'show',
                    backdropClass: 'static',
                    keyboard: false,
                    controller: function ($scope, $uibModalInstance) {
                        $scope.message = "Status updated failed, try again";
                    }
                })
            }
        })
        console.log("<--updateUserStatus");
    }
    $scope.viewUser = function (id, loginT) {
        console.log("viewUser-->");
        if (loginT == 'teacher') {
            $state.go('dashboard.viewUser', { 'id': id, 'loginType': loginT });
        }
        else {
            $state.go('dashboard.viewUser', { 'id': id, 'loginType': loginT });
        }
        console.log("<--viewUser");
    }
})