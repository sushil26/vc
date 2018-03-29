app.controller('userAuthCtrl', function ($scope, $window, httpFactory) {
    console.log("userAuthCtrl==>: " + localStorage.getItem("userData"));

    if(localStorage.getItem("loginType")=='admin'){
        console.log("loginType: "+localStorage.getItem("loginType"));
        document.getElementById('userAuth').style.display="none";
         $scope.userLoginType='admin';
    }
    else{
        window.location.href="https://vc4all.in";
    }
    

    $scope.getUser = function () {
        console.log("getUser-->");
        var api = "https://vc4all.in/vc/getUserData";
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
    $scope.updateUserStatus = function (id, status, index) {
        console.log("updateUserStatus-->");
        var api = "https://vc4all.in/vc/updateUserStatus";
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
        var api = "https://vc4all.in/vc/deleteUser";
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


})