app.controller('userAuthCtrl', function ($scope, $rootScope, $state, $window, httpFactory,$uibModal) {
    console.log("userAuthCtrl==>: " + localStorage.getItem("userData"));
    $scope.propertyJson = $rootScope.propertyJson;

    $scope.viewUser = function (id, loginT) {
        console.log("viewUser-->");
        console.log("id: " + id + " loginT: " + loginT);
        $state.go('dashboard.viewUser', {
            'id': id,
            'loginType': loginT
        });
    }
    $scope.getUser = function () {
        console.log("getUser-->");
        var api = $scope.propertyJson.VC_getUserData;
        //var api = "http://localhost:5000/vc/getUserData";

        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.userData = data.data.data;
                console.log(" obj" + JSON.stringify($scope.userData))

            } else {
                //alert("Event get Failed");

            }

        })
        console.log("<--getUser");
    }

    $scope.getUser();

    $scope.getStudentList = function () {
        console.log("getStudentList-->");
        var api = $scope.propertyJson.VC_getStudData;
        //var api = "http://localhost:5000/vc/getUserData";

        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.studData = data.data.data;
                console.log("studData" + JSON.stringify($scope.studData))

            } else {
                //alert("Event get Failed");

            }

        })
        console.log("<--getStudentList");
    }
    $scope.getStudentList();

    $scope.updateUserStatus = function (id, status, index) {
        console.log("updateUserStatus-->");
        var api = $scope.propertyJson.VC_updateUserStatus;
        //var api = "http://localhost:5000/vc/updateUserStatus";
        var obj = {
            "id": id,
            "status": status
        }
        httpFactory.post(api, obj).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.userData[index].status = status;
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

            } else {
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
    $scope.deleteUser = function (id, index) {
        console.log("deleteUser-->");
        var api = $scope.propertyJson.VC_deleteUser;
        //var api = "http://localhost:5000/vc/updateUserStatus";
        var obj = {
            "id": id
        }
        httpFactory.post(api, obj).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                // $scope.userData = data.data.data;
                console.log(" obj" + JSON.stringify($scope.userData))
                $scope.userData.splice(index, 1);
                var loginAlert = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/html/templates/dashboardsuccess.html',
                    windowClass: 'show',
                    backdropClass: 'static',
                    keyboard: false,
                    controller: function ($scope, $uibModalInstance) {
                        $scope.message = "Deleted User Successfully, This User can't login now";
                    }
                })
               // alert("Deleted User Successfully, This User can't login now");
            } else {
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


        console.log("<--deleteUser");
    }

    $scope.updateStudStatus = function (id, status, index) {
        console.log("updateUserStatus-->");
        var api = $scope.propertyJson.VC_updateStudStatus;
        //var api = "http://localhost:5000/vc/updateUserStatus";

        var obj = {
            "id": id,
            "status": status
        }

        httpFactory.post(api, obj).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.studData[index].status = status;
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
                //alert("Updated Status Successfully");

            } else {
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
    $scope.deleteStud = function (id, index) {
        console.log("deleteUser-->");
        var api = $scope.propertyJson.VC_deleteStud;
        //var api = "http://localhost:5000/vc/updateUserStatus";
        var obj = {
            "id": id
        }
        httpFactory.post(api, obj).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                // $scope.userData = data.data.data;
                console.log(" obj" + JSON.stringify($scope.userData))
                $scope.studData.splice(index, 1);
                var loginAlert = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/html/templates/dashboardsuccess.html',
                    windowClass: 'show',
                    backdropClass: 'static',
                    keyboard: false,
                    controller: function ($scope, $uibModalInstance) {
                        $scope.message = "Deleted User Successfully, This User can't login now";
                    }
                })
               // alert("Deleted User Successfully, This User can't login now");
            } else {
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


        console.log("<--deleteUser");
    }
    $scope.tableForTimes = function (id) {
        $('#myModalt').modal('show');
        console.log("timeTable-->");
        $scope.getUserData = $scope.userData[id];
        console.log("$scope.getUserData: " + JSON.stringify($scope.getUserData));
        console.log("<--timeTable");
    }

})