careatorApp.controller('userLoginDetailsCtrl', function ($scope, $state, careatorHttpFactory, SweetAlert) {
    console.log("userLoginDetailsCtrl==>");

    $scope.getAllEmployeeLoginDetails = function () {
        console.log("getAllEmployeeLoginDetails-->");
        var api = "https://vc4all.in/careator/careator_getAllEmpLoginDetails";
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
})