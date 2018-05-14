app.controller('reportsUploadCtl', function ($scope, $window, httpFactory, sessionAuthFactory, $uibModal) {
  console.log("attendanceCtl==>");
  $scope.userData = sessionAuthFactory.getAccess("userData");
  var schoolName = $scope.userData.schoolName;
  console.log(" $scope.userData : " + JSON.stringify($scope.userData));
  $scope.file = {}; /* ### Note: Upload file declaration ### */
  $scope.uploadTypes = ["Teacher Details", "Student Details", "Time Table", "Attendance", "Payment", "Mark Report"];
  $scope.testTypes = ["AT", "UT", "MT", "TT", "AT"];
  $scope.attendanceTypes = ["Monthly", "Daily"];
  $scope.monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  $scope.sma = []; /* ### Note:sma-Subject Mark Attendant  */

  $scope.getSchoolData = function () {
    console.log("getSchoolData-->");
    $scope.cssList = [];
    var api = "https://norecruits.com/vc/getSchoolData/" + schoolName;
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

  $scope.getTeacherList = function () {
    console.log("getTeacherList-->");
    $scope.teacherList = [];
    $scope.teacherList_noTT = []; /* ### Note: teacher list without time table(teacherList_noTT-teacher list no timetable) ###*/
    var api = "https://norecruits.com/vc/getSchoolUser/" + schoolName;
    console.log("api: " + api);
    httpFactory.get(api).then(function (data) {
      var checkStatus = httpFactory.dataValidation(data);
      console.log("data--" + JSON.stringify(data.data));
      if (checkStatus) {
        var schoolUser = data.data.data;
        // console.log("schoolList: " + JSON.stringify(schoolUser));
        var teacherData = schoolUser.schoolTeacherList;

        console.log("teacherData: " + JSON.stringify(teacherData));
        for (var x = 0; x < teacherData.length; x++) {
          if (teacherData[x].loginType == 'teacher') {
            var name = teacherData[x].firstName + teacherData[x].lastName;
            $scope.teacherList.push({ "_id": teacherData[x]._id, "name": name, "schoolId": teacherData[x].schoolId });
            if (teacherData[x].timeTable.length == 0) {
              $scope.teacherList_noTT.push({ "_id": teacherData[x]._id, "name": name, "schoolId": teacherData[x].schoolId });
            }
          }

        }

        console.log(data.data.message);
      }
      else {
        console.log("Sorry");
      }

    })
    console.log("<--getTeacherList");
  }
  $scope.getTeacherList();

  $scope.getSection = function (clas) {
    console.log("getSection-->");
    console.log("clas: " + JSON.stringify(clas));
    console.log("getSection-->");
  }
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

  $scope.uploadMarkFile = function (file, testType, date, clas, section) {
    console.log("uploadMarkFile-->");
    console.log("testTYpe: " + testType + "date: " + date);
    var obj = {
      "file": file
    }
    var api = "https://norecruits.com/vc/uploadMarkFile/" + schoolName + "/" + testType + "/" + date + "/" + clas + "/" + section;
    console.log("api: " + api);
    httpFactory.imageUpload(file, api).then(function (data) {
      var checkStatus = httpFactory.dataValidation(data);
      console.log("data--" + JSON.stringify(data.data));
      if (checkStatus) {
        //alert(data.data.message);
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

        up[0].ttSelect = null;
      }
      else {
        var loginAlert = $uibModal.open({
          scope: $scope,
          templateUrl: '/html/templates/dashboardwarning.html',
          windowClass: 'show',
          backdropClass: 'static',
          keyboard: false,
          controller: function ($scope, $uibModalInstance) {
            $scope.message = data.data.message;
          }
        })
        //alert(data.data.message);
      }
    })
    console.log("<--uploadMarkFile");
  }

  $scope.upload_classPeriodsFile = function (file, fileType) {
    console.log("upload_classPeriodsFile-->");
    var obj = {
      "file": file
    }
    if (fileType == 'css') {
      var api = "https://norecruits.com/vc/uploadClassFile/" + schoolName;
    }
    if (fileType == 'periods') {
      var api = "https://norecruits.com/vc/uploadPeriodsFile/" + schoolName;
    }

    console.log("api: " + api);
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
    console.log("<--upload_classPeriodsFile");
  }

  $scope.uploadTimeTableFile = function (file, data) {
    console.log("uploadTimeTableFile-->");
    console.log("data: " + JSON.stringify(data));
    var obj = {
      "file": file
    }
    var api = "https://norecruits.com/vc/uploadTeacher_timeTable/" + schoolName + "/" + data._id;
    console.log("api: " + api);
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

    console.log("<--uploadTimeTableFile");
  }

  $scope.uploadFile = function (file, uploadType, clas, section, reportType, list) {
    console.log("uploadFile-->");
    console.log("file: " + file);

    var obj = {
      "file": file
    }
    console.log("uploadType: " + uploadType);
    console.log("reportType: " + reportType);
    if (uploadType == "Mark Report") {
      var api = "https://norecruits.com/vc/uploadMark";
    }
    else if (uploadType == "Attendance") {
      var month = list;
      var api = "https://norecruits.com/vc/uploadAttendance/" + schoolName + "/" + clas + "/" + section + "/" + reportType + "/" + month;
    }
    else if (uploadType == "Payment") {
      var api = "https://norecruits.com/vc/uploadPayment";
    }
    else if (uploadType == "Student Details") {
      var api = "https://norecruits.com/vc/uploadStudentMaster/" + schoolName + "/" + clas + "/" + section;
    }
    else if (uploadType == "Teacher Details") {
      var api = "https://norecruits.com/vc/uploadTeacherMaster/" + schoolName;
    }
    console.log("api: " + api);
    httpFactory.csvUpload(obj, api).then(function (data) {
      var checkStatus = httpFactory.dataValidation(data);
      console.log("data--" + JSON.stringify(data.data));
      if (checkStatus) {
        if (uploadType == "Attendance") {
          if (data.data.data.length > 0) {
            var loginAlert = $uibModal.open({
              scope: $scope,
              templateUrl: '/html/templates/dashboardsuccess.html',
              windowClass: 'show',
              backdropClass: 'static',
              keyboard: false,
              controller: function ($scope, $uibModalInstance) {
                $scope.message = data.data.message + " But we have found unknown statudent detail " + data.data.data[0].StudentName + "-" + data.data.data[0].StudentID
              }
            })
            //alert(data.data.message + " But we have found unknown statudent detail " + data.data.data[0].StudentName + "-" + data.data.data[0].StudentID);
          }
          else {
            var loginAlert = $uibModal.open({
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
          var loginAlert = $uibModal.open({
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
          console.log("Sorry! you already updated for this month");
          if (data.data.message == "Sorry! you already updated for this month") {

            var loginAlert = $uibModal.open({
              scope: $scope,
              templateUrl: '/html/templates/dashboardwarning.html',
              windowClass: 'show',
              backdropClass: 'static',
              keyboard: false,
              controller: function ($scope, $uibModalInstance) {
                $scope.message = data.data.message
              }
            })
            //alert(data.data.message + " If you want to update, try update reports option");
          }
          else if (data.data.note == "upload not satisfied") {
            console.log("data: " + data.message);
            console.log("data: " + data.data.message);
            var msg = data.data.message;
            console.log("msg: " + msg);
           // alert(data.data.message);
            var loginAlert = $uibModal.open({
              scope: $scope,
              templateUrl: '/html/templates/dashboardsuccess.html',
              windowClass: 'show',
              backdropClass: 'static',
              keyboard: false,
              controller: function ($scope, $uibModalInstance) {
                $scope.message = msg;
              }
            })
          }
        }
        else {
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
        }

      }
    })

    console.log("<--uploadFile");
  }



  // $scope.getStudListForCS = function (css) {

  //   console.log("getStudListForCS-->");
  //   // console.log("$scope.cssSelect: "+JSON.stringify($scope.cssSelect));
  //   console.log("css" + css);
  //   console.log("JSON.css" + JSON.stringify(css));
  //   var clas = css.class;
  //   var section = css.section;
  //   $scope.studList = [];
  //   // var cssRef = [{"clas":css.class, "section": css.section}];
  //   // console.log("cssRef: "+JSON.stringify(cssRef));

  //   var api = "https://norecruits.com/vc/getStudListForCS" + "/" + clas + "/" + section;
  //   //var api = "http://localhost:5000/vc/getStudListForCS" + "/" + clas + "/" + section;
  //   //var api = "https://norecruits.com/vc/getStudListForCS";

  //   console.log("api: " + api);
  //   httpFactory.get(api).then(function (data) {
  //     var checkStatus = httpFactory.dataValidation(data);
  //     //console.log("data--" + JSON.stringify(data.data));
  //     if (checkStatus) {
  //       $scope.studentList = data.data.data;
  //       console.log("studentList: " + JSON.stringify($scope.studentList));
  //       for (var x = 0; x < $scope.studentList.length; x++) {
  //         $scope.studList.push({ "id": $scope.studentList[x]._id, "name": $scope.studentList[x].studName, "studId": $scope.studentList[x].studId });

  //       }
  //       console.log(" $scope.studList.length: " + $scope.studList.length);
  //       //   $scope.css = $scope.teacherData[0].css;
  //       //   console.log("$scope.css: " + JSON.stringify($scope.css));
  //     }
  //     else {
  //       console.log("sorry");
  //     }
  //   })
  //   console.log("<--getStudListForCS");

  // }

  // $scope.festDetailSub = function (file) {

  //   console.log("festDetailSub-->");


  //   console.log("file: " + file);
  //   console.log("$scope.file: " + $scope.file);
  //   // festDetailSubJson = {
  //   //     "title": title,
  //   //     "message": message
  //   // }
  //   if (file != undefined) {
  //     var uploadURL = "https://norecruits.com/vc/uploadAttendance";
  //     console.log("$scope.file from : alumRegCtr.js: " + $scope.file);
  //     httpFactory.imageUpload(file, uploadURL).then(function (data) {
  //       var checkStatus = httpFactory.dataValidation(data);
  //       if (checkStatus) {
  //         $scope.getUpdateofImage = data;
  //         console.log("$scope.getUpdateofImage" + JSON.stringify($scope.getUpdateofImage));
  //         // $scope.message = data.data.message;
  //         $scope.filePath = data.data.fileFullPath;
  //         $scope.status = data.data.status;
  //         if ($scope.filePath) {
  //           festDetailSubJson.file = $scope.filePath;
  //         }
  //         // $scope.festivalDetailDetails();

  //       } else {
  //         $scope.status = data.data.status;
  //         // $scope.message = data.data.message;
  //         console.log("image is filed to uploaded");
  //       }
  //     });
  //   }
  //   else {
  //     // $scope.festivalDetailDetails();
  //     console.log("image is not uploaded");
  //   }

  //   console.log("<--festDetailSub");
  // }
})