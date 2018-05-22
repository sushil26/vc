app.controller('adminCreateCtl', function ($scope, $rootScope, $filter, $window, httpFactory, sessionAuthFactory, $uibModal) {
    console.log("adminCreateCtl==>");
    $scope.propertyJson = $rootScope.propertyJson;

    $scope.adminCreate = function () {
        console.log("adminCreate-->");
        var objJson = {
            "schoolName": $scope.schoolName,
            "schoolRegNumber": $scope.schoolRegNumber,
            "firstName": $scope.firstName,
            "lastName": $scope.lastName,
            "dor": $filter('date')($scope.dor, "d MMM  y"),
            "email": $scope.email,
            "mobNumber": $scope.mobNumber,
            "address": $scope.address,
            "streetName": $scope.streetName,
            "city": $scope.city,
            "state": $scope.state,
            "pinCode": $scope.pinCode,
            "country": $scope.country,
            "pswd": $scope.pswd
        }
        console.log("objJson: " + JSON.stringify(objJson));
        var api = $scope.propertyJson.VC_adminCreate;
        httpFactory.post(api, objJson).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                var loginAlert = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/html/templates/dashboardsuccess.html',
                    windowClass: 'show',
                    backdropClass: 'static',
                    keyboard: false,
                    controller: function ($scope, $uibModalInstance) {
                        $scope.message = data.data.message;
                    }
                })

                $scope.schoolName = "";
                $scope.schoolRegNumber = "";
                $scope.firstName = "";
                $scope.lastName = "";
                $scope.dor = "";
                $scope.email = "";
                $scope.mobNumber = "";
                $scope.address = "";
                $scope.streetName = "";
                $scope.city = "";
                $scope.state = "";
                $scope.pinCode = "";
                $scope.country = "";
                $scope.pswd = ""
                // alert(data.data.message);
            }
            else {
                var loginAlert = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/html/templates/dashboardwarning.html',
                    windowClass: 'show',
                    backdropClass: 'static',
                    keyboard: false,
                    controller: function ($scope, $uibModalInstance) {
                        $scope.message = data.data.message;
                    }
                })
                //   alert("Failed to create");
            }
        })
        console.log("<--adminCreate");
    }

    // $scope.userData = sessionAuthFactory.getAccess("userData");
    // $scope.loginType = $scope.userData.loginType;
    // $scope.userName = $scope.userData.userName;
})