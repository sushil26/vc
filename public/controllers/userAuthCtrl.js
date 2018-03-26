app.controller('userAuthCtrl', function ($scope, $window, httpFactory) {
    console.log("userAuthCtrl==>: " + localStorage.getItem("userData"));

    $scope.getUser = function () {
        console.log("getUser-->");
        var api = "https://vc4all.in/vc/getUserData";

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

    $scope.updateUserStatus = function(id){
        console.log("updateUserStatus-->");
        var api = "https://vc4all.in/vc/updateUserStatus";

        var obj = {
            "id":id,
            "status":"active"
        }

        httpFactory.post(api, obj).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.userData = data.data.data;
                console.log(" obj" + JSON.stringify($scope.userData))

            }
            else {
                alert("Status updated failed, try again ");

            }

        })

        console.log("<--updateUserStatus");
    }


})