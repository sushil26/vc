app.controller('dashboardEditController', function ($scope, $rootScope, $window, httpFactory, sessionAuthFactory, $uibModal) {
    console.log("dashboardEditController==>");
    $scope.propertyJson = $rootScope.propertyJson;
    $scope.file = {};/* ### Note Upload file declaration ### */
    $scope.userData = sessionAuthFactory.getAccess();
    var schoolName = $scope.userData.schoolName;
    var id = $scope.userData.id;
    $scope.loginType = $scope.userData.loginType;
    $scope.propertyJson = $rootScope.propertyJson;
    // $scope.whosPic = ["student", "father", "mother"];

    $scope.getUserDetails = function (id) {
        console.log("getTeacherData-->");
        if ($scope.loginType == 'teacher' || $scope.loginType == 'admin' || $scope.loginType == 'vc4allAdmin') {
            var api = $scope.propertyJson.VC_teacherDetail + "/" + id;
        }
        else if ($scope.loginType == 'studParent') {
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
            }
            else {

            }

        })
        console.log("<--getTeacherData");
    }
    $scope.getUserDetails(id);

    $scope.schoolLogoStorage = function (f, r) {
        console.log("schoolLogoStorage-->");
        /* #####  Start Upload File ###### */
        // console.log("$scope.file: " + $scope.file);
        // console.log("$scope.file: " + $scope.file.upload);
        // $scope.file.upload = $scope.myCroppedImage;
        console.log("$scope.myImage.resBlob: " + $scope.myImage.resBlob);
        console.log("r: " + r);
        //    if ($scope.file.upload) {
        var uploadURL = $scope.propertyJson.VC_profilePicupload;
        console.log("uploadURL: " + uploadURL);
        console.log("$scope.file.upload from : alumRegCtr.js: " + $scope.file.upload);
        httpFactory.imageUpload(uploadURL, $scope.myImage.resBlob).then(function (data) {
            console.log("hello " + JSON.stringify(data));
            var checkStatus = httpFactory.dataValidation(data);
            console.log("checkStatus: " + checkStatus);
            //console.log("data.data.success: " + data.data.success);
            if (checkStatus) {
                console.log("$scope.photo" + JSON.stringify(data));
                $scope.getUpdateofImage = data;
                console.log("$scope.getUpdateofImage" + JSON.stringify($scope.getUpdateofImage));
                //$scope.message = data.data.message;
                $scope.filePath = data.data.data.filePath;
                if (data.data.message == 'date stored successfully') {
                    $scope.profilePicUpdated();

                }
                alert(data.data.message);
            } else {
                $scope.status = data.data.status;
                $scope.message = data.data.message;
                alert(data.data.message);
                console.log("image is not uploaded");
            }
        });
        console.log("<--schoolLogoStorage");
    }

    $scope.profilePicUpdated = function () {
        console.log("profilePicUpdated-->");
        console.log("$scope.picType: " + $scope.picType);
        var obj;
        if ($scope.loginType == 'studParent') {
            if ($scope.picType == 'student') {
                obj = {
                    "profilePic_path": $scope.filePath,
                    "loginType": 'studParent'
                }
            }
            else if ($scope.picType == 'father') {
                obj = {
                    "father_profilePic_path": $scope.filePath,
                    "loginType": 'studParent'
                }
            }
            else if ($scope.picType == 'mother') {
                obj = {
                    "mother_profilePic_path": $scope.filePath,
                    "loginType": 'studParent'
                }
            }

        }
        else {
            obj = {
                "profilePic_path": $scope.filePath,
                "loginType": 'user'
            }
        }
        console.log("obj: " + obj);
        var api = $scope.propertyJson.VC_updateProfilePic + "/" + id;
        console.log("api: " + api);
        httpFactory.post(api, obj).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            //console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                console.log("data" + JSON.stringify(data.data))
                var loginAlert = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/html/templates/dashboardsuccess.html',
                    windowClass: 'show',
                    backdropClass: 'static',
                    keyboard: false,
                    controller: function ($scope, $uibModalInstance) {
                        $scope.message = "Successfully update";
                    }
                })
                $scope.userData[0].profilePic_path = $scope.filePath;
                $state.go('dashboard.personalDetail');
                //$scope.eventGet();
            }
            else {
                var loginAlert = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/html/templates/dashboardwarning.html',
                    windowClass: 'show',
                    backdropClass: 'static',
                    keyboard: false,
                    controller: function ($scope, $uibModalInstance) {
                        $scope.message = "Event Send Failed, try again ";
                    }
                })
                // alert("Event Send Failed");
            }
        })
        console.log("<--profilePicUpdated");
    }

    $scope.fileUploadClick = function (type) {
        console.log("fileUploadClick-->");
        $scope.picType = type;
        console.log("<--fileUploadClick");
    }

    // $scope.myImage = '';
    //$scope.myCroppedImage = '';
    $scope.myImage = {
        originalImage: '',
        croppedImage: ''
    }

    $scope.uploadFile = function (file) {
        if (file) {
            // ng-img-crop
            var imageReader = new FileReader();
            imageReader.onload = function (image) {
                $scope.$apply(function ($scope) {
                    $scope.myImage.originalImage = image.target.result;
                });
            };
            imageReader.readAsDataURL(file);
        }
    };
})