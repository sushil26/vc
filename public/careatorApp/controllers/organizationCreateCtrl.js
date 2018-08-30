careatorApp.controller('organizationCreateCtrl', function ($scope, $rootScope, $state, careatorHttpFactory, SweetAlert) {
    console.log("organizationCreateCtrl==>");
    $scope.propertyJson = $rootScope.propertyJson;
    $scope.organizationCreate = function (formName) {
        console.log("organizationCreate-->");
        $scope.submitted=true; /* ### Note: Front end validation for check the form submission ### */
        if (formName.$valid) {

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

            api = $scope.propertyJson.C_organizationCreate
            console.log("api: " + api);

            careatorHttpFactory.post(api, obj).then(function (data) {
                console.log("data--" + JSON.stringify(data.data));
                var checkStatus = careatorHttpFactory.dataValidation(data);
                if (checkStatus) {
                    console.log("data.data.data: " + JSON.stringify(data.data.data));
                    console.log("data.data.message: " + data.data.message);
                    SweetAlert.swal({
                        title: "Successfully Created",
                        text: data.data.message,
                        type: "success"
                    });
                    $state.go("Cdashboard.organizationList");

                }
                else {
                    console.log("data.data.message: " + data.data.message);
                    SweetAlert.swal({
                        title: "Failed",
                        text: data.data.message,
                        type: "warning"
                    });
                }
            })
        }
        else{
            //alert("Fill all the fields");
            SweetAlert.swal({
                title: "Not Valied",
                text: "Fill all the required field",
                type: "info"
              });
        }
    }

})