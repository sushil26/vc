app.controller('dashboardPersonalDetailController', function ($scope, $window, httpFactory) {
    console.log("dashboardController==>");

    var id = localStorage.getItem("id");
    $scope.loginType = localStorage.getItem("loginType");
    $scope.userName = localStorage.getItem("userName");

    $scope.getTeacherDetails = function (id) {
        console.log("getTeacherData-->");
        var id = localStorage.getItem("id");

        var api = "https://norecruits.com/vc/teacherDetail" + "/" + id;
        //var api = "http://localhost:5000/vc/teacherDetail" + "/" + id;
        //var api = "http://localhost:5000/vc/eventGet";
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            //console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.userData = data.data.data;
                console.log("teacherData: " + JSON.stringify($scope.userData));
                //   $scope.css = $scope.teacherData[0].css;
                //   console.log("$scope.css: " + JSON.stringify($scope.css));
            }
            else {

            }

        })
        console.log("<--getTeacherData");
    }

    $scope.getStudentDetails = function (id) {
        console.log("getTeacherData-->");
        var id = localStorage.getItem("id");
        var api = "https://norecruits.com/vc/studentDetail" + "/" + id;
        console.log("api: " + api);
        $scope.teacherList = [];
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            //console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.userData = data.data.data;
                console.log("studentData: " + JSON.stringify($scope.userData));
            }
            else {

            }
        })
    }

    if (localStorage.getItem("loginType") == 'teacher') {
        $scope.getTeacherDetails(id);
        console.log("teacher login");

    }
    else if (localStorage.getItem("loginType") == 'studParent') {
        $scope.getStudentDetails(id);
        console.log("studParent login");
    }
    else if (localStorage.getItem("loginType") == 'admin') {
        console.log("admin Login");
    }





})