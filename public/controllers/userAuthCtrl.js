app.controller('userAuthCtrl', function ($scope, $window, httpFactory) {
    console.log("userAuthCtrl==>: " + localStorage.getItem("userData"));



    $scope.getUser = function () {
        console.log("getUser-->");
        var api = "https://norecruits.com/vc/getUserData";
        //var api = "http://localhost:5000/vc/getUserData";

        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.userData = data.data.data;
                console.log(" obj" + JSON.stringify($scope.userData))

            }
            else {
                //alert("Event get Failed");

            }

        })
        console.log("<--getUser");
    }

    $scope.getUser();

    $scope.getStudentList = function () {
        console.log("getStudentList-->");
        var api = "https://norecruits.com/vc/getStudData";
        //var api = "http://localhost:5000/vc/getUserData";

        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.studData = data.data.data;
                console.log("studData" + JSON.stringify($scope.studData))

            }
            else {
                //alert("Event get Failed");

            }

        })
        console.log("<--getStudentList");
    }
    $scope.getStudentList();

    $scope.updateUserStatus = function (id, status, index) {
        console.log("updateUserStatus-->");
        var api = "https://norecruits.com/vc/updateUserStatus";
        //var api = "http://localhost:5000/vc/updateUserStatus";

        var obj = {
            "id": id,
            "status": status
        }

        httpFactory.post(api, obj).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.userData[index].status = status;
                alert("Updated Status Successfully");

            }
            else {
                alert("Status updated failed, try again ");

            }

        })

        console.log("<--updateUserStatus");
    }
    $scope.deleteUser = function (id, index) {
        console.log("deleteUser-->");
        var api = "https://norecruits.com/vc/deleteUser";
        //var api = "http://localhost:5000/vc/updateUserStatus";

        var obj = {
            "id": id
        }

        httpFactory.post(api, obj).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                // $scope.userData = data.data.data;
                console.log(" obj" + JSON.stringify($scope.userData))
                $scope.userData.splice(index, 1);
                alert("Deleted User Successfully, This User can't login now");
            }
            else {
                alert("Status updated failed, try again ");

            }

        })


        console.log("<--deleteUser");
    }

    $scope.updateStudStatus = function (id, status, index) {
        console.log("updateUserStatus-->");
        var api = "https://norecruits.com/vc/updateStudStatus";
        //var api = "http://localhost:5000/vc/updateUserStatus";

        var obj = {
            "id": id,
            "status": status
        }

        httpFactory.post(api, obj).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.studData[index].status = status;
                alert("Updated Status Successfully");

            }
            else {
                alert("Status updated failed, try again ");

            }

        })

        console.log("<--updateUserStatus");
    }
    $scope.deleteStud = function (id, index) {
        console.log("deleteUser-->");
        var api = "https://norecruits.com/vc/deleteStud";
        //var api = "http://localhost:5000/vc/updateUserStatus";

        var obj = {
            "id": id
        }

        httpFactory.post(api, obj).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                // $scope.userData = data.data.data;
                console.log(" obj" + JSON.stringify($scope.userData))
                $scope.studData.splice(index, 1);
                alert("Deleted User Successfully, This User can't login now");
            }
            else {
                alert("Status updated failed, try again ");

            }

        })


        console.log("<--deleteUser");
    }
    $scope.tableForTimes = function (id) {
        $('#myModalt').modal('show');
        console.log("timeTable-->");
        $scope.getUserData = $scope.userData[id];
        console.log("$scope.getUserData: " + JSON.stringify($scope.getUserData));
        console.log("<--timeTable");
    }

})