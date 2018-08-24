careatorApp.controller('createUsersCtrl', function ($scope, $rootScope, $state, careatorSessionAuth, careatorHttpFactory, SweetAlert) {
    console.log("createUsersCtrl==>");
    $scope.propertyJson = $rootScope.propertyJson;
    $scope.userData = careatorSessionAuth.getAccess("userData");
    console.log(" $scope.userData : " + JSON.stringify($scope.userData));
    var orgId = $scope.userData.orgId;

    $scope.uploadCareatorEmp = function (careatorEmp) {
        console.log("uploadCareatorEmp-->");

        var obj = {
            "file": careatorEmp
        }
        var api = "https://norecruits.com/careator/careatorMasterInsert/"+orgId;
        console.log("api: " + api);
        careatorHttpFactory.csvUpload(obj, api).then(function (data) {
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                console.log("checkStatus: " + checkStatus);
                // alert(data.data.message);
                $scope.notifyMsg = data.data.message;
                // $("#alertButton").trigger("click");
                SweetAlert.swal({
                    title: "Uploaded",
                    text: $scope.notifyMsg,
                    type: "success"
                });
                $state.go("Cdashboard.usersListCtrl");
            } else {
                console.log("checkStatus: " + checkStatus);
                $scope.notifyMsg = data.data.message;
                // $("#alertButton").trigger("click");
                SweetAlert.swal({
                    title: "Error",
                    text: $scope.notifyMsg,
                    type: "warning"
                });
                // alert(data.data.message);
            }
        })
        console.log("<--uploadCareatorEmp");
    }
    $scope.careatorEmp = function (fn, ln, empId, emailId, pswd, Designation, rights) {
        console.log("careatorEmp-->");
        console.log("name: " + name);
        var videoRights;
        var chatRights;
        if (rights == 'both') {
            videoRights = "yes";
            chatRights = "yes";
        } else if (rights == 'chat') {
            videoRights = "no";
            chatRights = "yes";
        } else if (rights == 'video') {
            videoRights = "yes";
            chatRights = "no";
        }
        var obj = {
            "firstName": fn,
            "lastName": ln,
            "empId": empId,
            "empEmail": emailId,
            "empPass": pswd,
            "Designation": Designation,
            "videoRights": videoRights,
            "chatRights": chatRights,
            "orgId": orgId
        }
        console.log("obj: " + JSON.stringify(obj));

        var api = "https://norecruits.com/careator/careatorSingleUserInsert";
        console.log("api: " + api);
        careatorHttpFactory.post(api, obj).then(function (data) {
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                console.log("checkStatus: " + checkStatus);
                // alert(data.data.message);
                $scope.notifyMsg = data.data.message;
                console.log(" $scope.notifyMsg: " + $scope.notifyMsg);
                // $("#alertButton").trigger("click");
                SweetAlert.swal({
                    title: "Craeted",
                    text: $scope.notifyMsg,
                    type: "success"
                });
                $state.go("Cdashboard.usersListCtrl");
            } else {
                console.log("checkStatus: " + checkStatus);
                $scope.notifyMsg = data.data.message;
                console.log(" $scope.notifyMsg: " + $scope.notifyMsg);
                // $("#alertButton").trigger("click");
                SweetAlert.swal({
                    title: "Error",
                    text: $scope.notifyMsg,
                    type: "warning"
                });
                // alert(data.data.message);
            }
        })
    }
});