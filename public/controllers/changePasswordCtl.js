app.controller('changePasswordCtl', function ($scope, $filter, $window, httpFactory, sessionAuthFactory,$uibModal) {
    console.log("passwordChangeCtl==>");
    $scope.userData = sessionAuthFactory.getAccess();
    var schoolName = $scope.userData.schoolName;
    var id = $scope.userData.id;
    var loginType = $scope.userData.loginType;

    $scope.currentPswdCheck = function(){
        console.log("currentPswdCheck-->");
        var objJson = {
            "pswd":$scope.currentPswd
        }
        console.log("objJson: "+JSON.stringify(objJson));
        var api = "https://norecruits.com/vc/checkPassword/"+id+"/"+loginType;
        console.log("api: "+api);
        httpFactory.post(api, objJson).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.validationMsg = data.data.message;
                $scope.validationStatus = true;
                // alert(data.data.message);
            }
            else{
               $scope.validationMsg = data.data.message;
               $scope.validationStatus = false;
             //   alert("Failed to create");
            }
        })
        console.log("<--currentPswdCheck");
    }
    $scope.passwordChange = function () {
        console.log("passwordChange-->");
        var objJson = {
            "currentPswd":$scope.currentPswd,
            "newPswd":$scope.newPswd
        }
        console.log("objJson: " + JSON.stringify(objJson));
        var api = "https://norecruits.com/vc/passwordUpdate/"+id+"/"+loginType;
        console.log("api: "+api);
        httpFactory.post(api, objJson).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                // var loginAlert = $uibModal.open({
                //     scope: $scope,
                //     templateUrl: '/html/templates/dashboardsuccess.html',
                //     windowClass: 'show',
                //     backdropClass: 'static',
                //     keyboard: false,
                //     controller: function ($scope, $uibModalInstance) {
                //       $scope.message = data.data.message;
                //     }
                //   })
                alert(data.data.message);
            }
            else{
                // var loginAlert = $uibModal.open({
                //     scope: $scope,
                //     templateUrl: '/html/templates/dashboardwarning.html',
                //     windowClass: 'show',
                //     backdropClass: 'static',
                //     keyboard: false,
                //     controller: function ($scope, $uibModalInstance) {
                //       $scope.message = "Failed to create";
                //     }
                //   })
              alert(data.data.message);
            }
        })
        console.log("<--passwordChange");
    }
})