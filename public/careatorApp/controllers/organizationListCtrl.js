careatorApp.controller('organizationListCtrl', function ($scope, $rootScope, $state, careatorHttpFactory, SweetAlert) {
    console.log("organizationListCtrl==>");
    $scope.propertyJson = $rootScope.propertyJson;
    $scope.getAllAdmin = function () {
        console.log("getAllSchool-->");
        api = $scope.propertyJson.C_getAllAdmin;
        console.log("api: " + api);

        careatorHttpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            if (checkStatus) {
                console.log("data.data.data: " + JSON.stringify(data.data.data));
                console.log("data.data.message: " + data.data.message);
                $scope.allorganizationList = data.data.data;
            }
            else {
                console.log("data.data.message: " + data.data.message);
            }
        })
    }
  //  $scope.getAllAdmin();

    $scope.C_getAllOrg = function () {
        console.log("-->");

        api = $scope.propertyJson.C_getAllOrg;
        console.log("api: " + api);

        careatorHttpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            if (checkStatus) {
                console.log("data.data.data: " + JSON.stringify(data.data.data));
                console.log("data.data.message: " + data.data.message);
                $scope.allOrgList = data.data.data;
            }
            else {
                console.log("data.data.message: " + data.data.message);
            }
        })
    }
    $scope.C_getAllOrg();
    $scope.updateOrganizationStatus = function (id, status, index) {
        console.log("updateOrganizationStatus-->");
        var api = $scope.propertyJson.C_updateOrgStatus;
        var obj = {
            "id": id,
            "status": status
        }
        careatorHttpFactory.post(api, obj).then(function (data) {
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.allOrgList[index].status = status;
                console.log("Updated Status Successfully");

            }
            else {
                console.log("Status updated failed, try again");
            }
        })
        console.log("<--updateOrganizationStatus");
    }


})
