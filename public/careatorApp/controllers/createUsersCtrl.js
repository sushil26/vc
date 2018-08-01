careatorApp.controller('createUsersCtrl', function ($scope, $rootScope, $state, careatorHttpFactory) {
    console.log("createUsersCtrl==>");
    $scope.propertyJson = $rootScope.propertyJson;
    $scope.uploadCareatorEmp = function (careatorEmp) {
        console.log("uploadCareatorEmp-->");

        var obj = {
            "file": careatorEmp
        }
        var api = "https://norecruits.com/careator/careatorMasterInsert";
        console.log("api: " + api);
        careatorHttpFactory.csvUpload(obj, api).then(function (data) {
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                console.log("checkStatus: " + checkStatus);
                // alert(data.data.message);
                $scope.notifyMsg = data.data.message;
                $("#alertButton").trigger("click");
                $state.go("Cdashboard.usersListCtrl");
            } else {
                console.log("checkStatus: " + checkStatus);
                $scope.notifyMsg = data.data.message;
                $("#alertButton").trigger("click");
                // alert(data.data.message);
            }
        })
        console.log("<--uploadCareatorEmp");
    }
    $scope.careatorEmp = function (name, empId, emailId, pswd,Designation,rights) {
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
            "userName": name,
            "empId": empId,
            "empEmail": emailId,
            "empPass": pswd,
            "Designation":Designation,
            "videoRights": videoRights,
            "chatRights": chatRights
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
                console.log(" $scope.notifyMsg: "+  $scope.notifyMsg);
                $("#alertButton").trigger("click");
                $state.go("Cdashboard.usersListCtrl");
            } else {
                console.log("checkStatus: " + checkStatus);
                $scope.notifyMsg = data.data.message;
                console.log(" $scope.notifyMsg: "+  $scope.notifyMsg);
                $("#alertButton").trigger("click");
                // alert(data.data.message);
            }
        })
    }
});