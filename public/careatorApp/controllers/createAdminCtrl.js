careatorApp.controller('createAdminCtrl', function ($scope, $rootScope, $state, careatorHttpFactory, SweetAlert) {
    console.log("createAdminCtrl==>");
    $scope.propertyJson = $rootScope.propertyJson;
    $scope.createAdmin = function () {
        console.log("createAdmin-->");

        var obj = {
            "organizationName": $scope.organizationName,
            "organizationDomain": $scope.organizationDomain,
            "dor": $scope.dor,
            "registrationRegNumber": $scope.registrationRegNumber,
            "email": $scope.adminEmail,
            "mobNumber": $scope.mobNumber,
            "streetName": $scope.streetName,
            "city": $scope.city,
            "state": $scope.state,
            "pinCode": $scope.pinCode,
            "country": $scope.country,
            "firstName": $scope.adminFirstName,
            "lastName": $scope.adminLastName,
            "pswd": $scope.adminPassword,
        }
        console.log("obj: " + JSON.stringify(obj));

        api = $scope.propertyJson.C_adminCreate
        console.log("api: " + api);

        careatorHttpFactory.post(api, obj).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            if (checkStatus) {
                console.log("data.data.data: " + JSON.stringify(data.data.data));
                console.log("data.data.message: " + data.data.message);
            }
            else {
                console.log("data.data.message: " + data.data.message);
            }
        })
    }

})