app.controller('allAdminCtl', function ($scope, $state, $uibModal,$window, httpFactory, sessionAuthFactory) {
    console.log("allAdminCtl==>");
    $scope.userData = sessionAuthFactory.getAccess("userData");
    console.log(" $scope.userData : " + JSON.stringify($scope.userData));

    $scope.getAllAdmin = function () {
        console.log("getAllAdmin-->");
        var api = "https://norecruits.com/vc/getAllAdmin";
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.adminList = data.data.data;
                console.log("adminList: " + JSON.stringify($scope.adminList));

                console.log(data.data.message);
            }
            else {
                console.log("Sorry");
            }

        })

        console.log("<--getAllAdmin");
    }
    $scope.getAllAdmin();
    $scope.updateAdminStatus = function (id, status, index) {
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
                $scope.adminList[index].status = status;
                var loginAlert = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/html/templates/dashboardsuccess.html',
                    windowClass: 'show',
                    backdropClass: 'static',
                    keyboard: false,
                    controller: function ($scope, $uibModalInstance) {
                      $scope.message = "Updated Status Successfully";
                    }
                  })

               // alert("Updated Status Successfully");
            }
            else {
                var loginAlert = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/html/templates/dashboardwarning.html',
                    windowClass: 'show',
                    backdropClass: 'static',
                    keyboard: false,
                    controller: function ($scope, $uibModalInstance) {
                      $scope.message = "Status updated failed, try again";
                    }
                  })

               // alert("Status updated failed, try again ");

            }

        })

        console.log("<--updateUserStatus");
    }

    $scope.viewUser = function(id,loginT){
        console.log("viewUser-->");
        if(loginT=='teacher')
        {
            $state.go('dashboard.viewUser', { 'id': id, 'loginType':loginT});
        }
        else{
            $state.go('dashboard.viewUser', { 'id': id, 'loginType':loginT});
        }
       
        console.log("<--viewUser");
    }
})