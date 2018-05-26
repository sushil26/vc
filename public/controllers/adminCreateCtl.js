app.controller('adminCreateCtl', function ($scope, $rootScope, $filter, $window, httpFactory, sessionAuthFactory, $uibModal) {
    console.log("adminCreateCtl==>");
    $scope.propertyJson = $rootScope.propertyJson;
    $scope.file = {};/* ### Note Upload file declaration ### */

    $scope.schoolLogoStorage = function () {
        console.log("schoolLogoStorage-->");
        /* #####  Start Upload File ###### */
        console.log("$scope.file: " + $scope.file);
        console.log("$scope.file: " + $scope.file.upload);
        //    if ($scope.file.upload) {
        var uploadURL = $scope.propertyJson.VC_schoolLogo;
        console.log("uploadURL: " + uploadURL);
        console.log("$scope.file.upload from : alumRegCtr.js: " + $scope.file.upload);
        httpFactory.imageUpload(uploadURL, $scope.file).then(function (data) {
            console.log("hello " + JSON.stringify(data));
            var checkStatus = httpFactory.dataValidation(data);
            console.log("checkStatus: " + checkStatus);
            console.log("data.data.success: " + data.data.success);
            if (checkStatus) {
                console.log("$scope.photo" + JSON.stringify(data));
                $scope.getUpdateofImage = data;
                console.log("$scope.getUpdateofImage" + JSON.stringify($scope.getUpdateofImage));
                $scope.message = data.data.message;
                $scope.filePath = data.data.fileFullPath;
                $scope.status = data.data.success;

                // // console.log("JSON.stringify($scope.postJson): " + JSON.stringify(postJson));
                $scope.adminCreate();
            } else {
                $scope.status = data.data.status;
                $scope.message = data.data.message;
                console.log("image is not uploaded");
                $scope.adminCreate();
                // console.log("JSON.stringify($scope.postJson): " + JSON.stringify(postJson));
                // $scope.savePost();

            }
        });
        //}
        /* #####  End Upload File ###### */
        // else{
        //     alert("logo is required");
        // }
        console.log("<--schoolLogoStorage");
    }

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
            "pswd": $scope.pswd,
        }
        if ($scope.filePath) {
            objJson.logoPath = $scope.filePath;
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
            } else {
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


    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#blah').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#imgInp").change(function () {
        readURL(this);
    });



    // $scope.userData = sessionAuthFactory.getAccess("userData");
    // $scope.loginType = $scope.userData.loginType;
    // $scope.userName = $scope.userData.userName;
})