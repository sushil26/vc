careatorApp.controller('profileCtrl', function ($scope, $state, careatorHttpFactory, careatorSessionAuth) {
    console.log("profileCtrl++++++>>>>>>");

    var userData = careatorSessionAuth.getAccess("userData");
    var id = userData.userId;
    $scope.file = {}; /* ### Note Upload file declaration ### */

    $scope.getChatGroupListById = function () {
        console.log("getAllEmployee-->: " + id);
        var api = "https://vc4all.in/careator_chatGroupList/careator_getChatGroupListById/" + id;
        console.log("api: " + api);
        careatorHttpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            if (checkStatus) {
                $scope.allGroup = data.data.data;
                console.log("allGroup: " + JSON.stringify($scope.allGroup));
                console.log(data.data.message);

            } else {
                console.log("Sorry");
                console.log(data.data.message);
            }
        })
        console.log("<--getAllEmployee");
    }

    $scope.getChatGroupListById();




    ///////upload from loacal//////////////

    $scope.schoolLogoStorage = function () {
        console.log("schoolLogoStorage-->");
        /* #####  Start Upload File ###### */
        console.log("$scope.file: " + $scope.file);
       // console.log("$scope.file: " + $scope.file.upload);
        if ($scope.myImage.resBlob) {
            console.log("condition satisfied-->");
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