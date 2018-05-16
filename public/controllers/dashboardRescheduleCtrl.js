app.controller('dashboardRescheduleCtrl', function ($scope, $state, $rootScope, $compile, $window, $filter, httpFactory, sessionAuthFactory, moment, calendarConfig, $uibModal) {
    console.log("dashboardScheduleCtrl==>");

    var dayEventmodal; /* ### Note: open model for event send ###  */
    var studEvents = []; /* ### Note: selected student events ### */
    var teacherEvents = []; /* ### Note: selected teacher events ### */
    var ownerEvents = []; /* ### Note: logged in person all events ### */
    var remoteEvent = []; /* ### Note:receiver all events ### */
    // $scope.timeForPeriods = $rootScope.TimeTable_timing;



    $scope.eventGet = function () {
        console.log("eventGet-->");
        var id = $scope.userData.id
        var api = "https://vc4all.in/vc/eventGet" + "/" + id;
        //var api = "http://localhost:5000/vc/eventGet"+ "/" + id;;
        $scope.calendarOwner = "Your";
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.eventData = data.data.data;
                vm.events = [];
                ownerEvents = [];
                for (var x = 0; x < $scope.eventData.length; x++) {
                    console.log("$scope.eventData[" + x + "]: " + JSON.stringify($scope.eventData[x]));
                    var obj = {
                        'id': $scope.eventData[x]._id,
                        'userId': $scope.eventData[x]._userId,
                        "student_cs": $scope.eventData[x].student_cs,
                        "student_id": $scope.eventData[x].student_id,
                        "student_Name": $scope.eventData[x].student_Name,
                        'title': $scope.eventData[x].title,
                        'color': $scope.eventData[x].primColor,
                        'startsAt': new Date($scope.eventData[x].start),
                        'endsAt': new Date($scope.eventData[x].end),
                        'draggable': true,
                        'resizable': true,
                        'actions': actions,
                        'url': $scope.eventData[x].url,
                        "senderName": $scope.eventData[x].senderName,
                        "senderId": $scope.eventData[x].senderId,
                        "senderMN": $scope.eventData[x].senderMN,
                        "senderLoginType": $scope.eventData[x].senderLoginType,
                        "title": $scope.eventData[x].title,
                        "reason": $scope.eventData[x].reason,
                        "receiverEmail": $scope.eventData[x].receiverEmail,
                        "receiverName": $scope.eventData[x].receiverName,
                        "receiverId": $scope.eventData[x].receiverId,
                        "receiverMN": $scope.eventData[x].receiverMN,
                        "remoteCalendarId": $scope.eventData[x].remoteCalendarId
                    }
                    console.log(" obj" + JSON.stringify(obj))
                    ownerEvents.push(obj);
                    vm.events.push(obj);

                }
            }
            else {
                //alert("Event get Failed");

            }

        })
    }

    $scope.getToDate = function () {
        console.log("Get To Date-->");
        var api = "https://vc4all.in/vc/getToDate";
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                console.log("data.data.data.date: " + data.data.data.date);
                var todayDate = new Date(data.data.data.date);
                console.log("todayDate: " + todayDate);
                var reqDate = todayDate.getDate();
                console.log("reqDate: " + reqDate);
                var reqMonth = todayDate.getMonth();
                var reqYear = todayDate.getFullYear();
                var reqHr = todayDate.getHours();
                var reqMin = todayDate.getMinutes();
                var reqSec = todayDate.getSeconds();
                $scope.todayDate = new Date(reqYear, reqMonth, reqDate, reqHr, reqMin, reqSec);
                console.log("consolidateDate: " + $scope.consolidateDate);
                $scope.eventGet();
            }
            else {
            }
        })
        console.log("<--Get To Date");
    }
    $scope.getToDate();

    $scope.getTeacherData = function () {
        console.log("getTeacherData-->");
        var id = $scope.userData.id;
        var api = "https://vc4all.in/vc/teacherDetail" + "/" + id;
        //var api = "http://localhost:5000/vc/teacherDetail" + "/" + id;
        //var api = "http://localhost:5000/vc/eventGet";
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            // console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.teacherData = data.data.data;
                $scope.teacherPersonalData = data.data.data;
                console.log("teacherData: " + JSON.stringify($scope.teacherData));
                console.log("teacherPersonalData: " + JSON.stringify($scope.teacherPersonalData));
                //   $scope.css = $scope.teacherData[0].css;
                //   console.log("$scope.css: " + JSON.stringify($scope.css));
            }
            else {
            }
        })
        console.log("<--getTeacherData");
    }

    $scope.getStudentData = function () {
        console.log("getTeacherData-->");
        var id = $scope.userData.id;
        var api = "https://vc4all.in/vc/studentDetail" + "/" + id;
        console.log("api: " + api);
        $scope.teacherList = [];
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            //console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.studentData = data.data.data;
                console.log("studentData: " + JSON.stringify($scope.studentData));

                $scope.studClass = $scope.studentData[0].cs[0].class;
                $scope.studSection = $scope.studentData[0].cs[0].section;
                var api = "https://vc4all.in/vc/getTeacherListForCS" + "/" + $scope.studClass + "/" + $scope.studSection;

                console.log("api: " + api);
                httpFactory.get(api).then(function (data) {
                    var checkStatus = httpFactory.dataValidation(data);
                    // console.log("data--" + JSON.stringify(data.data));
                    if (checkStatus) {
                        $scope.teacherListForStudent = data.data.data;
                        console.log("teacherListForStudent: " + JSON.stringify($scope.teacherListForStudent));
                        for (var x = 0; x < $scope.teacherListForStudent.length; x++) {

                            for (var y = 0; y < $scope.teacherListForStudent[x].css.length; y++) {
                                if ($scope.teacherListForStudent[x].css[y].class == $scope.studClass && $scope.teacherListForStudent[x].css[y].section == $scope.studSection)
                                    $scope.teacherList.push({ "id": $scope.teacherListForStudent[x]._id, "name": $scope.teacherListForStudent[x].teacherName, "teacherId": $scope.teacherListForStudent[x].teacherId, "subject": $scope.teacherListForStudent[x].css[y].subject });
                            }
                        }
                        console.log(" $scope.teacherList: " + $scope.teacherList);
                        // console.log(" $scope.studList.length: " + $scope.studList.length);
                        //   $scope.css = $scope.teacherData[0].css;
                        //   console.log("$scope.css: " + JSON.stringify($scope.css));
                    }
                    else {
                        console.log("sorry");
                    }
                })
                console.log("studClass: " + JSON.stringify($scope.studClass));
                console.log("studSection: " + JSON.stringify($scope.studSection));
                console.log("studentData: " + JSON.stringify($scope.studentData));

            }
            else {
            }
        })
        console.log("<--getTeacherData");
    }

    $scope.getSelectedTeacherPersonalData = function (id) {
        console.log("getSelectedTeacherPersonalData-->");
        var api = "https://vc4all.in/vc/teacherPersonalData" + "/" + id;
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            // console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.teacherPersonalData = data.data.data;

                console.log("$scope.teacherPersonalData: " + JSON.stringify($scope.teacherPersonalData));
            }
            else {
                //alert("Event get Failed");
            }

        })
        console.log("<--getSelectedTeacherPersonalData");
    }

    $scope.getSelectedStudentPersonalData = function (id) {
        console.log("get Selected Student PersonalData-->");
        var api = "https://vc4all.in/vc/studentPersonalData" + "/" + id;
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            // console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.studentPersonalData = data.data.data;
                //console.log(" data.data.data: " + JSON.stringify(data.data.data));
                console.log("$scope.studentPersonalData: " + JSON.stringify($scope.studentPersonalData));
            }
            else {
                //alert("Event get Failed");
            }

        })
        console.log("<--get Selected Student PersonalData");
    }

    $scope.getStudentCalendar = function (css) {
        console.log("getStudentCalendar-->");
        console.log("css" + css.id);
        console.log("JSON.css" + JSON.stringify(css));
        $scope.remoteCalendarId = css.id;
        $scope.getSelectedStudentPersonalData($scope.remoteCalendarId);
        var api = "https://vc4all.in/vc/eventGet" + "/" + css.id;
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            // console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.calendarOwner = css.name;
                $scope.specificSED = data.data.data;/* ### Note:Function Name specificSED --> specificStudentEventData(specificSED) ### */
                console.log("$scope.specificSED.length: " + $scope.specificSED.length);
                //vm.events = [];
                studEvents = [];
                remoteEvent = [];
                for (var x = 0; x < $scope.specificSED.length; x++) {
                    console.log("$scope.specificSED[" + x + "]: " + JSON.stringify($scope.specificSED[x]));
                    var obj = {
                        'id': $scope.specificSED[x]._id,
                        'title': $scope.specificSED[x].title,
                        'color': '$scope.specificSED[x].primColor',
                        'startsAt': new Date($scope.specificSED[x].start),
                        'endsAt': new Date($scope.specificSED[x].end),
                        'draggable': true,
                        'resizable': true,
                        'actions': actions,
                        'url': $scope.specificSED[x].url,
                        "studentName": $scope.specificSED[x].studName,
                        "studendtId": $scope.specificSED[x].studId,
                        "title": $scope.specificSED[x].title,
                        "reason": $scope.specificSED[x].reason,
                        "email": $scope.specificSED[x].email
                    }
                    console.log(" obj" + JSON.stringify(obj))

                    // vm.events.push(obj);
                    remoteEvent.push(obj);
                    studEvents.push(obj);
                    // vm.events.push(obj);
                }
            }
            else {
                //alert("Event get Failed");
            }
        })
        console.log("<--getStudentCalendar");
    }

    $scope.getTeacherCalendar = function (css) {
        console.log("getTeacherCalendar-->");
        console.log("css" + css.id);
        console.log("JSON.css" + JSON.stringify(css));
        $scope.remoteCalendarId = css.id;
        $scope.getSelectedTeacherPersonalData($scope.remoteCalendarId);
        var api = "https://vc4all.in/vc/eventGet" + "/" + css.id;
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            // console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.calendarOwner = css.name;
                $scope.specificTED = data.data.data;/* ### Note:Function Name specificTED --> specificTeachEventData(specificTED) ### */
                console.log("$scope.specificTED.length: " + $scope.specificTED.length);
                //vm.events = [];
                remoteEvent = [];
                teacherEvents = [];
                for (var x = 0; x < $scope.specificTED.length; x++) {
                    console.log("$scope.specificTED[" + x + "]: " + JSON.stringify($scope.specificTED[x]));
                    var obj = {
                        'id': $scope.specificTED[x]._id,
                        'title': $scope.specificTED[x].title,
                        'color': $scope.specificTED[x].primColor,
                        'startsAt': new Date($scope.specificTED[x].start),
                        'endsAt': new Date($scope.specificTED[x].end),
                        'draggable': true,
                        'resizable': true,
                        'actions': actions,
                        'url': $scope.specificTED[x].url,
                        "studentName": $scope.specificTED[x].studName,
                        "studendtId": $scope.specificTED[x].studId,
                        "title": $scope.specificTED[x].title,
                        "reason": $scope.specificTED[x].reason,
                        "email": $scope.specificTED[x].email
                    }
                    console.log(" obj" + JSON.stringify(obj));
                    // vm.events.push(obj);

                    teacherEvents.push(obj);
                    // vm.events.push(obj);
                    remoteEvent.push(obj);

                }
            }
            else {
                //alert("Event get Failed");
            }

        })

        console.log("<--getTeacherCalendar");
    }

    $scope.getSSCalendar = function () { /* ### Note: Get selected student calender(getSSCalendar) ###*/
        console.log("getSSCalendar-->");
        // console.log("$scope.studentPersonalData: "+JSON.stringify($scope.studentPersonalData));
        // console.log("$scope.studentPersonalData.studName: "+$scope.studentPersonalData[0].studName);
        $scope.calendarOwner = $scope.studentPersonalData[0].studName;
        vm.events = [];
        vm.events = JSON.parse(JSON.stringify(studEvents));
        $scope.getSelectedStudentPersonalData($scope.remoteCalendarId);
        console.log("<--getSSCalendar");
    }
    $scope.getSTCalendar = function () { /* ### Note: Get selected Teacher calender(getTSCalendar) ###*/
        console.log("getSTCalendar-->");
        // console.log("$scope.studentPersonalData: "+JSON.stringify($scope.studentPersonalData));
        // console.log("$scope.studentPersonalData.studName: "+$scope.studentPersonalData[0].studName);
        $scope.calendarOwner = $scope.teacherPersonalData[0].teacherName;
        vm.events = [];
        vm.events = JSON.parse(JSON.stringify(teacherEvents));
        $scope.getSelectedTeacherPersonalData($scope.remoteCalendarId);
        console.log("<--getSTCalendar");
    }
    $scope.userData = sessionAuthFactory.getAccess("userData");
    var loginType = $scope.userData.loginType;
    if (loginType == 'admin') {
        console.log("loginType: " + localStorage.getItem("loginType"));
        $scope.userLoginType = 'admin';
    }
    else if (loginType == 'teacher') {
        $scope.userLoginType = 'teacher';
        $scope.getTeacherData();
    }
    else if (loginType == 'studParent') {
        $scope.userLoginType = 'studParent';
        $scope.getStudentData();
    }
    else {
        console.log("loginType" + loginType);
        // window.location.href = "https://vc4all.in";
    }

    $scope.getStudListForCS = function (css) {

        console.log("getStudListForCS-->");
        // console.log("$scope.cssSelect: "+JSON.stringify($scope.cssSelect));
        console.log("css" + css);
        console.log("JSON.css" + JSON.stringify(css));
        var clas = css.class;
        var section = css.section;
        $scope.studList = [];
        // var cssRef = [{"clas":css.class, "section": css.section}];
        // console.log("cssRef: "+JSON.stringify(cssRef));

        var api = "https://vc4all.in/vc/getStudListForCS" + "/" + clas + "/" + section;
        //var api = "http://localhost:5000/vc/getStudListForCS" + "/" + clas + "/" + section;
        //var api = "https://vc4all.in/vc/getStudListForCS";

        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            //console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.studentList = data.data.data;
                console.log("studentList: " + JSON.stringify($scope.studentList));
                for (var x = 0; x < $scope.studentList.length; x++) {
                    $scope.studList.push({ "id": $scope.studentList[x]._id, "name": $scope.studentList[x].studName, "studId": $scope.studentList[x].studId });

                }
                console.log(" $scope.studList.length: " + $scope.studList.length);
                //   $scope.css = $scope.teacherData[0].css;
                //   console.log("$scope.css: " + JSON.stringify($scope.css));
            }
            else {
                console.log("sorry");
            }
        })
        console.log("<--getStudListForCS");

    }

    $scope.eventColors = ['red', 'green', 'blue'];

    $scope.deleteEvent = function (id, index) {
        console.log("deleteEvent-->");
        var api = "https://vc4all.in/vc/deleteEvent";
        //var api = "http://localhost:5000/vc/deleteEvent";
        vm.events.splice(index, 1);
        var obj = {
            "id": id
        }
        httpFactory.post(api, obj).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            //console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
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
                //  console.log("data" + JSON.stringify(data.data))
                // $window.location.href = $scope.propertyJson.R082;
                //alert(data.data.message);
            }
            else {
                var loginAlert = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/html/templates/dashboardwarning.html',
                    windowClass: 'show',
                    backdropClass: 'static',
                    keyboard: false,
                    controller: function ($scope, $uibModalInstance) {
                      $scope.message = "Event Delete Failed";
                    }
                  })
               // alert("Event Delete Failed");

            }
        })
        console.log("<--deleteEvent");
    }

    $scope.updateSave = function (s, e, sFiltered, eFiltered, id, msg, email, url) {
        console.log("updateSave-->");
        console.log("_id: " + id);
        console.log("s: " + s);
        console.log("e: " + e);
        var res = $filter('limitTo')(s, 2);

        console.log("res: " + res);
        console.log("$scope.startDate with filter : " + $filter('date')(s, "EEE MMM dd y"));
        console.log("$scope.endDate with filter: " + $filter('date')(e, "HH:mm:ss 'GMT'Z (IST)'"));

        $scope.startD = s;
        $scope.startFiltered = sFiltered;
        $scope.endFiltered = eFiltered;
        $scope.startDate = $filter('date')(s, "EEE MMM dd y");
        $scope.endDate = $filter('date')(e, "HH:mm:ss 'GMT'Z (IST)'");
        $scope.endDateRes = $scope.startDate + ' ' + $scope.endDate;
        $scope.urlDate = $filter('date')(s, "EEEMMMddyHHmmss");

        $scope.updatedEvent(msg, id, email, url);
        console.log("$scope.endDateRes: " + $scope.endDateRes);
    }

    $scope.updatedEvent = function (res, id, email, url) {
        console.log("updatedEvent-->");
        console.log("id: " + id);
        var obj = {
            "_id": id,
            "reason": res,
            "start": $scope.startD,
            "end": $scope.endDateRes,
            "startAt": $scope.startFiltered,
            "endAt": $scope.endFiltered,
            "email": email,
            "url": url
        }
        console.log("obj: " + JSON.stringify(obj));

        var api = "https://vc4all.in/vc/eventUpdate" + "/" + id;
        //var api = "http://localhost:5000/vc/eventUpdate" + "/" + id;

        httpFactory.post(api, obj).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {

                console.log("data" + JSON.stringify(data.data))
                // $window.location.href = $scope.propertyJson.R082;
                var loginAlert = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/html/templates/dashboardsuccess.html',
                    windowClass: 'show',
                    backdropClass: 'static',
                    keyboard: false,
                    controller: function ($scope, $uibModalInstance) {
                      $scope.message = "Updated Successfully"+data.data.message;
                    }
                  })
               // alert("Successfully event updated" + data.data.message);
            }
            else {
                var loginAlert = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/html/templates/dashboardwarning.html',
                    windowClass: 'show',
                    backdropClass: 'static',
                    keyboard: false,
                    controller: function ($scope, $uibModalInstance) {
                      $scope.message = "Event Send Failed";
                    }
                  })
              //  alert("Event Send Failed");

            }

        })
        console.log("<--updatedEvent");
    }

    $scope.save = function (date, sd, ed, s, e, sFiltered, eFiltered, title, reason) {
        console.log("s: " + s);
        console.log("e: " + e);
        console.log("sd: " + sd);
        console.log("ed: " + ed);

        var res = $filter('limitTo')(s, 2);
        console.log("res: " + res);
        console.log("$scope.startDate with filter : " + $filter('date')(s, "EEE MMM dd y"));
        console.log("$scope.endDate with filter: " + $filter('date')(e, "HH:mm:ss 'GMT'Z (IST)'"));

        $scope.title = title;
        $scope.date = date,
            $scope.sd = sd,
            $scope.ed = ed,
            $scope.startD = s;
        $scope.startFiltered = sFiltered;
        $scope.endFiltered = eFiltered;
        $scope.startDate = $filter('date')(s, "EEE MMM dd y");
        $scope.endDate = $filter('date')(e, "HH:mm:ss 'GMT'Z (IST)'");
        $scope.endDateRes = $scope.startDate + ' ' + $scope.endDate;
        $scope.urlDate = $filter('date')(s, "EEEMMMddyHHmmss");
        console.log("$scope.endDate: " + $scope.endDate);
        console.log("$scope.urlDate: " + $scope.urlDate);
        console.log("$scope.endDate: " + $scope.endDate);
        console.log("$scope.endDateRes: " + $scope.endDateRes);

        dayEventmodal.close('resetModel');

        $scope.eventSend(reason);

        // if ($scope.userLoginType == 'studParent') {
        //     var senderName = $scope.studentData[0].studName;
        //     var stud_name = $scope.studentData[0].studName;
        //     var stud_cs = $scope.studentData[0].cs;
        //     var stud_id = $scope.studentData[0].studId;
        //     var senderMN = $scope.teacherPersonalData[0].mobileNum;
        //     var studId = $scope.studentData[0].studId;
        //     var email = $scope.teacherPersonalData[0].teacherEmail;/* ### Note: teacher email Id ### */
        //     var receiverName = $scope.teacherPersonalData[0].teacherName;
        //     var receiverId = $scope.teacherPersonalData[0].teacherId;
        //     var receiverMN = $scope.teacherPersonalData[0].mobileNum;
        //     $scope.eventSend(reason, senderName, studId, email, senderMN, receiverName, receiverId, receiverMN, stud_Id, stud_cs, stud_name);
        //   }
        //   if ($scope.userLoginType == 'teacher') {

        //     var teacherName = $scope.teacherData[0].teacherName;
        //     var senderMN = $scope.teacherData[0].mobileNum;
        //     var teacherId = $scope.teacherData[0].teacherId;
        //     var email = $scope.studentPersonalData[0].parentEmail;/* ### Note: parentEmail email Id ### */
        //     var receiverName = $scope.studentPersonalData[0].studName;
        //     var receiverId = $scope.studentPersonalData[0].studId;
        //     var receiverMN = $scope.studentPersonalData[0].mobileNum;
        //     var stud_name = $scope.studentPersonalData[0].studName;
        //     var stud_cs = $scope.studentPersonalData[0].cs;
        //     var stud_id = $scope.studentPersonalData[0].studId;
        //     $scope.eventSend(reason, teacherName, teacherId, email, senderMN, receiverName, receiverId, receiverMN, stud_Id, stud_cs, stud_name);
        //   }


    }

    $scope.eventSend = function (res) {
        console.log("eventSend-->");
        var SIGNALING_SERVER = "https://vc4all.in";
        //var SIGNALING_SERVER = "http://localhost:5000";
        var queryLink = null;
        var peerNew_id = null;
        var url;
        var id = $state.params.id
        var api = "https://vc4all.in/vc/eventReSchedule" + "/" + id;
        //var api = "http://localhost:5000/vc/eventSend";
        console.log("api: " + api);
        // var email = document.getElementById('eventEmails').value;
        var obj = {
            "title": $scope.title,
            "reason": res,
            "start": $scope.startD,
            "end": $scope.endDateRes,
            "startAt": $scope.startFiltered,
            "endAt": $scope.endFiltered, /* ###Note: have work and this is unwanted */
            "date": $scope.date,
            "sd": $scope.sd,
            "ed": $scope.ed,
        }
        console.log("obj: " + JSON.stringify(obj));

        httpFactory.post(api, obj).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            //console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                // console.log("data" + JSON.stringify(data.data))
                // $window.location.href = $scope.propertyJson.R082;
                var loginAlert = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/html/templates/dashboardsuccess.html',
                    windowClass: 'show',
                    backdropClass: 'static',
                    keyboard: false,
                    controller: function ($scope, $uibModalInstance) {
                      $scope.message = "Successfully sent the event";
                    }
                  })
               // alert("Successfully sent the event");
                // vm.events.splice(0, 1);
                var eventPostedData = data.data.data;
                console.log("eventPostedData: " + JSON.stringify(eventPostedData));
                $state.go('dashboard.upcomingEvent');
                //$scope.eventGet();
            }
            else {
                var loginAlert = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/html/templates/dashboardwarning.html',
                    windowClass: 'show',
                    backdropClass: 'static',
                    keyboard: false,
                    controller: function ($scope, $uibModalInstance) {
                      $scope.message = "Event Send Failed, try again ";
                    }
                  })
               // alert("Event Send Failed");
            }
        })
        console.log("<--eventSend");
    }

    $scope.timeTableForEventBook = function (day, id) {
        console.log("timeTableForEventBook-->");
        console.log("id: " + id + " day: " + day);
        console.log("$scope.teacherPersonalData[0].timeTable[0].timing[id].startsAt: " + $scope.teacherPersonalData[0].timeTable[0].timing[id].startsAt);
        console.log("$scope.teacherPersonalData[0].timeTable[0].timing[id].endsAt: " + $scope.teacherPersonalData[0].timeTable[0].timing[id].endsAt);

        var sd = $scope.teacherPersonalData[0].timeTable[0].timing[id].startsAt;
        var ed = $scope.teacherPersonalData[0].timeTable[0].timing[id].endsAt;
        console.log("sd: " + sd + " ed: " + ed);
        $scope.startDate = $filter('date')($scope.selectedDate, "EEE MMM dd y");
        $scope.startTime = $filter('date')(sd, "h:mm:ss a");
        $scope.EndTime = $filter('date')(ed, "h:mm:ss a");
        console.log("startDate: " + $scope.startDate + " startTime: " + $scope.startTime + " EndTime: " + $scope.EndTime);
        var resultedStartDate = $scope.startDate + ' ' + $scope.startTime;
        var resultedEndDate = $scope.startDate + ' ' + $scope.EndTime;
        console.log("resultedStartDate: " + resultedStartDate);
        console.log("resultedEndDate: " + resultedEndDate);
        var rsd = new Date(resultedStartDate);
        var red = new Date(resultedEndDate);
        var PersonalRemoteCombineCal = ownerEvents.concat(remoteEvent);

        var reqDate = rsd.getDate() - 1;
        var reqMonth = rsd.getMonth();
        var reqYear = rsd.getFullYear();
        var reqHr = rsd.getHours();
        var reqMin = rsd.getMinutes();
        var reqSec = rsd.getSeconds();
        var consolidateDate = new Date(reqYear, reqMonth, reqDate, reqHr, reqMin, reqSec);
        console.log("consolidateDate: " + consolidateDate + " $scope.todayDate: " + $scope.todayDate);
        if (consolidateDate > $scope.todayDate) {

            var conflicts = PersonalRemoteCombineCal.some(function (event) {
                //   return (event.startsAt <= s && s <= event.endsAt) ||event.startsAt <= e && e <= event.endsAt || s <= event.startsAt && event.startsAt <= e ||s <= event.endsAt && event.endsAt <= e});
                return (event.startsAt <= rsd && rsd < event.endsAt) ||
                    event.startsAt < red && red < event.endsAt ||
                    rsd <= event.startsAt && event.startsAt < red ||
                    rsd < event.endsAt && event.endsAt < red
            });
            console.log("conflicts: " + conflicts);
            if (conflicts) {
                console.log("conflicts is there");
                var loginAlert = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/html/templates/dashboardwarning.html',
                    windowClass: 'show',
                    backdropClass: 'static',
                    keyboard: false,
                    controller: function ($scope, $uibModalInstance) {
                      $scope.message = "On this time one of you is not free, try other time";
                    }
                  })
                
              //  alert("On this time one of you is not free, try other time");
            }
            else {
                $('#timeTable_modal').modal('hide');

                var id = $state.params.id;
                var reqDateWithoutMinus = rsd.getDate();
                var reqBy5min = rsd.getMinutes() + 5;
                var reqHr_ed = red.getHours();
                var reqMin_ed = red.getMinutes() - 5;
                var reqSec_ed = red.getSeconds();
                var rsd_alt = new Date(reqYear, reqMonth, reqDateWithoutMinus, reqHr, reqBy5min, reqSec);
                var red_alt = new Date(reqYear, reqMonth, reqDateWithoutMinus, reqHr_ed, reqMin_ed, reqSec_ed);
                console.log("rsd: " + rsd);
                console.log("rsd_alt: " + rsd_alt);
                console.log("red: " + red);
                console.log("red_alt: " + red_alt);

                var api = "https://vc4all.in/vc/getEventById" + "/" + id;
                //var api = "http://localhost:5000/vc/eventGet"+ "/" + id;;
                $scope.calendarOwner = "Your";
                httpFactory.get(api).then(function (data) {
                    var checkStatus = httpFactory.dataValidation(data);
                    console.log("data--" + JSON.stringify(data.data));
                    if (checkStatus) {
                        var rescheduleData = data.data.data;
                        console.log("rescheduleData: " + JSON.stringify(rescheduleData));

                        dayEventmodal = $uibModal.open({
                            scope: $scope,
                            templateUrl: '/html/templates/reschedule.html',
                            windowClass: 'show',
                            backdropClass: 'show',
                            controller: function ($scope, $uibModalInstance) {
                                var dt = new Date();
                                $scope.eventDetails = {
                                    "startsAt": rsd_alt,
                                    "endsAt": red_alt,
                                    "name": rescheduleData[0].student_Name,
                                    "stud_id": rescheduleData[0].student_id,
                                    "stud_class": rescheduleData[0].student_cs[0].class,
                                    "stud_section": rescheduleData[0].student_cs[0].section
                                }
                                console.log("$scope.eventDetails: " + JSON.stringify($scope.eventDetails));
                            }
                        })
                    }
                    else {

                    }
                })





            }
        }
        else {
            $('#timeTable_modal').modal('hide');
            var loginAlert = $uibModal.open({
                scope: $scope,
                templateUrl: '/html/templates/dashboardwarning.html',
                windowClass: 'show',
                backdropClass: 'static',
                keyboard: false,
                controller: function ($scope, $uibModalInstance) {
                  $scope.message = "Sorry you have to book the event 24Hrs before of your current date";
                }
              })
           // alert("Sorry you have to book the event 24Hrs before of your current date");
        }
        console.log("<--timeTableForEventBook");
    }





    var vm = this;
    //These variables MUST be set as a minimum for the calendar to work
    // vm.calendarView = 'month';
    // vm.viewDate = new Date();
    vm.calendarView = 'month';
    vm.viewDate = moment().startOf('day').toDate();
    var originalFormat = calendarConfig.dateFormats.hour;
    calendarConfig.dateFormats.hour = 'HH:mm';

    var actions = [{
        // label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
        label: 'Edit',
        onClick: function (args) {
          //  alert("Edit Event Comming Soon");
            console.log("args.calendarEvent: " + args.calendarEvent);
            console.log("JSON args.calendarEvent: " + JSON.stringify(args.calendarEvent));
            // var eClicked = $uibModal.open({
            //   scope: $scope,
            //   templateUrl: '/html/templates/eventDetails_edit.html',
            //   windowClass: 'show',
            //   backdropClass: 'show',
            //   controller: function ($scope, $uibModalInstance) {
            //     $scope.eventDetails = args.calendarEvent;
            //     console.log("$scope.eventDetails: " + $scope.eventDetails);
            //   }
            // })

        }
    }, {
        // label: '<i class=\'glyphicon glyphicon-remove\'></i>',
        label: 'Delete',
        onClick: function (args) {
          //  alert("Delete Event Comming Soon");
            console.log("args: " + args);
            // alert.show('Deleted', args.calendarEvent);
        }
    }];
    vm.events = [
        // {
        //   title: 'An event',
        //   color: calendarConfig.colorTypes.warning,
        //   startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate('2018-03-21T05:30:00.000Z'),
        //   endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
        //   draggable: true,
        //   resizable: true,
        //   actions: actions
        // }

    ];

    vm.cellIsOpen = true;

    vm.addEvent = function () {
        console.log("addEvent-->");
        vm.events.splice(0, 0, {
            title: 'New event',
            startsAt: moment().startOf('day').toDate(),
            endsAt: moment().endOf('day').toDate(),
            color: calendarConfig.colorTypes.important,
            draggable: true,
            resizable: true
        });
        // vm.events.push({
        //   title: 'New event',
        //   startsAt: moment().startOf('day').toDate(),
        //   endsAt: moment().endOf('day').toDate(),
        //   color: calendarConfig.colorTypes.important,
        //   draggable: true,
        //   resizable: true
        // });
    };

    // $scope.eventDetailClick = function (index) {
    //   console.log("eventDetailClick--> ");
    //   var evtData = vm.events[index];
    //   var eventSenderLoginType = evtData.senderLoginType;
    //   var receiverId = evtData.remoteCalendarId;
    //   console.log("$scope.evtData: " + JSON.stringify($scope.evtData));
    //   console.log("eventSenderLoginType: " + eventSenderLoginType);
    //   console.log("receiverId: "+receiverId);
    //   var eClicked = $uibModal.open({
    //     scope: $scope,
    //     templateUrl: '/html/templates/eventDetails.html',
    //     windowClass: 'show',
    //     backdropClass: 'show',
    //     controller: function ($scope, $uibModalInstance) {
    //       $scope.eventDetails = evtData;
    //       console.log("$scope.eventDetails: " + $scope.eventDetails);
    //     }
    //   })
    //   console.log("<--eventDetailClick");
    // }
    vm.eventClicked = function (event) {
        console.log("eventClicked-->");
        // alert("clicked: " + event);
        console.log("cliecked: " + JSON.stringify(event));
        $scope.evtData = event;
        console.log("$scope.evtData: " + JSON.stringify($scope.evtData));
        // $('#eDetail').trigger('click');
        var eClicked = $uibModal.open({
            scope: $scope,
            templateUrl: '/html/templates/eventDetails.html',
            windowClass: 'show',
            backdropClass: 'show',
            controller: function ($scope, $uibModalInstance) {
                $scope.eventDetails = event;
                console.log("$scope.eventDetails: " + JSON.stringify($scope.eventDetails));
            }
        })
        console.log("<--eventClicked");
    };

    $scope.eventClicked = function (event) {
        //alert("clicked: " + event);
        console.log("cliecked: " + event);
        //  alert.show('Clicked', event);
    };

    vm.eventEdited = function (event) {
       // alert("eventEdited");
        console.log("cliecked: " + event);
        // alert.show('Edited', event);
    };

    vm.eventDeleted = function (event) {
       // alert("eventDeleted");
        console.log("deleted");
        // alert.show('Deleted', event);
    };

    vm.eventTimesChanged = function (event) {
        //alert.show('Dropped or resized', event);
    };

    vm.toggle = function ($event, field, event) {
        $event.preventDefault();
        $event.stopPropagation();
        event[field] = !event[field];
    };
    vm.rangeSelected = function (startDate, endDate) {
        var s = startDate;
        var e = endDate;
        console.log("rangeSelected-->");
        console.log("startDate: " + startDate);
        console.log("endDate: " + endDate);
        var PersonalRemoteCombineCal = ownerEvents.concat(vm.events);
        console.log("PersonalRemoteCombineCal: " + JSON.stringify(PersonalRemoteCombineCal));
        var conflicts = PersonalRemoteCombineCal.some(function (event) {
            //   return (event.startsAt <= s && s <= event.endsAt) ||
            //   event.startsAt <= e && e <= event.endsAt ||
            //   s <= event.startsAt && event.startsAt <= e ||
            //   s <= event.endsAt && event.endsAt <= e
            // });
            return (event.startsAt <= s && s < event.endsAt) ||
                event.startsAt < e && e < event.endsAt ||
                s <= event.startsAt && event.startsAt < e ||
                s < event.endsAt && event.endsAt < e
        });
        console.log("conflicts: " + conflicts);
        if (conflicts) {
            console.log("conflicts is there");
            var loginAlert = $uibModal.open({
                scope: $scope,
                templateUrl: '/html/templates/dashboardwarning.html',
                windowClass: 'show',
                backdropClass: 'static',
                keyboard: false,
                controller: function ($scope, $uibModalInstance) {
                  $scope.message = "ON this time one of you is not free, try on other time";
                }
              })
            //alert("ON this time one of you is not free, try on other time");
        }
        else {
            console.log("No conflicts");
            dayEventmodal = $uibModal.open({
                scope: $scope,
                templateUrl: '/html/templates/dayEventBook.html',
                windowClass: 'show',
                backdropClass: 'show',
                controller: function ($scope, $uibModalInstance) {
                    // moment().startOf('day').toDate()
                    var dt = new Date();
                    $scope.eventDetails = {
                        "startsAt": startDate,
                        "endsAt": endDate
                    }
                    console.log("$scope.eventDetails: " + $scope.eventDetails);
                }
            })
        }
        // vm.lastDateClicked = date;
        // alert("date: "+moment(date).startOf('day')+"date*: "+moment().startOf('day'));
        // alert('Edited', args.calendarEvent);
        // console.log("args.calendarEvent: " + args.calendarEvent);
        // console.log("JSON args.calendarEvent: " + JSON.stringify(args.calendarEvent));

        // alert.show('Edited', args.calendarEvent);
        console.log("<--rangeSelected");
    };

    vm.timespanClicked = function (date, css) {
        console.log("timespanClicked-->");
        console.log("date: " + date);
        console.log("teacherPersonalData: " + JSON.stringify($scope.teacherPersonalData));
        $scope.selectedDateForEvent = $filter('date')(date, "EEE");
        console.log("selectedDateForEvent: " + $scope.selectedDateForEvent);
        $scope.selectedDate = date;
        $('#timeTable_modal').modal('show');

        // $scope.selectedDate = date;
        // if ($scope.remoteCalendarId) {
        //     $('#timeTable_modal').modal('show');

        // }
        // else {
        //     alert("Select Student");
        // }



        // if (vm.calendarView === 'month') {
        //   if ((vm.cellIsOpen && moment(date).startOf('day').isSame(moment(vm.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
        //     vm.cellIsOpen = false;
        //   } else {
        //     vm.cellIsOpen = true;
        //     vm.viewDate = date;
        //   }
        // } else if (vm.calendarView === 'year') {
        //   if ((vm.cellIsOpen && moment(date).startOf('month').isSame(moment(vm.viewDate).startOf('month'))) || cell.events.length === 0) {
        //     vm.cellIsOpen = false;
        //   } else {
        //     vm.cellIsOpen = true;
        //     vm.viewDate = date;
        //   }
        // }
        console.log("<--timespanClicked");

    };






})