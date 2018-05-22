app.controller('attendanceViewCtl', function ($scope, $rootScope, $window, httpFactory, $compile, $uibModal, sessionAuthFactory, moment, calendarConfig) {
    console.log("attendanceViewCtl==>");

    $scope.userData = sessionAuthFactory.getAccess();
    var schoolName = $scope.userData.schoolName;
    console.log("$scope.userData: " + JSON.stringify($scope.userData));
    $scope.propertyJson = $rootScope.propertyJson;

    $scope.getTeacherData = function () {
        console.log("getTeacherData-->");
        var id = $scope.userData.id;
        var api = $scope.propertyJson.VC_teacherDetail + "/" + id;
        //var api = "http://localhost:5000/vc/teacherDetail" + "/" + id;
        //var api = "http://localhost:5000/vc/eventGet";
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            // console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.teacherData = data.data.data;
                $scope.teacherPersonalData = data.data.data;
                console.log("teacherPersonalData: " + JSON.stringify($scope.teacherPersonalData));
            }
            else {
            }
        })
        console.log("<--getTeacherData");
    }

    $scope.getAttendance = function (id) {
        console.log("getAttendance-->");
        var api = $scope.propertyJson.VC_getStudentAttendance + "/" + id;
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                var studData = data.data.data;
                $scope.attendance = studData[0].attendance;
                console.log("studData: " + JSON.stringify(studData));
                console.log("$scope.attendance: " + JSON.stringify($scope.attendance));
                console.log("$scope.attendance.length: " + $scope.attendance.length);
                for (var x = 0; x < $scope.attendance.length; x++) {
                    console.log("$scope.attendance[x]: " + JSON.stringify($scope.attendance[x]));
                    var year = "2018";
                    var mon = $scope.attendance[x].month;
                    console.log("$scope.attendance[x].dateAttendance.length: " + $scope.attendance[x].dateAttendance.length);
                    for (var y = 0; y < $scope.attendance[x].dateAttendance.length; y++) {
                        console.log("$scope.attendance[x].dateAttendance[y]: " + JSON.stringify($scope.attendance[x].dateAttendance[y]));
                        var day = $scope.attendance[x].dateAttendance[y].date;
                        console.log("day: " + day + "month: " + mon + "year: " + year);
                        var resultDate = new Date(year + " " + mon + " " + day);
                        console.log("resultDate: " + resultDate);
                        console.log("moment().subtract(1, 'day').toDate(): " + moment().subtract(1, 'day').toDate());
                        var obj = {
                            'title': $scope.attendance[x].dateAttendance[y].status,
                            'startsAt': resultDate,
                            'endsAt': resultDate,
                            'draggable': true,
                            'resizable': true,
                            'incrementsBadgeTotal': false
                        }
                        if ($scope.attendance[x].dateAttendance[y].status == "P") {
                            obj.color = calendarConfig.colorTypes.info;
                        }
                        else if ($scope.attendance[x].dateAttendance[y].status == "L") {
                            obj.color = calendarConfig.colorTypes.warning;
                        }
                        else {
                            obj.color = calendarConfig.colorTypes.important;
                        }
                        console.log("obj: " + JSON.stringify(obj));
                        $scope.events.push(obj);

                    }
                }
                console.log("$scope.events: " + JSON.stringify($scope.events));
            }
            else {
                console.log("sorry");
            }
        })
        console.log("<--getStudentAttendance");
    }
    if ($scope.userData.loginType == 'teacher') {
        $scope.userLoginType = 'teacher';
        $scope.getTeacherData();
    }
    if ($scope.userData.loginType == 'studParent') {
        $scope.userLoginType = 'studParent';
        $scope.getAttendance($scope.userData.id);
    }
    $scope.getStudListForCS = function (css) {
        console.log("getStudListForCS-->");
        console.log("css" + css);
        console.log("JSON.css" + JSON.stringify(css));
        var clas = css.class;
        var section = css.section;
        $scope.studList = [];
        var api = $scope.propertyJson.VC_getStudListForCS + "/" + schoolName + "/" + clas + "/" + section;
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            //console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.studentList = data.data.data;
                console.log("studentList: " + JSON.stringify($scope.studentList));
                for (var x = 0; x < $scope.studentList.length; x++) {
                    $scope.studList.push({ "id": $scope.studentList[x]._id, "name": $scope.studentList[x].firstName, "studId": $scope.studentList[x].schoolId });
                }
                console.log(" $scope.studList.length: " + $scope.studList.length);
            }
            else {
                console.log("sorry");
            }
        })
        console.log("<--getStudListForCS");
    }

    var vm = this;
    $scope.calendarView = 'month';
    $scope.viewDate = moment().startOf('day').toDate();
    var originalFormat = calendarConfig.dateFormats.hour;
    calendarConfig.dateFormats.hour = 'HH:mm';
    var actions = [{
        // label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
        label: 'Re-Schedule',
        onClick: function (args) {
            //alert("Edit Event Comming Soon");
        }
    }]
    $scope.events = [];
    $scope.cellIsOpen = true;
    $scope.getStudentAttendance = function (cs) {
        console.log("getStudentAttendance-->");
        $scope.events = [];
        console.log("cs: " + JSON.stringify(cs));
        var id = cs.id;
        $scope.getAttendance(id);
    }
})