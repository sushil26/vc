careatorApp.controller('organizationSettingCtrl', function ($scope,  $rootScope, $state, careatorHttpFactory) {
    console.log("organizationSettingCtrl==>");
    $scope.propertyJson = $rootScope.propertyJson;
    console.log("$state.params.id: "+$state.params.id);
    var id = $state.params.id;
    $scope.getOrg_admin_byOrgId = function (id) {
        console.log("getOrg_admin_byOrgId-->");
        api = $scope.propertyJson.C_getOrg_admin_byOrgId+"/"+id;
        console.log("api: " + api);

        careatorHttpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            if (checkStatus) {
                console.log("data.data.data: " + JSON.stringify(data.data.data));
                console.log("data.data.message: " + data.data.message);
                $scope.orgDetails = data.data.data;
                $scope.dor = new Date($scope.orgDetails.dor);
            }
            else {
                console.log("data.data.message: " + data.data.message);
            }
        })
    }
    $scope.getOrg_admin_byOrgId(id);


    $scope.updateBasicInfo = function () {
        console.log("updateBasicInfo-->");
        var api = $scope.propertyJson.C_orgEditById +"/"+ id;
        console.log("api: " + api);
  
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
            console.log("obj: "+JSON.stringify(obj));
      
        careatorHttpFactory.post(api, obj).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                console.log(data.data.message);
                $state.go("Cdashboard.organizationListCtrl")
            }
            else {
                console.log("Sorry: " + data.data.message);
            }
        })
    }



})