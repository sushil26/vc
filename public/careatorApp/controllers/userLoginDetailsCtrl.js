careatorApp.controller('userLoginDetailsCtrl', function ($scope, $state, careatorHttpFactory, SweetAlert, careatorSessionAuth) {
    console.log("userLoginDetailsCtrl==>");
    $scope.userData = careatorSessionAuth.getAccess("userData");
    console.log(" $scope.userData : " + JSON.stringify($scope.userData));
    var orgId = $scope.userData.orgId;

    $scope.getAllEmployeeLoginDetails = function () {
        console.log("getAllEmployeeLoginDetails-->");
        var api = "https://norecruits.com/careator/careator_getAllEmpLoginDetails/" + orgId;
        console.log("api: " + api);
        careatorHttpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.allemployeeLoginDetails = data.data.data;
                console.log("allemployeeLoginDetails: " + JSON.stringify($scope.allemployeeLoginDetails));
                console.log(data.data.message);
            } else {
                console.log("Sorry");
                console.log(data.data.message);
            }
        })
        console.log("<--getAllEmployee");
    }

    $scope.getAllEmployeeLoginDetails();



    /////////serch///////////////////
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname; //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    /* ### Start: receive message from careator.js  ### */
    socket.on("comm_userLoginNotify", function (data) {
        console.log("****comm_userLoginNotify-->: " + JSON.stringify(data));
        if (orgId == data.orgId) {
            $scope.allemployeeLoginDetails.push(data);
        }

        else {

        }
    });
    socket.on("comm_userLogoutNotify", function (data) {
        console.log("****comm_userLogoutNotify-->: " + JSON.stringify(data));
        if (orgId == data.orgId) {
            console.log("same orgid");
            for(var x=0;x<$scope.allemployeeLoginDetails.length;x++)
            {
                console.log("for loop-->");
                console.log("$scope.allemployeeLoginDetails[x].sessionRandomId: "+$scope.allemployeeLoginDetails[x].sessionRandomId);
                console.log("data.sessionRandomId: "+data.sessionRandomId);
                if($scope.allemployeeLoginDetails[x].sessionRandomId == data.sessionRandomId)
                {
                    console.log("stated to update-->");;
                    $scope.allemployeeLoginDetails[x].logoutDate = data.logoutDate;
                    $scope.allemployeeLoginDetails[x].login = data.login;
                    $scope.allemployeeLoginDetails[x].logout = data.logout;
                    break;
                }

            }
        }
        else {

        }
    });
    /* ### End: receive message from careator.js  ### */

})