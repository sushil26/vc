app.controller('incomingMsgCtl', function ($scope, $rootScope, $state, $window, httpFactory, $uibModal, $filter, sessionAuthFactory) {
    console.log("incomingMsgCtl==>");
    $scope.userData = sessionAuthFactory.getAccess("userData");
    $scope.loginType = $scope.userData.loginType;
    $scope.events = [];
    var ownerEvents = [];
    $scope.propertyJson = $rootScope.propertyJson;

    $scope.getSelectedStudentPersonalData = function () {
        console.log("get Selected Student PersonalData-->");
        var id = $scope.userData.id;
        var api = $scope.propertyJson.VC_studentPersonalData + "/" + id;
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            // console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.studentPersonalData = data.data.data;
                $scope.studCS = $scope.studentPersonalData[0].cs;
                console.log("  $scope.studCS: " + JSON.stringify($scope.studCS));
                console.log("$scope.studentPersonalData: " + JSON.stringify($scope.studentPersonalData));
                $scope.quickMsgGet();
            }
            else {
                //alert("Event get Failed");
            }

        })
        console.log("<--get Selected Student PersonalData");
    }

    $scope.getToDate = function () {
        console.log("Get To Date-->");
        var api = $scope.propertyJson.VC_getToDate;
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

            }
            else {
            }
        })
        console.log("<--Get To Date");
    }
    $scope.getToDate();

    $scope.quickMsgGet = function () {
        console.log("quickMsgGet-->");
        $scope.events = [];
        var id = $scope.userData.id;
        console.log("$scope.studCS: " + JSON.stringify($scope.studCS));
        if ($scope.loginType == 'studParent') {
            var clas = $scope.studCS[0].class;
            var section = $scope.studCS[0].section;
            var api = $scope.propertyJson.VC_quickMsgGetForStud + "/" + id + "/" + clas + "/" + section;
        }
        else if ($scope.loginType == 'teacher') {
            var api = $scope.propertyJson.VC_quickMsgGet + "/" + id;
        }

        //var api = "http://localhost:5000/vc/eventGet"+ "/" + id;;
        $scope.calendarOwner = "Your";

        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.eventData = data.data.data;

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
                        'color': $scope.eventData[x].primColor,
                        "notificationNeed": $scope.eventData[x].notificationNeed
                    }
                    if ($scope.eventData[x].messageType != 'wholeClass') {
                        obj.student_Name = $scope.eventData[x].student_Name;
                        obj.student_cs = $scope.eventData[x].student_cs;
                        obj.student_id = $scope.eventData[x].student_id;
                        obj.objdraggable = true;
                        obj.resizable = true;
                        obj.receiverEmail = $scope.eventData[x].receiverEmail;
                        obj.receiverName = $scope.eventData[x].receiverName;
                        obj.receiverId = $scope.eventData[x].receiverId;
                        obj.receiverMN = $scope.eventData[x].receiverMN;
                        obj.remoteCalendarId = $scope.eventData[x].remoteCalendarId;
                    }
                    else if ($scope.eventData[x].messageType == 'wholeClass') {
                        obj.messageType = $scope.eventData[x].messageType;
                        obj.student_cs = $scope.eventData[x].student_cs
                    }
                    if ($scope.eventData[x].notificationNeed == 'yes') {
                        $scope.numberOfNotif = $scope.numberOfNotif + 1;
                    }
                    console.log("obj*" + JSON.stringify(obj))
                    // ownerEvents.push(obj);
                    $scope.events.push(obj);
                }
            }
            else {
                //alert("Event get Failed");
            }
        })
    }

    if ($scope.loginType == 'studParent') {
        $scope.getSelectedStudentPersonalData();

    }
    else {

        $scope.quickMsgGet();
    }

    $scope.viewDetail = function (id, eventId, userId) {
        console.log("viewDetail-->");
        console.log("id: " + id);
        console.log("userId: " + userId);
        if ($scope.events[id].notificationNeed == 'yes') {
            socket.emit('quickMsg_viewDetail_toserver', { "userId": userId }); /* ### Note: Informing to server that this event is viewed (so that server can inform to respective person) ### */
            if ($scope.events[id].userId != $scope.userData.id) {
                var obj = {
                    "id": eventId
                }
                var api = $scope.propertyJson.VC_quickMsgNotificationOff;
                console.log("api: " + api);
                httpFactory.post(api, obj).then(function (data) {
                    var checkStatus = httpFactory.dataValidation(data);
                    console.log("data--" + JSON.stringify(data.data));
                    $rootScope.$emit("CallParent_quickMsgGet", {}); /* ### Note: calling method of parentController(dashboardCtr) ### */
                    // $scope.$parent.quickMsgGet();
                    if (checkStatus) {
                        console.log("data" + JSON.stringify(data.data));
                        var eventPostedData = data.data.data;
                    }
                    else {
                        // alert("UnSuccessfully Event Updated");
                    }
                })
                $scope.events[id].notificationNeed = 'No';
            }
        }

        var eClicked = $uibModal.open({
            scope: $scope,
            templateUrl: '/html/templates/quickMsgView.html',
            windowClass: 'show',
            backdropClass: 'show',
            controller: function ($scope, $uibModalInstance) {
                $scope.eventDetails = $scope.events[id];
                $scope.viewType = "incoming";
                console.log("$scope.eventDetails: " + JSON.stringify($scope.eventDetails));
            }
        })

        console.log("<--viewDetail");
    }

    /* ### Start: Get quickMsg update from quickMsg.js(quickMsgSend method)  ### */  //update the value with new data;
    socket.on('quickMsg_updated', function (data) {
        console.log("quickMsg_updated-->: " + JSON.stringify(data));
        console.log("$scope.userData.id: " + $scope.userData.id);
        if (data.id == $scope.userData.id || data.remoteId == $scope.userData.id) {
            $rootScope.$emit("CallParent_quickMsgGet", {}); /* ### Note: calling method of parentController(dashboardCtr) ### */
            if ($scope.loginType == 'studParent') {
                $scope.getSelectedStudentPersonalData();
            }
            else {
                $scope.quickMsgGet();
            }
        }
    });
    /* ### End: Get quickMsg update from quickMsg.js(quickMsgSend method) ### */




})