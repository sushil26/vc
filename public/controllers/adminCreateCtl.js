app.controller('adminCreateCtl', function ($scope, $rootScope, $filter, $window, httpFactory, sessionAuthFactory, $uibModal) {
    console.log("adminCreateCtl==>");
    $scope.propertyJson = $rootScope.propertyJson;
    $scope.file = {}; /* ### Note Upload file declaration ### */


    $scope.adminCreate = function () {
        console.log("adminCreate-->");
        if ($scope.filePath) {
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
                "logoPath": $scope.filePath
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

        }
        else {
            alert("upload file then click on save");
        }

        
        console.log("<--adminCreate");
    }

    $scope.schoolLogoStorage = function () {
        console.log("schoolLogoStorage-->");
        /* #####  Start Upload File ###### */
        console.log("$scope.file: " + $scope.file);
        console.log("$scope.file: " + $scope.file.upload);
        if ($scope.myImage.resBlob) {
            var uploadURL = $scope.propertyJson.VC_schoolLogo;
            console.log("uploadURL: " + uploadURL);
            console.log("$scope.file.upload from : alumRegCtr.js: " + $scope.file.upload);
            httpFactory.imageUpload(uploadURL, $scope.myImage.resBlob).then(function (data) {
                console.log("hello " + JSON.stringify(data));
                var checkStatus = httpFactory.dataValidation(data);
                console.log("checkStatus: " + checkStatus);
                console.log("data.data.success: " + data.data.success);
                if (checkStatus) {
                    console.log("$scope.photo" + JSON.stringify(data));
                    $scope.getUpdateofImage = data;
                    console.log("$scope.getUpdateofImage" + JSON.stringify($scope.getUpdateofImage));
                    $scope.message = data.data.message;
                    $scope.filePath = data.data.data.filePath;
                    console.log("$scope.filePath: " + $scope.filePath);
                    var loginAlert = $uibModal.open({
                        scope: $scope,
                        templateUrl: '/html/templates/dashboardsuccess.html',
                        windowClass: 'show',
                        backdropClass: 'static',
                        keyboard: false,
                        controller: function ($scope, $uibModalInstance) {
                            $scope.message = $scope.message 
                        }
                    })
                    // // console.log("JSON.stringify($scope.postJson): " + JSON.stringify(postJson));
                    // $scope.adminCreate();
                } else {
                    $scope.status = data.data.status;
                    $scope.message = data.data.message;
                    console.log("image is not uploaded");
                    var loginAlert = $uibModal.open({
                        scope: $scope,
                        templateUrl: '/html/templates/dashboardwarning.html',
                        windowClass: 'show',
                        backdropClass: 'static',
                        keyboard: false,
                        controller: function ($scope, $uibModalInstance) {
                            $scope.message = $scope.message 
                        }
                    })
                    // $scope.adminCreate();
                    // console.log("JSON.stringify($scope.postJson): " + JSON.stringify(postJson));
                    // $scope.savePost();
                }
            });
        }
        /* #####  End Upload File ###### */
        else {
            alert("logo is required");
        }
        console.log("<--schoolLogoStorage");
    }


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