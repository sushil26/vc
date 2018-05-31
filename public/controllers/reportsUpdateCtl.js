app.controller('reportsUpdateCtl', function ($scope, $rootScope, $window, $filter, $state, httpFactory, $uibModal, sessionAuthFactory, moment, calendarConfig) {
  console.log("attendanceCtl==>");
  $scope.userData = sessionAuthFactory.getAccess("userData");
  var schoolName = $scope.userData.schoolName;
  $scope.propertyJson = $rootScope.propertyJson;
  console.log(" $scope.userData : " + JSON.stringify($scope.userData));
  $scope.file = {}; /* ### Note: Upload file declaration ### */
  $scope.uploadTypes = ["Teacher Details", "Student Details", "Time Table", "Attendance", "Mark Report", "Fee Report"];
  $scope.testTypes = ["AT", "UT", "MT", "TT", "AT"];
  $scope.feeTypes = ["AF", "BF", "MF", "Other"];
  $scope.attendanceTypes = ["Monthly", "Daily"];
  $scope.thirtyOne = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  $scope.thirty = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
  $scope.twentyEight = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
  //$scope.attendanceTypes = ["Monthly"];
  $scope.monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  $scope.events = [];

  $scope.reset = function () {
    console.log("reset-->");
    $scope.uploadReports = [{ uploadType: "", csSelect: "", ttSelect: "", uploadDoc: "" }];
  }

  $scope.getAllTeacherList = function () {
    var api = $scope.propertyJson.VC_getAllTeacherList + "/" + schoolName;
    console.log("api: " + api);
    httpFactory.get(api).then(function (data) {
      var checkStatus = httpFactory.dataValidation(data);
      console.log("data--" + JSON.stringify(data.data));
      if (checkStatus) {
        $scope.teacherList = data.data.data;
        console.log("teacherList: " + JSON.stringify($scope.teacherList));

      }
      else {
        console.log("sorry");
      }
    })
  }
  $scope.getAllTeacherList();
  $scope.getSchoolData = function () {
    console.log("getSchoolData-->");
    $scope.cssList = [];
    var api = $scope.propertyJson.VC_getSchoolData + "/" + schoolName;
    console.log("api: " + api);
    httpFactory.get(api).then(function (data) {
      console.log("data--" + JSON.stringify(data.data));
      var checkStatus = httpFactory.dataValidation(data);
      // console.log("checkStatus: "+checkStatus);
      // console.log("data--" + JSON.stringify(data.data));
      if (checkStatus) {
        var schoolData = data.data.data;
        $scope.cssList = schoolData.css;
        $scope.timeTable_timing = schoolData.timeTable_timing;
        console.log("schoolData: " + JSON.stringify(schoolData));
        console.log("cssList: " + JSON.stringify($scope.cssList));
        console.log("timeTable_timing: " + JSON.stringify($scope.timeTable_timing));
        if ($scope.cssList.length == 0) {
          console.log("message: " + data.data.message);
        }

        else {
          console.log("sorry");

          // for (var x = 0; x < $scope.cssList.length; x++) {
          //   $scope.class.push({ "id": $scope.studentList[x]._id, "name": $scope.studentList[x].studName, "studId": $scope.studentList[x].studId });

          // }
        }
      }
      else {
        console.log(data.data.message);
      }
    })
    console.log("<--getSchoolData");
  }
  $scope.getSchoolData();
  $scope.viewUser = function (id, loginT) {
    console.log("viewUser-->");
    $state.go('dashboard.viewUser', { 'id': id, 'loginType': loginT });
    console.log("<--viewUser");
  }
  $scope.attDailyDate = function (d) {
    console.log("attDailyDate-->");
    $scope.dailyMonth = $filter('date')(d, "MMM");
    $scope.dailyDate = $filter('date')(d, "d");
    console.log("<--attDailyDate");
  }
  $scope.sma = []; /* ### Note:sma-Subject Mark Attendant  */
  $scope.addSMA = function () {
    console.log("addSMA-->");
    $scope.sma.push({ subject: "", mark: "", attendance: "" });
    console.log("<--addSMA");
  };
  $scope.uploadReports = [{ uploadType: "", csSelect: "", ttSelect: "", uploadDoc: "" }]; /* ### Note:uploadReports  */
  $scope.addUploadReports = function () {
    console.log("addUploadReports-->");
    $scope.uploadReports.push({ uploadType: "", csSelect: "", ttSelect: "", uploadDoc: "" });
    console.log("<--addUploadReports");
  }
  $scope.markFileUpdate = function (file, date, testType, clas, section) {
    console.log("markFileUpdate-->");
    console.log("date: " + date + " testType: " + testType + " clas" + clas + " section: " + section);
    var obj = {
      "file": file,
    }
    if (clas && section && testType && date) {
      var api = $scope.propertyJson.VC_markUpdate + "/" + schoolName + "/" + clas + "/" + section + "/" + testType + "/" + date;
    }
    else {
      $uibModal.open({
        scope: $scope,
        templateUrl: '/html/templates/dashboardwarning.html',
        windowClass: 'show',
        backdropClass: 'static',
        keyboard: false,
        controller: function ($scope, $uibModalInstance) {
          $scope.message = "Class, Section, Test Type and Date are required"
        }
      })
    }
    console.log("api: " + api);
    if (api) {
      httpFactory.csvUpload(obj, api).then(function (data) {
        var checkStatus = httpFactory.dataValidation(data);
        console.log("data--" + JSON.stringify(data.data));
        if (checkStatus) {
          $uibModal.open({
            scope: $scope,
            templateUrl: '/html/templates/dashboardsuccess.html',
            windowClass: 'show',
            backdropClass: 'static',
            keyboard: false,
            controller: function ($scope, $uibModalInstance) {
              $scope.message = data.data.message
            }
          })
          // alert(data.data.message);
          //$scope.getAllTeacherList();
          // $scope.up.uploadType= '';
        }
        else {
          $uibModal.open({
            scope: $scope,
            templateUrl: '/html/templates/dashboardsuccess.html',
            windowClass: 'show',
            backdropClass: 'static',
            keyboard: false,
            controller: function ($scope, $uibModalInstance) {
              $scope.message = data.data.message
            }
          })
          //alert(data.data.message);
        }
      })
      $scope.reset();
    }
    console.log("<--markFileUpdate");
  }
  $scope.updateFeeFile = function (file, feeType, clas, section) {
    console.log("updateFeeFile-->");
    console.log(" feeType: " + feeType + " clas" + clas + " section: " + section);
    var obj = {
      "file": file,
    }
    if (clas && section && feeType) {
      var api = $scope.propertyJson.VC_feeUpdate + "/" + schoolName + "/" + clas + "/" + section + "/" + feeType;
    }
    else {
      $uibModal.open({
        scope: $scope,
        templateUrl: '/html/templates/dashboardwarning.html',
        windowClass: 'show',
        backdropClass: 'static',
        keyboard: false,
        controller: function ($scope, $uibModalInstance) {
          $scope.message = "Class, Section, Test Type and Date are required"
        }
      })
    }
    console.log("api: " + api);
    if (api) {
      httpFactory.csvUpload(obj, api).then(function (data) {
        var checkStatus = httpFactory.dataValidation(data);
        console.log("data--" + JSON.stringify(data.data));
        if (checkStatus) {
          $uibModal.open({
            scope: $scope,
            templateUrl: '/html/templates/dashboardsuccess.html',
            windowClass: 'show',
            backdropClass: 'static',
            keyboard: false,
            controller: function ($scope, $uibModalInstance) {
              $scope.message = data.data.message
            }
          })
          // alert(data.data.message);
          //$scope.getAllTeacherList();
          // $scope.up.uploadType= '';
        }
        else {
          $uibModal.open({
            scope: $scope,
            templateUrl: '/html/templates/dashboardsuccess.html',
            windowClass: 'show',
            backdropClass: 'static',
            keyboard: false,
            controller: function ($scope, $uibModalInstance) {
              $scope.message = data.data.message
            }
          })
          //alert(data.data.message);
        }
      })
      $scope.reset();
    }
    console.log("<--updateFeeFile");
  }
  /* ### Note: Teacher and student both are uploading through teacherUpdate ###*/
  $scope.teacherUpdate = function (file, uploadType, id) {
    console.log("updateTeacher to Master-->");
    console.log("file: " + file);
    console.log("id: " + id);
    var obj = {
      "file": file,
    }
    if (uploadType == "Teacher Details") {
      if (id) {
        var api = $scope.propertyJson.VC_updateTeacherMaster + "/" + schoolName + "/" + id;
      }
      else {
        $uibModal.open({
          scope: $scope,
          templateUrl: '/html/templates/dashboardwarning.html',
          windowClass: 'show',
          backdropClass: 'static',
          keyboard: false,
          controller: function ($scope, $uibModalInstance) {
            $scope.message = "Teacher is required"
          }
        })
      }
    }
    else if (uploadType == "Student Details") {
      if (id) {
        var api = $scope.propertyJson.VC_updateStudentMaster + "/" + schoolName + "/" + id;
      }
      else {
        $uibModal.open({
          scope: $scope,
          templateUrl: '/html/templates/dashboardwarning.html',
          windowClass: 'show',
          backdropClass: 'static',
          keyboard: false,
          controller: function ($scope, $uibModalInstance) {
            $scope.message = "Student is required"
          }
        })
      }
    }
    console.log("api: " + api);
    if (api) {
      httpFactory.csvUpload(obj, api).then(function (data) {
        var checkStatus = httpFactory.dataValidation(data);
        console.log("data--" + JSON.stringify(data.data));
        if (checkStatus) {
          $uibModal.open({
            scope: $scope,
            templateUrl: '/html/templates/dashboardsuccess.html',
            windowClass: 'show',
            backdropClass: 'static',
            keyboard: false,
            controller: function ($scope, $uibModalInstance) {
              $scope.message = data.data.message
            }
          })
          //alert(data.data.message);
          //$scope.getAllTeacherList();
          // $scope.up.uploadType= '';
        }
        else {
          $uibModal.open({
            scope: $scope,
            templateUrl: '/html/templates/dashboardwarning.html',
            windowClass: 'show',
            backdropClass: 'static',
            keyboard: false,
            controller: function ($scope, $uibModalInstance) {
              $scope.message = data.data.message
            }
          })
          // alert(data.data.message);
        }
        $scope.reset();
      })
    }
    console.log("<--updateTeacher to Master");
  }
  $scope.studentDetailById = function (s) {
    console.log("studentSelect-->");
    console.log("s: " + JSON.stringify(s));
    var id = s.id;
    var api = $scope.propertyJson.VC_studentDetail + "/" + id;
    console.log("api: " + api);
    httpFactory.get(api).then(function (data) {
      var checkStatus = httpFactory.dataValidation(data);
      //console.log("data--" + JSON.stringify(data.data));
      if (checkStatus) {
        $scope.studentDetail = data.data.data;
        console.log(" $scope.studentDetail: " + JSON.stringify($scope.studentDetail));
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

      }
    })
    console.log("<--studentSelect");
  }
  $scope.getStudListForCS = function (clas, section) {

    console.log("getStudListForCS-->");

    console.log("class" + clas.class + " section: " + section);
    // console.log("JSON.css" + JSON.stringify(css));
    var clas = clas.class;
    var section = section;
    $scope.studList = [];

    var api = $scope.propertyJson.VC_getStudListForCS + "/" + schoolName + "/" + clas + "/" + section;
    console.log("api: " + api);
    httpFactory.get(api).then(function (data) {
      var checkStatus = httpFactory.dataValidation(data);
      //console.log("data--" + JSON.stringify(data.data));
      if (checkStatus) {
        $scope.studentList = data.data.data;
        console.log("studentList: " + JSON.stringify($scope.studentList));
        var otherName = [];
        for (var x = 0; x < $scope.studentList.length; x++) {
          $scope.studList.push({ "id": $scope.studentList[x]._id, "name": $scope.studentList[x].firstName, "studId": $scope.studentList[x].schoolId });
        }
        // var feeOtherTypeLen = $scope.studentList[0].fee[5].length;
        //   for (var y = 0; y < feeOtherTypeLen; y++) {
        //     otherName.push($scope.studentList[x].fee.other[y].fee_otherName);
        //   }
        console.log(" $scope.studList.length: " + $scope.studList.length);
      }
      else {
        console.log("sorry");
      }
    })
    console.log("<--getStudListForCS");

  }
  $scope.testDateFetch = function (testType) {
    console.log("testDateFetch-->");
    $scope.testStartDate = [];
    //console.log("$scope.studentList[0].mark[testType].length: "+$scope.studentList[0].mark[testType].length);
    for (var x = 0; x < $scope.studentList[0].mark.length; x++) {
      if ($scope.studentList[0].mark[x].testType == testType) {
        for (var y = 0; y < $scope.studentList[0].mark[x].subjectWithMark.length; y++) {
          $scope.testStartDate.push({ "date": $scope.studentList[0].mark[x].subjectWithMark[y].date, "mark": $scope.studentList[0].mark[x].subjectWithMark[y].mark })
        }
      }
    }
    console.log("<--testDateFetch");
  }
  $scope.timeTableFileupdate = function (file, id) {
    console.log("timeTableFileupdate-->");
    console.log("id: " + id);
    var obj = {
      "file": file
    }
    if (id) {
      var api = $scope.propertyJson.VC_updateTeacher_timeTable + "/" + id;
    }
    else {
      $uibModal.open({
        scope: $scope,
        templateUrl: '/html/templates/dashboardwarning.html',
        windowClass: 'show',
        backdropClass: 'static',
        keyboard: false,
        controller: function ($scope, $uibModalInstance) {
          $scope.message = "Teacher is required"
        }
      })
    }

    console.log("api: " + api);
    if (api) {
      httpFactory.csvUpload(obj, api).then(function (data) {
        var checkStatus = httpFactory.dataValidation(data);
        console.log("data--" + JSON.stringify(data.data));
        if (checkStatus) {
          // $window.location.href = $scope.propertyJson.R082;
          var loginAlert = $uibModal.open({
            scope: $scope,
            templateUrl: '/html/templates/dashboardsuccess.html',
            windowClass: 'show',
            backdropClass: 'static',
            keyboard: false,
            controller: function ($scope, $uibModalInstance) {
              $scope.message = data.data.message;
            }
          })
          //alert(data.data.message);
          $scope.getSchoolData();
        } else {
          var loginAlert = $uibModal.open({
            scope: $scope,
            templateUrl: '/html/templates/dashboardwarning.html',
            windowClass: 'show',
            backdropClass: 'static',
            keyboard: false,
            controller: function ($scope, $uibModalInstance) {
              $scope.message = "Update Fail";
            }
          })
          //alert("Update Fail");
        }
      });
      $scope.reset();
    }

    console.log("<--timeTableFileupdate");
  }
  $scope.attendanceUpdate = function (file, clas, section, reportType, month) {
    console.log("attendanceUpdate-->");

    var obj = {
      "file": file
    }
    console.log("clas: " + clas + "section: " + section + "reportType: " + reportType + "month: " + month)
    if (clas && section && reportType && month) {
      var api = $scope.propertyJson.VC_attendanceUpdate + "/" + schoolName + "/" + clas + "/" + section + "/" + reportType + "/" + month;
      $scope.reset();
    }
    else {
      $uibModal.open({
        scope: $scope,
        templateUrl: '/html/templates/dashboardwarning.html',
        windowClass: 'show',
        backdropClass: 'static',
        keyboard: false,
        controller: function ($scope, $uibModalInstance) {
          $scope.message = "Class, Section, Report Type, Date are required"
        }
      })
    }
    console.log("api: " + api);
    if (api) {
      httpFactory.csvUpload(obj, api).then(function (data) {
        var checkStatus = httpFactory.dataValidation(data);
        console.log("data--" + JSON.stringify(data.data));
        if (checkStatus) {
          // $window.location.href = $scope.propertyJson.R082;
          var loginAlert = $uibModal.open({
            scope: $scope,
            templateUrl: '/html/templates/dashboardsuccess.html',
            windowClass: 'show',
            backdropClass: 'static',
            keyboard: false,
            controller: function ($scope, $uibModalInstance) {
              $scope.message = data.data.message;
            }
          })
          //alert(data.data.message);
          $scope.getSchoolData();
        } else {
          var loginAlert = $uibModal.open({
            scope: $scope,
            templateUrl: '/html/templates/dashboardwarning.html',
            windowClass: 'show',
            backdropClass: 'static',
            keyboard: false,
            controller: function ($scope, $uibModalInstance) {
              $scope.message = "Update Fail";
            }
          })
          //alert("Update Fail");
        }
      });
    }
    console.log("<--attendanceUpdate");
  }
  $scope.uploadFile = function (file, uploadType, reportType, list) {
    console.log("uploadFile-->");
    console.log("file: " + file);
    var obj = {
      "file": file,
    }
    console.log("uploadType: " + uploadType);
    console.log("reportType: " + reportType);
    if (uploadType == "Mark Report") {
      var api = $scope.propertyJson.VC_uploadMark;
    }
    else if (uploadType == "Attendance") {
      var month = list;
      var api = $scope.propertyJson.VC_uploadAttendance + "/" + reportType + "/" + month;
    }
    else if (uploadType == "Payment") {
      var api = $scope.propertyJson.VC_uploadPayment;
    }
    else if (uploadType == "Student Details") {
      var api = $scope.propertyJson.VC_uploadStudentMaster;
    }
    console.log("api: " + api);
    httpFactory.csvUpload(obj, api).then(function (data) {
      var checkStatus = httpFactory.dataValidation(data);
      console.log("data--" + JSON.stringify(data.data));
      if (checkStatus) {
        if (uploadType == "Attendance") {
          if (data.data.data.length > 0) {
            $uibModal.open({
              scope: $scope,
              templateUrl: '/html/templates/dashboardsuccess.html',
              windowClass: 'show',
              backdropClass: 'static',
              keyboard: false,
              controller: function ($scope, $uibModalInstance) {
                $scope.message = data.data.message + " But we have found unknown statudent detail " + data.data.data[0].StudentName + "-" + data.data.data[0].StudentID
              }
            })
            // alert(data.data.message + " But we have found unknown statudent detail " + data.data.data[0].StudentName + "-" + data.data.data[0].StudentID);
          }
          else {
            $uibModal.open({
              scope: $scope,
              templateUrl: '/html/templates/dashboardsuccess.html',
              windowClass: 'show',
              backdropClass: 'static',
              keyboard: false,
              controller: function ($scope, $uibModalInstance) {
                $scope.message = data.data.message
              }
            })
            //alert(data.data.message);
          }

        }
        else {
          $uibModal.open({
            scope: $scope,
            templateUrl: '/html/templates/dashboardsuccess.html',
            windowClass: 'show',
            backdropClass: 'static',
            keyboard: false,
            controller: function ($scope, $uibModalInstance) {
              $scope.message = data.data.message
            }
          })
          //alert(data.data.message);
        }
      }
      else {
        if (uploadType == "Attendance") {
          if (data.data.message == "Sorry! you already updated for this month") {
            $uibModal.open({
              scope: $scope,
              templateUrl: '/html/templates/dashboardsuccess.html',
              windowClass: 'show',
              backdropClass: 'static',
              keyboard: false,
              controller: function ($scope, $uibModalInstance) {
                $scope.message = data.data.message + " If you want to update, try update reports option"
              }
            })
            //alert(data.data.message + " If you want to update, try update reports option");
          }
        }
        else {
          $uibModal.open({
            scope: $scope,
            templateUrl: '/html/templates/dashboardsuccess.html',
            windowClass: 'show',
            backdropClass: 'static',
            keyboard: false,
            controller: function ($scope, $uibModalInstance) {
              $scope.message = data.data.message
            }
          })
          //alert(data.data.message);
        }

      }
    })

    console.log("<--uploadFile");
  }

  $scope.att_monthSelected = function (mon) {
    console.log("att_monthSelected-->");
    $scope.openCalendarTemplate = true; /* ### Note: Front End visibility of calendar based on openCalendarTemplate variable ### */
    var vm = this;
    $scope.calendarView = 'month';
    //$scope.viewDate = moment().startOf('day').toDate();
    $scope.viewDate = new Date('2018-' + mon);
    var originalFormat = calendarConfig.dateFormats.hour;
    calendarConfig.dateFormats.hour = 'HH:mm';

    $scope.cellIsOpen = true;
    console.log("<--att_monthSelected");
  }


})