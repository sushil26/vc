careatorApp.controller('profileCtrl', function ($scope, $state, careatorHttpFactory, careatorSessionAuth) {
    console.log("profileCtrl++++++>>>>>>");
    $scope.file = {}; /* ### Note Upload file declaration ### */
    var userData = careatorSessionAuth.getAccess("userData");
    console.log("userData: "+JSON.stringify(userData));
    var id = userData.userId;

    $scope.getUserDataById = function () {
        console.log("getUserDataById--> ");
        var api = "https://norecruits.com//careator_getUser/careator_getUserById/" + id;
        console.log("api: " + api);
        careatorHttpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            if (checkStatus) {
                var userDetails = data.data.data[0];
                $scope.userDetails = userDetails;
                console.log("$scope.userDetails: " + JSON.stringify($scope.userDetails));
                $scope.profilePicPath = $scope.userDetails.profilePicPath;
                console.log("$scope.profilePicPath: " + $scope.profilePicPath);
                console.log("data.data.message: " + data.data.message);
            } else {
                console.log("Sorry");
                console.log("data.data.message: " + data.data.message);
            }
        })
    }
    $scope.getUserDataById();


    // $scope.getChatGroupListById = function () {
    //     console.log("getAllEmployee-->: " + id);
    //     var api = "https://norecruits.com/careator_chatGroupList/careator_getChatGroupListById/" + id;
    //     console.log("api: " + api);
    //     careatorHttpFactory.get(api).then(function (data) {
    //         console.log("data--" + JSON.stringify(data.data));
    //         var checkStatus = careatorHttpFactory.dataValidation(data);
    //         if (checkStatus) {
    //             $scope.allGroup = data.data.data;
    //             console.log("allGroup: " + JSON.stringify($scope.allGroup));
    //             console.log(data.data.message);

    //         } else {
    //             console.log("Sorry");
    //             console.log(data.data.message);
    //         }
    //     })
    //     console.log("<--getAllEmployee");
    // }

    // $scope.getChatGroupListById();




    ///////upload from loacal//////////////

    $scope.schoolLogoStorage = function () {
        $("#uploadlocal").css({
            "display": "none"
        });
        console.log("schoolLogoStorage-->");
        /* #####  Start Upload File ###### */
        console.log("$scope.file: " + $scope.file);
        // console.log("$scope.file: " + $scope.file.upload);
        if ($scope.myImage.resBlob) {
            console.log("condition satisfied-->");
            var uploadURL = "https://norecruits.com/careator_comm_profileImgUpload/comm_profileImgUpload";
            console.log("uploadURL: " + uploadURL);
            console.log("$scope.file.upload from : alumRegCtr.js: " + $scope.file.upload);
            careatorHttpFactory.imageUpload(uploadURL, $scope.myImage.resBlob).then(function (data) {
                console.log("hello " + JSON.stringify(data));
                var checkStatus = careatorHttpFactory.dataValidation(data);
                console.log("checkStatus: " + checkStatus);
                console.log("data.data.success: " + data.data.success);
                if (checkStatus) {
                    console.log("$scope.photo" + JSON.stringify(data));
                    $scope.getUpdateofImage = data;
                    console.log("$scope.getUpdateofImage" + JSON.stringify($scope.getUpdateofImage));
                    $scope.message = data.data.message;
                    $scope.filePath = data.data.data.filePath;
                    console.log("$scope.filePath: " + $scope.filePath);
                    $scope.profilePicUpdate();

                    // // console.log("JSON.stringify($scope.postJson): " + JSON.stringify(postJson));
                    // $scope.organizationCreate();
                } else {
                    $scope.status = data.data.status;
                    $scope.message = data.data.message;
                    console.log("image is not uploaded");

                    // $scope.organizationCreate();
                    // console.log("JSON.stringify($scope.postJson): " + JSON.stringify(postJson));
                    // $scope.savePost();
                }
            });
        }
        /* #####  End Upload File ###### */
        else {
            alert("Logo is required");
        }
        console.log("<--schoolLogoStorage");
    }


    $scope.profilePicUpdate = function () {
        console.log("profilePicUpdate--->");
        var obj = {
            "profilePicPath": $scope.filePath
        }
        var api = "https://norecruits.com/careator_comm_profileImgUpdateById/comm_profileImgUpdateById/" + id;
        console.log("api: " + api);
        careatorHttpFactory.post(api, obj).then(function (data) {
            var checkStatus = careatorHttpFactory.dataValidation(data);
            //console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                console.log("data" + JSON.stringify(data.data))
                console.log("data.data.message: " + data.data.message);
                //$scope.eventGet();
                $scope.getUserDataById();

            } else {
                console.log("Sorry");
                console.log("data.data.message: " + data.data.message);
            }
        })
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

    $scope.profilpic = function () {

        $("#uploadlocal").css({
            "display": "block"
        });
    }
    $scope.Cancel = function () {
        $("#uploadlocal").css({
            "display": "none"
        });

    }


})