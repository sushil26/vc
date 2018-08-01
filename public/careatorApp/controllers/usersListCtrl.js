careatorApp.controller('usersListCtrl', function ($scope, $state, careatorHttpFactory) {
    console.log("usersListCtrl==>");
    $scope.getAllEmployee = function () {
        console.log("getAllEmployee-->");
        var api = "https://norecruits.com/careator/careator_getAllEmp";
        console.log("api: " + api);
        careatorHttpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.allemployee = data.data.data;
                console.log("allemployee: " + JSON.stringify($scope.allemployee));
                console.log(data.data.message);
            } else {
                console.log("Sorry");
                console.log(data.data.message);
            }
        })
        console.log("<--getAllEmployee");
    }

    $scope.getAllEmployee();

    $scope.statusChange = function (id, status, index) {
        console.log("statusChange-->");
        console.log("id: " + id + " status: " + status + " index: " + index);
        var obj = {
            "id": id,
            "status": status
        }
        var api = "https://norecruits.com/careator/statusChangeById";
        console.log("api: " + api);
        careatorHttpFactory.post(api, obj).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.allemployee[index].status = status
                console.log(data.data.message);
            } else {
                console.log("Sorry");
                console.log(data.data.message);
            }
        })
        console.log("<--statusChange");
    }

    $scope.editUser = function (index) {
        console.log("editUser-->");
        console.log("$scope.allemployee[index]: " + JSON.stringify($scope.allemployee[index]));
        var data = $scope.allemployee[index];
        $state.go("Cdashboard.editUser", {
            "id": data._id
        });
    }
    $scope.seeChat = function (id) {
        console.log("seeChat-->");
        $state.go('Cdashboard.chatHistory', {
            "id": id
        })
    }


    ////////////////Delete User/////////////////////////
    $scope.deleteUser = function (id) {
        $("#deleteConfirmationButton").trigger("click");

        console.log("deleteUser-->");
        console.log("Obj ID  " + id);
        $scope.userDelete = function () {
            var api = "https://norecruits.com/careator_userDelete/userDeleteById/" + id;
            careatorHttpFactory.get(api).then(function (data) {
                console.log("data--" + JSON.stringify(data.data));
                var checkStatus = careatorHttpFactory.dataValidation(data);
                console.log("data--" + JSON.stringify(data.data));
                if (checkStatus) {
                    console.log(data.data.message);
                    $scope.getAllEmployee();
                } else {
                    console.log("Sorry");
                    console.log(data.data.message);
                }
            })
            console.log("<--statusChange");
        }
    }

    $scope.resetLoginFlag = function (id) {
        $("#ResetConfirmationButton").trigger("click");
        console.log("deleteUser-->");
        console.log("Obj ID  " + id);
        $scope.userReset = function () {
            console.log("userReset-->");
            var api = "https://norecruits.com/careator_reset/resetLoginFlagsById/" + id;
            careatorHttpFactory.post(api).then(function (data) {
                console.log("data--" + JSON.stringify(data.data));
                var checkStatus = careatorHttpFactory.dataValidation(data);
                console.log("data--" + JSON.stringify(data.data));
                if (checkStatus) {
                    console.log(data.data.message);
                    $scope.getAllEmployee();
                } else {
                    console.log("Sorry");
                    console.log(data.data.message);
                }
            })
            console.log("<--statusChange");
        }
    }

    /////////serch///////////////////
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname; //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
})