app.controller('markViewWithConfId_Ctl', function ($scope, $rootScope, $state, $window, $uibModal, httpFactory, $compile, sessionAuthFactory) {
    console.log("markViewCtl==>");
    var id = $state.params.id;
    var schoolName = $state.params.schoolName;
    console.log("studSchoolId: "+id+" schoolName: "+schoolName);
    $scope.propertyJson = $rootScope.propertyJson;

    $scope.getMarks = function (id) {
        console.log("getMarks-->");
        var api = $scope.propertyJson.VC_getStudentAttendance + "/" + id;
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                var studData = data.data.data;
                $scope.mark = studData[0].mark;
                console.log("studData: " + JSON.stringify(studData));
                console.log("$scope.mark: " + JSON.stringify($scope.mark));
                console.log("$scope.mark.length: " + $scope.mark.length);
            }
            else {
                console.log("sorry");
            }
        })
        console.log("<--getMarks");
    }

    $scope.getMarks(id);

})