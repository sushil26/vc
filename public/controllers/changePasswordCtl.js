app.controller('changePasswordCtl', function ($scope, $rootScope, $filter, $window, httpFactory, sessionAuthFactory, $uibModal) {
    console.log("passwordChangeCtl==>");
    $scope.userData = sessionAuthFactory.getAccess();
    var schoolName = $scope.userData.schoolName;
    var id = $scope.userData.id;
    var loginType = $scope.userData.loginType;
    $scope.propertyJson = $rootScope.propertyJson;

    $scope.currentPswdCheck = function () {
        console.log("currentPswdCheck-->");
        var objJson = {
            "pswd": $scope.currentPswd
        }
        console.log("objJson: " + JSON.stringify(objJson));
        var api = $scope.propertyJson.VC_checkPassword + "/" + id + "/" + loginType;
        console.log("api: " + api);
        httpFactory.post(api, objJson).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.validationMsg = data.data.message;
                $scope.validationStatus = true;
            }
            else {
                $scope.validationMsg = data.data.message;
                $scope.validationStatus = false;
            }
        })
        console.log("<--currentPswdCheck");
    }
    $scope.passwordChange = function () {
        console.log("passwordChange-->");
        var objJson = {
            "currentPswd": $scope.currentPswd,
            "newPswd": $scope.newPswd
        }
        console.log("objJson: " + JSON.stringify(objJson));
        var api = $scope.propertyJson.VC_passwordUpdate + "/" + id + "/" + loginType;
        console.log("api: " + api);
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
            else {
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
    $scope.sendVideo = function () {
        console.log("getVideo-->");
        var api = 'record/getRecordVideo';
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            $scope.videoSrc = JSON.stringify(data.data.data);
            var video = document.getElementById('videoPlayer');
            video.src = 'data:video/webm;base64,'+data.data.data;
            console.log("$scope.videoSrc: "+JSON.stringify($scope.videoSrc));
            if (checkStatus) {
                // $scope.adminList = data.data.data;
                // console.log("adminList: " + JSON.stringify($scope.adminList));
                // console.log(data.data.message);
            }
            else {
                console.log("Sorry");
            }

        })
        console.log("<--getVideo");
    }
    $scope.sendVideo();

    // const VP = document.getElementById('videoPlayer')
    // const VPToggle = document.getElementById('toggleButton')

    // VPToggle.addEventListener('click', function () {
    //     if (VP.paused) VP.play()
    //     else VP.pause()
    // })

})