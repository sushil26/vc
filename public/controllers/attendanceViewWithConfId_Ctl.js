app.controller('attendanceViewWithConfId_Ctl', function ($scope, $rootScope, $state, $window, httpFactory, $compile, $uibModal,sessionAuthFactory, moment, calendarConfig) {
    console.log("markViewCtl==>");
    var id = $state.params.id;
    var schoolName = $state.params.schoolName;
    console.log("studSchoolId: "+id+" schoolName: "+schoolName);
    $scope.propertyJson = $rootScope.propertyJson;

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

    $scope.getAttendance(id);

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

})