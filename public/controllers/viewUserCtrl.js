app.controller('viewUserController', function ($scope, $state, $window, httpFactory,$uibModal) {
    console.log("viewUserController==>");
    var id = $state.params.id;
    var loginT = $state.params.loginType;
    $scope.getTeacherDetails = function (id) {
        console.log("getTeacherData-->");
        if (loginT == 'teacher') {
            var api = "https://vc4all.in/vc/teacherDetail" + "/" + id;
        }
        else if(loginT == 'school')
        {
            var api = "https://vc4all.in/vc/getSchoolDataById" + "/" + id;
           
        }
        else {
            var api = "https://vc4all.in/vc/studentDetail" + "/" + id;
        }
        //var api = "http://localhost:5000/vc/teacherDetail" + "/" + id;
        //var api = "http://localhost:5000/vc/eventGet";
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            //console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.userDetail = data.data.data;
                console.log("userDetail: " + JSON.stringify($scope.userDetail));
                console.log("$scope.userDetail.schoolRegNumber: "+$scope.userDetail.schoolRegNumber);
                if($scope.userDetail[0].schoolRegNumber!=undefined){
                    $scope.loginType = "school";
                }
                else
                {
                    $scope.loginType = $scope.userDetail[0].loginType;
                }
                
               
                //   $scope.css = $scope.teacherData[0].css;
                //   console.log("$scope.css: " + JSON.stringify($scope.css));
            }
            else {

            }

        })
        console.log("<--getTeacherData");
    }
    $scope.getTeacherDetails(id);

})