app.controller('quickMsgCtl', function ($scope, $rootScope, $state, $rootScope, $compile, $window, $filter, httpFactory, sessionAuthFactory, moment, calendarConfig, $uibModal) {
    console.log("quickMsgCtl==>");

    var dayEventmodal; /* ### Note: open model for event send ###  */
    var studEvents = []; /* ### Note: selected student events ### */
    var teacherEvents = []; /* ### Note: selected teacher events ### */
    var ownerEvents = []; /* ### Note: logged in person all events ### */
    var remoteEvent = []; /* ### Note:receiver all events ### */
    $scope.timeForPeriods = $rootScope.TimeTable_timing;
    $scope.userData = sessionAuthFactory.getAccess();
    var schoolName = $scope.userData.schoolName;
    $scope.propertyJson = $rootScope.propertyJson;

    $scope.quickMsgGet = function () {
        console.log("eventGet-->");
        var id = $scope.userData.id
        var api = $scope.propertyJson.VC_quickMsgGet + "/" + id;
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
                        'userId': $scope.eventData[x].userId,
                        "senderLoginType": $scope.eventData[x].senderLoginType,
                        'title': $scope.eventData[x].title,
                        "reason": $scope.eventData[x].reason,
                        "senderName": $scope.eventData[x].senderName,
                        "senderId": $scope.eventData[x].senderId,
                        "senderMN": $scope.eventData[x].senderMN,
                        "receiverEmail": $scope.eventData[x].receiverEmail,
                        'startsAt': new Date($scope.eventData[x].date),
                        'color': $scope.eventData[x].primColor
                    }
                    if ($scope.eventData[x].messageType != 'wholeClass') {
                        obj.student_Name = $scope.eventData[x].student_Name;
                        obj.student_cs = $scope.eventData[x].student_cs;
                        obj.student_id = $scope.eventData[x].student_id;
                        obj.objdraggable = true;
                        obj.resizable = true;
                        obj.url = $scope.eventData[x].url;
                        obj.receiverName = $scope.eventData[x].receiverName;
                        obj.receiverId = $scope.eventData[x].receiverId;
                        obj.receiverMN = $scope.eventData[x].receiverMN;
                        obj.remoteCalendarId = $scope.eventData[x].remoteCalendarId;
                    }
                    else if ($scope.eventData[x].messageType == 'wholeClass') {
                        obj.messageType = $scope.eventData[x].messageType;
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
        var api = $scope.propertyJson.VC_getToDate;
        console.log("api: " + api);
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
                $scope.quickMsgGet();
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
                console.log("teacherData: " + JSON.stringify($scope.teacherData));
                console.log("teacherPersonalData: " + JSON.stringify($scope.teacherPersonalData));
            }
            else {
            }
        })
        console.log("<--getTeacherData");
    }

    $scope.getStudentData = function () {
        console.log("getTeacherData-->");
        var id = $scope.userData.id;
        var api = $scope.propertyJson.VC_studentDetail + "/" + id;
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
                var api = $scope.propertyJson.VC_getTeacherListForCS + "/" + schoolName + "/" + $scope.studClass + "/" + $scope.studSection;

                console.log("api: " + api);
                httpFactory.get(api).then(function (data) {
                    var checkStatus = httpFactory.dataValidation(data);
                    // console.log("data--" + JSON.stringify(data.data));
                    if (checkStatus) {
                        $scope.teacherListForStudent = data.data.data;
                        console.log("teacherListForStudent: " + JSON.stringify($scope.teacherListForStudent));
                        console.log("teacherListForStudent.length: " + $scope.teacherListForStudent.length);
                        for (var x = 0; x < $scope.teacherListForStudent.length; x++) {

                            for (var y = 0; y < $scope.teacherListForStudent[x].css.length; y++) {
                                console.log("$scope.teacherListForStudent[x]: " + JSON.stringify($scope.teacherListForStudent[x].css));
                                if ($scope.teacherListForStudent[x].css[y].class == $scope.studClass && $scope.teacherListForStudent[x].css[y].section == $scope.studSection)
                                    var un = $scope.teacherListForStudent[x].firstName + " " + $scope.teacherListForStudent[x].lastName;
                                $scope.teacherList.push({ "id": $scope.teacherListForStudent[x]._id, "name": un, "teacherId": $scope.teacherListForStudent[x].schoolId, "subject": $scope.teacherListForStudent[x].css[y].subject });
                                break;
                            }
                        }
                        console.log(" $scope.teacherList: " + JSON.stringify($scope.teacherList));
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
        var api = $scope.propertyJson.VC_teacherPersonalData + "/" + id;
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
        var api = $scope.propertyJson.VC_studentPersonalData + "/" + id;
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
        $scope.remoteCalendarId = css.id;
        if (css.id != 'all') {
            console.log("JSON.css" + JSON.stringify(css));
            $scope.remoteCalendarId = css.id;
            $scope.getSelectedStudentPersonalData($scope.remoteCalendarId);
            var api = $scope.propertyJson.VC_quickMsgGet + "/" + css.id;
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
                            'startsAt': new Date($scope.specificSED[x].date),
                            'draggable': true,
                            'resizable': true,
                            'actions': actions,
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
        }
        console.log("<--getStudentCalendar");
    }

    $scope.getTeacherCalendar = function (css) {
        console.log("getTeacherCalendar-->");
        console.log("css" + css.id);
        console.log("JSON.css" + JSON.stringify(css));
        $scope.remoteCalendarId = css.id;
        $scope.getSelectedTeacherPersonalData($scope.remoteCalendarId);
        var api = $scope.propertyJson.VC_quickMsgGet + "/" + css.id;
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
        // window.location.href = "https://norecruits.com";
    }

    $scope.getStudListForCS = function (css) {

        console.log("getStudListForCS-->");
        // console.log("$scope.cssSelect: "+JSON.stringify($scope.cssSelect));
        console.log("css" + css);
        console.log("JSON.css" + JSON.stringify(css));
        $scope.class = css.class;
        $scope.section = css.section;;
        var clas = css.class;
        var section = css.section;
        $scope.studList = [];
        $scope.allStudentEmailIds = [];
        var api = $scope.propertyJson.VC_getStudListForCS + "/" + schoolName + "/" + clas + "/" + section;
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            if (checkStatus) {
                $scope.studentList = data.data.data;
                console.log("studentList: " + JSON.stringify($scope.studentList));
                for (var x = 0; x < $scope.studentList.length; x++) {
                    $scope.studList.push({ "id": $scope.studentList[x]._id, "name": $scope.studentList[x].firstName, "studId": $scope.studentList[x].schoolId });
                    $scope.allStudentEmailIds.push($scope.studentList[x].parentEmail);
                    if ($scope.studentList[x].motherEmail) {
                        $scope.allStudentEmailIds.push($scope.studentList[x].motherEmail);
                    }
                }
                console.log(" $scope.studList.length: " + $scope.studList.length);
                if ($scope.studList.length > 0) {
                    $scope.studList.push({ "id": "all", "name": "All", "studId": "Students" });
                }
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

    $scope.saveQuickMsg = function (title, reason) {
        console.log("saveQuickMsg-->");
        $scope.title = title;
        if ($scope.userLoginType == 'studParent') {
            var un = $scope.studentData[0].firstName + " " + $scope.studentData[0].lastName;
            var teacherName = $scope.teacherPersonalData[0].firstName + " " + $scope.teacherPersonalData[0].lastName;
            var senderName = un;
            var stud_name = un;
            var stud_cs = $scope.studentData[0].cs;
            var stud_id = $scope.studentData[0].schoolId;
            var senderMN = $scope.studentData[0].mobileNum;
            var studId = $scope.studentData[0].schoolId;
            var email = $scope.teacherPersonalData[0].email;/* ### Note: teacher email Id ### */
            var receiverName = teacherName;
            var receiverId = $scope.teacherPersonalData[0].schoolId;
            var receiverMN = $scope.teacherPersonalData[0].mobNumber;
            var studUserId = $scope.userData.id;
            $scope.quickMsgSend(reason, senderName, studId, studUserId, email, senderMN, receiverName, receiverId, receiverMN, stud_id, stud_cs, stud_name);
        }
        if ($scope.userLoginType == 'teacher') {
            var un = $scope.teacherData[0].firstName + " " + $scope.teacherData[0].lastName;
            var senderMN = $scope.teacherData[0].mobNumber;
            var teacherId = $scope.teacherData[0].schoolId;
            if ($scope.remoteCalendarId != 'all') {
                console.log("$scope.studentPersonalData[0]: " + JSON.stringify($scope.studentPersonalData[0]));
                var studName = $scope.studentPersonalData[0].firstName + " " + $scope.studentPersonalData[0].lastName;
                var teacherName = un;
                if ($scope.studentPersonalData[0].motherEmail) {
                    var email = $scope.studentPersonalData[0].parentEmail + "," + $scope.studentPersonalData[0].motherEmail;
                }
                var email = $scope.studentPersonalData[0].parentEmail;/* ### Note: parentEmail email Id ### */
                var receiverName = studName;
                var receiverId = $scope.studentPersonalData[0].schoolId;
                var receiverMN = $scope.studentPersonalData[0].mobileNum;
                var stud_name = studName;
                var stud_cs = $scope.studentPersonalData[0].cs;
                var stud_id = $scope.studentPersonalData[0].schoolId;
                var studUserId = $scope.studentPersonalData[0]._id;
                console.log("$scope.studentPersonalData[0]: " + $scope.studentPersonalData[0].schoolId);
                console.log("stud_id: " + stud_id);
                $scope.quickMsgSend(reason, teacherName, teacherId, studUserId, email, senderMN, receiverName, receiverId, receiverMN, stud_id, stud_cs, stud_name);
            }
            else {

                console.log("eventSend to all parents-->");
                var un = $scope.teacherData[0].firstName + " " + $scope.teacherData[0].lastName;
                $('#quickMsg_modal').modal('hide');
                var api = $scope.propertyJson.VC_bulkEmail_quickMsg;
                //var api = "http://localhost:5000/vc/eventSend";
                console.log("api: " + api);
                // var email = document.getElementById('eventEmails').value;
                var obj = {
                    "userId": $scope.userData.id,
                    "senderLoginType": $scope.userData.loginType,
                    "title": title,
                    "reason": reason,
                    "senderName": un,
                    "senderId": teacherId,
                    "senderMN": senderMN,
                    "receiverEmail": $scope.allStudentEmailIds,
                    "date": $scope.selectedDate_quickMsg,
                    "primColor": "red",
                    "messageType": "wholeClass",
                    "cs": [{ "class": $scope.class, "section": $scope.section }],
                    "schoolName": schoolName
                }
                console.log("obj: " + JSON.stringify(obj));
                httpFactory.post(api, obj).then(function (data) {
                    var checkStatus = httpFactory.dataValidation(data);
                    if (checkStatus) {
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
                        // var quickMsgPostedData = data.data.data;
                        var objData = {
                            'id': obj.userId,
                            'title': obj.title,
                            'color': obj.primColor,
                            'startsAt': $filter('date')($scope.selectedDate_quickMsg, "h:mm a"),
                            'endsAt': $filter('date')($scope.selectedDate_quickMsg, "h:mm a"),
                            'draggable': true,
                            'resizable': true,
                            "reason": obj.reason,
                            "senderName": name,
                            "senderId": $scope.userData.id,
                            "senderMN": senderMN,
                            "receiverEmail": $scope.allStudentEmailIds,

                            /*  */
                        }
                        ownerEvents.push(objData);
                        vm.events.push(objData);
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
                    }
                })

            }
        }
    }

    $scope.quickMsgSend = function (res, name, id, studUserId, email, senderMN, receiverName, receiverId, receiverMN, stud_id, stud_cs, stud_name) {
        console.log("eventSend-->");
        $('#quickMsg_modal').modal('hide');
        var api = $scope.propertyJson.VC_quickMsgSend;
        //var api = "http://localhost:5000/vc/eventSend";
        console.log("api: " + api);
        // var email = document.getElementById('eventEmails').value;
        var obj = {
            "userId": $scope.userData.id,
            "senderLoginType": $scope.userData.loginType,
            "title": $scope.title,
            "reason": res,
            "studUserId": studUserId,
            "senderName": name,
            "senderId": id,
            "senderMN": senderMN,
            "receiverEmail": email,
            "date": $scope.selectedDate_quickMsg,
            "primColor": "red",
            "receiverName": receiverName,
            "receiverId": receiverId,
            "receiverMN": receiverMN,
            "remoteCalendarId": $scope.remoteCalendarId,
            "student_cs": stud_cs,
            "student_id": stud_id,
            "student_Name": stud_name,
            "schoolName": schoolName
        }
        console.log("obj: " + JSON.stringify(obj));

        httpFactory.post(api, obj).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            if (checkStatus) {
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
                $rootScope.$broadcast("SiblingMethod_quickMsgGet", {});
                // var quickMsgPostedData = data.data.data;
                var objData = {
                    'id': obj.userId,
                    'title': obj.title,
                    'color': obj.primColor,
                    'startsAt': $filter('date')($scope.selectedDate_quickMsg, "h:mm a"),
                    'endsAt': $filter('date')($scope.selectedDate_quickMsg, "h:mm a"),
                    'draggable': true,
                    'resizable': true,
                    'actions': actions,
                    'url': obj.url,
                    "reason": res,
                    "senderName": name,
                    "senderId": id,
                    "senderMN": senderMN,
                    "receiverEmail": email,
                    "receiverName": receiverName,
                    "receiverId": receiverId,
                    "receiverMN": receiverMN,
                    /*  */
                }
                ownerEvents.push(objData);
                vm.events.push(objData);
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
            }
        })
        console.log("<--eventSend");
    }


    var vm = this;
    vm.calendarView = 'month';
    vm.viewDate = moment().startOf('day').toDate();
    var originalFormat = calendarConfig.dateFormats.hour;
    calendarConfig.dateFormats.hour = 'HH:mm';
    if ($scope.userData.loginType == 'teacher') {
        var actions = [];
    }
    vm.events = [];
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

    };

    vm.eventClicked = function (event) {
        console.log("eventClicked-->");
        // alert("clicked: " + event);
        console.log("cliecked: " + JSON.stringify(event));
        $scope.evtData = event;
        console.log("$scope.evtData: " + JSON.stringify($scope.evtData));
        // $('#eDetail').trigger('click');
        var eClicked = $uibModal.open({
            scope: $scope,
            templateUrl: '/html/templates/quickMsg.html',
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
        // alert("clicked: " + event);
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
        // alert.show('Dropped or resized', event);
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
                    $scope.message = "ON this time any one of you not free,try other time";
                }
            })
            // alert("ON this time any one of you not free,try on other time");
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
        console.log("<--rangeSelected");
    };

    vm.timespanClicked = function (date, css) {
        console.log("timespanClicked-->");
        console.log("date: " + date);
        console.log("teacherPersonalData: " + JSON.stringify($scope.teacherPersonalData));
        $scope.selectedDate_quickMsg = $filter('date')(date, "MMM d, y");
        $scope.selectedDateForEvent = $filter('date')(date, "EEE");
        console.log("selectedDateForEvent: " + $scope.selectedDateForEvent);
        console.log(" $scope.todayDate: " + $filter('date')($scope.todayDate, "MMM d, y") + " date: " + $filter('date')(date, "MMM d, y"));
        $scope.selectedDate = date;
        if ($scope.remoteCalendarId) {
            var today = $filter('date')($scope.todayDate, "MMM d, y");
            var clickedToday = $filter('date')(date, "MMM d, y");
            if (today == clickedToday) {
                $('#quickMsg_modal').modal('show');
            }
            else {
                var loginAlert = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/html/templates/dashboardwarning.html',
                    windowClass: 'show',
                    backdropClass: 'static',
                    keyboard: false,
                    controller: function ($scope, $uibModalInstance) {
                        $scope.message = "Sorry! you can send message only on current date";
                    }
                })
            }

        }
        else {
            if ($scope.userData.loginType == 'teacher') {
                var loginAlert = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/html/templates/dashboardwarning.html',
                    windowClass: 'show',
                    backdropClass: 'static',
                    keyboard: false,
                    controller: function ($scope, $uibModalInstance) {
                        $scope.message = "Select Student";
                    }
                })
                console.log("$scope.eventDetails: " + JSON.stringify($scope.eventDetails));
            }
            else {
                var loginAlert = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/html/templates/dashboardwarning.html',
                    windowClass: 'show',
                    backdropClass: 'static',
                    keyboard: false,
                    controller: function ($scope, $uibModalInstance) {
                        $scope.message = "Select Teacher";
                        console.log("$scope.eventDetails: " + JSON.stringify($scope.eventDetails));
                    }
                })
            }
        }
    }

    console.log("<--timespanClicked");
})