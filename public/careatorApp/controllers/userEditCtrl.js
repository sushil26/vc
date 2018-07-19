careatorApp.controller('editUserCtrl', function ($scope, $state, $rootScope, $filter, $window, careatorHttpFactory) {
    console.log("editUserCtrl==>");
    console.log("id: " + $state.params.id);
    var id = $state.params.id;

    $scope.getUser = function () {
        console.log("getUser---->>>");
        var api = "https://norecruits.com/careator_getUser/careator_getUserById/" + id;
        console.log("api: " + api);
        careatorHttpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            if (checkStatus) {
                $scope.userData = data.data.data;
                $scope.userDataRights = {
                    "videoRights": $scope.userData[0].videoRights,
                    "chatRights": $scope.userData[0].chatRights
                }
                console.log("$scope.userDataRights.videoRights: " + $scope.userDataRights.videoRights);
                console.log("$scope.userDataRights: " + JSON.stringify($scope.userDataRights));
                console.log("userData: " + JSON.stringify($scope.userData));
                console.log(data.data.message);
            }
            else {
                console.log("Sorry");
                console.log(data.data.message);
            }
        })


        console.log("<--getAllEmployee");
    }
    $scope.getUser();

    $scope.updateUser = function () {
        console.log("updateUser-->");
        console.log("$scope.userDataRights.videoRights: " + $scope.userDataRights.videoRights);
        console.log("$scope.userDataRights.chatRights: " + $scope.userDataRights.chatRights);
        var api = "https://norecruits.com/careator/userEditById/" + id;
        console.log("api: " + api);
        var obj = {
            "userName": $scope.userName,
            "userEmail": $scope.userEmail,
            "videoRights": $scope.userDataRights.videoRights,
            "chatRights": $scope.userDataRights.chatRights,
            "empId": $scope.empId,
        }
        console.log("userName: " + $scope.userName + " userEmail: " + $scope.userEmail);
        // console.log("ur: "+JSON.stringify(ur));
        console.log("userDataRights: " + JSON.stringify($scope.userDataRights));
        console.log("obj: " + JSON.stringify(obj));
        careatorHttpFactory.post(api, obj).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                console.log(data.data.message);
                $state.go("Cdashboard.usersListCtrl")
            }
            else {
                console.log("Sorry: " + data.data.message);
            }
        })
    }




})