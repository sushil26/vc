careatorApp.controller('groupListCtrl', function ($scope, $state, $rootScope, $filter, $window, careatorHttpFactory) {
    console.log("groupListCtrl==>");
    $scope.getGroupList = function () {
        console.log("getGroupList-->");
        var api = "https://norecruits.com/careator_chatGroupList/careator_getChatGroupList";
        console.log("api: " + api);
        careatorHttpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.groupList = data.data.data;
                console.log("GroupList: " + JSON.stringify($scope.groupList));
                console.log(data.data.message);
            } else {
                console.log("Sorry");
                console.log(data.data.message);
            }
        })
        console.log("<--getGroupList");
    }

    $scope.getGroupList();

    $scope.statusChange = function (id, status) {
        console.log("statusChange-->");
        console.log("id: " + id + " status: " + status);
        var obj = {
            "id": id,
            "status": status
        }
        var api = "https://norecruits.com/careator/groupStatusChangeById";
        console.log("api: " + api);
        careatorHttpFactory.post(api, obj).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.getGroupList();
                console.log(data.data.message);
            } else {
                console.log("Sorry");
                console.log(data.data.message);
            }
        })
        console.log("<--statusChange");
    }
    /////////////////Redirect page with data (id)///////////////////////
    $scope.editGroup = function (index) {
        console.log("editGroup-->");
        console.log("$scope.groupList[index]: " + JSON.stringify($scope.groupList[index]));
        var data = $scope.groupList[index];
        $state.go("Cdashboard.editGroup", {
            "id": data._id
        });
    }


    ////////////////Delete User/////////////////////////
    $scope.deleteGroup = function (id) {
        console.log("deleteGroup-->");
        console.log("Obj ID  " + id);


        var r = confirm("Are You Sure To Delete ????");
        if (r == true) {
            var api = "https://norecruits.com/careator_groupDelete/groupDeleteById/" + id;
            console.log("api: " + api);
            careatorHttpFactory.get(api).then(function (data) {
                console.log("data--" + JSON.stringify(data.data));
                var checkStatus = careatorHttpFactory.dataValidation(data);
                console.log("data--" + JSON.stringify(data.data));
                if (checkStatus) {
                    console.log(data.data.message);
                    $scope.getGroupList();
                } else {
                    console.log("Sorry");
                    console.log(data.data.message);
                }
            })
            console.log("<--statusChange");
        } else {
            console.log("<-- you cancelled");
        }




    }


})