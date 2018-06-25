app.controller('outgoingMsgCtl', function ($scope, $rootScope, $state, $window, httpFactory, $uibModal, $filter, sessionAuthFactory) {
    console.log("outgoingMsgCtl==>");
    $scope.userData = sessionAuthFactory.getAccess("userData");
    $scope.loginType = $scope.userData.loginType;
    $scope.events = [];
    $scope.propertyJson = $rootScope.propertyJson;

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
                $scope.quickMsgGet();
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
        var api = $scope.propertyJson.VC_quickMsgGet + "/" + id;
        //var api = "http://localhost:5000/vc/eventGet"+ "/" + id;;
        $scope.calendarOwner = "Your";

        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.eventData = data.data.data;

                // ownerEvents = [];
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
                    // ownerEvents.push(obj);
                    $scope.events.push(obj);
                }
            }
            else {
                //alert("Event get Failed");
            }
        })
    }

    $scope.viewDetail = function (id) {
        console.log("viewDetail-->");
        console.log("id: " + id);
        var eClicked = $uibModal.open({
            scope: $scope,
            templateUrl: '/html/templates/quickMsgView.html',
            windowClass: 'show',
            backdropClass: 'show',
            controller: function ($scope, $uibModalInstance) {
                $scope.eventDetails = $scope.events[id];
                $scope.viewType = "outgoing";
                console.log("$scope.eventDetails: " + JSON.stringify($scope.eventDetails));
            }
        })
        console.log("<--viewDetail");
    }

    /* ### Start: Get quickMsg update from quickMsg.js(quickMsgSend method)  ### */  //update the value with new data;
    socket.on('quickMsg_updated', function (data) {
        console.log("data: " + JSON.stringify(data));
        if (data.id == $scope.userData.id || data.remoteId == $scope.userData.id) {
            $rootScope.$emit("CallParent_quickMsgGet", {}); /* ### Note: calling method of parentController(dashboardCtr) ### */
            $scope.quickMsgGet();
        }
    });
    /* ### End: Get quickMsg update from quickMsg.js(quickMsgSend method) ### */

    /* ### Start: Get event update from index.js  ### *///update the client with new data;
    socket.on('quickMsg_viewDetail_toSender', function (data) {
        console.log("****quickMsg_viewDetail_toSender-->: "+JSON.stringify(data));
        if ($scope.userData.id == data.userId) {
            console.log("start calling quickMsgGet");
            $scope.quickMsgGet();
        }
    })
    /* ### End: Get event update from index.js  ### */

})