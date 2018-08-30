careatorApp.controller('careator_upcomingEventCtr', function ($scope, $rootScope, $state, $window, careatorHttpFactory, $uibModal, $filter, careatorSessionAuth, SweetAlert, $interval) {
    console.log("upcomingEventController==>");
    $scope.userData = careatorSessionAuth.getAccess("userData");
    $scope.loginType = $scope.userData.loginType;
    $scope.events = [];
    $scope.propertyJson = $rootScope.propertyJson;
    $scope.numberOfNotif = 0;
    $scope.eventGet = function () {
        console.log("eventGet-->");
        var id = $scope.userData.userId
        var api = "https://norecruits.com/careator_eventSchedule/careator_eventGetById/" + id;
        //var api = "http://localhost:5000/vc/eventGet"+ "/" + id;;
        $scope.calendarOwner = "Your";
        console.log("api: " + api);
        careatorHttpFactory.get(api).then(function (data) {
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.eventData = data.data.data;
                // vm.events = [];
                ownerEvents = [];
                for (var x = 0; x < $scope.eventData.length; x++) {
                    console.log("$scope.eventData[" + x + "]: " + JSON.stringify($scope.eventData[x]));
                    var obj = {
                        'id': $scope.eventData[x]._id,
                        "senderId": $scope.eventData[x].senderId,
                        "senderName": $scope.eventData[x].senderName,
                        "senderEmail": $scope.eventData[x].senderEmail,
                        "title": $scope.eventData[x].title,
                        "reason": $scope.eventData[x].reason,
                        "invite": $scope.eventData[x].invite,
                        "formatedStartTime": $scope.eventData[x].formatedStartTime,
                        "formatedEndTime": $scope.eventData[x].formatedEndTime,
                        "startsAt": new Date($scope.eventData[x].startsAt),
                        "endsAt": new Date($scope.eventData[x].endsAt),
                        "primColor": $scope.eventData[x].primColor,
                        "sessionURL": $scope.eventData[x].sessionURL,
                        "date": $scope.eventData[x].date,

                    }
                    console.log(" obj" + JSON.stringify(obj));

                    if ($scope.eventData[x].notificationNeed == 'yes') {
                        if ($scope.eventData[x].userId != $scope.userData.id) {
                            console.log("not equal");
                            $scope.numberOfNotif = $scope.numberOfNotif + 1;
                        }
                    }
                    console.log("$scope.numberOfNotif: " + $scope.numberOfNotif);
                    console.log(" obj" + JSON.stringify(obj))
                    // ownerEvents.push(obj);
                    $scope.events.push(obj);
                }
                console.log(" $scope.events: " + JSON.stringify($scope.events));
            } else {
                //alert("Event get Failed");
            }
        })
    }
    $scope.getToDate = function () {
        console.log("Get To Date-->");
        var api = "https://norecruits.com/careator_getToDate/careator_getToDate";
        careatorHttpFactory.get(api).then(function (data) {
            var checkStatus = careatorHttpFactory.dataValidation(data);
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
            } else {}
        })
        console.log("<--Get To Date");
    }
    $scope.getToDate();
    getToDateByEachSec = function () {
        //console.log("Get To Date-->");
        var api = "https://norecruits.com/careator_getToDate/careator_getToDate";
        careatorHttpFactory.get(api).then(function (data) {
            var checkStatus = careatorHttpFactory.dataValidation(data);
            //console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
               // console.log("data.data.data.date: " + data.data.data.date);
                var todayDate = new Date(data.data.data.date);
                //console.log("todayDate: " + todayDate);
                var reqDate = todayDate.getDate();
                //console.log("reqDate: " + reqDate);
                var reqMonth = todayDate.getMonth();
                var reqYear = todayDate.getFullYear();
                var reqHr = todayDate.getHours();
                var reqMin = todayDate.getMinutes();
                var reqSec = todayDate.getSeconds();
                $scope.todayDate = new Date(reqYear, reqMonth, reqDate, reqHr, reqMin, reqSec);
                //console.log("consolidateDate: " + $scope.consolidateDate);
            } else {}
        })
        console.log("<--Get To Date");
    }
    getToDateByEachSec();

    $interval(getToDateByEachSec, 1000);
   


    // $scope.eventGet = function () {
    //     console.log("eventGet-->");
    //     $scope.events = [];
    //     var id = $scope.userData.id;
    //     var api = $scope.propertyJson.VC_eventGet + "/" + id;
    //     //var api = "http://localhost:5000/vc/eventGet"+ "/" + id;;
    //     $scope.calendarOwner = "Your";
    //     careatorHttpFactory.get(api).then(function (data) {
    //         var checkStatus = careatorHttpFactory.dataValidation(data);
    //         console.log("data--" + JSON.stringify(data.data));
    //         if (checkStatus) {
    //             $scope.eventData = data.data.data;
    //             // ownerEvents = [];
    //             for (var x = 0; x < $scope.eventData.length; x++) {
    //                 console.log("$scope.eventData[" + x + "]: " + JSON.stringify($scope.eventData[x]));
    //                 var obj = {
    //                     'id': $scope.eventData[x]._id,
    //                     'userId': $scope.eventData[x].userId,
    //                     'studUserId': $scope.eventData[x].studUserId,
    //                     "student_cs": $scope.eventData[x].student_cs,
    //                     "student_id": $scope.eventData[x].student_id,
    //                     "student_Name": $scope.eventData[x].student_Name,
    //                     'title': $scope.eventData[x].title,
    //                     'color': $scope.eventData[x].primColor,
    //                     'startsAt': new Date($scope.eventData[x].start),
    //                     'endsAt': new Date($scope.eventData[x].end),
    //                     'draggable': true,
    //                     'resizable': true,
    //                     'url': $scope.eventData[x].url,
    //                     "senderName": $scope.eventData[x].senderName,
    //                     "senderId": $scope.eventData[x].senderId,
    //                     "senderMN": $scope.eventData[x].senderMN,
    //                     "senderLoginType": $scope.eventData[x].senderLoginType,
    //                     "title": $scope.eventData[x].title,
    //                     "reason": $scope.eventData[x].reason,
    //                     "receiverEmail": $scope.eventData[x].receiverEmail,
    //                     "receiverName": $scope.eventData[x].receiverName,
    //                     "receiverId": $scope.eventData[x].receiverId,
    //                     "receiverMN": $scope.eventData[x].receiverMN,
    //                     "remoteCalendarId": $scope.eventData[x].remoteCalendarId,
    //                     "notificationNeed": $scope.eventData[x].notificationNeed
    //                 }
    //                 console.log("$scope.eventData[x].userId: " + $scope.eventData[x].userId + " $scope.userData.id: " + $scope.userData.id);
    //                 if ($scope.eventData[x].notificationNeed == 'yes') {
    //                     if ($scope.eventData[x].userId != $scope.userData.id) {
    //                         console.log("not equal");
    //                         $scope.numberOfNotif = $scope.numberOfNotif + 1;
    //                     }
    //                 }
    //                 console.log("$scope.numberOfNotif: " + $scope.numberOfNotif);
    //                 console.log(" obj" + JSON.stringify(obj))
    //                 // ownerEvents.push(obj);
    //                 $scope.events.push(obj);
    //             }
    //         }
    //         else {
    //             //alert("Event get Failed");
    //         }
    //     })
    // }

    $scope.viewDetail = function (id, eventId, userId) {
        console.log("viewDetail-->");
        console.log("id: " + id);
        // if ($scope.events[id].notificationNeed == 'yes') {
        //     socket.emit('event_viewDetail_toserver', { "userId": userId }); /* ### Note: Informing to server that this event is viewed (so that server can inform to respective person) ### */
        //     if ($scope.events[id].userId != $scope.userData.id) {
        //         var obj = {
        //             "id": eventId
        //         }
        //         var api = $scope.propertyJson.VC_eventNotificationOff;
        //         console.log("api: " + api);
        //         careatorHttpFactory.post(api, obj).then(function (data) {
        //             var checkStatus = careatorHttpFactory.dataValidation(data);
        //             console.log("data--" + JSON.stringify(data.data));

        //             $rootScope.$emit("CallParent_eventGet", {}); /* ### Note: calling method of parentController(dashboardCtr) ### */

        //             if (checkStatus) {
        //                 console.log("data" + JSON.stringify(data.data));
        //                 var eventPostedData = data.data.data;
        //             }
        //             else {
        //                 // alert("UnSuccessfully Event Updated");
        //             }
        //         })
        //         $scope.events[id].notificationNeed = 'No';
        //     }
        // }
        var eClicked = $uibModal.open({
            scope: $scope,
            templateUrl: '/careatorApp/common/eventDetailTemplate.html',
            windowClass: 'show',
            backdropClass: 'show',
            controller: function ($scope, $uibModalInstance) {
                $scope.eventDetails = $scope.events[id];

                console.log("$scope.eventDetails: " + JSON.stringify($scope.eventDetails));
            }
        })
        console.log("<--viewDetail");
    }

    $scope.rescheduleEvent = function (id) {
        console.log("reschedule-->");
        var date = $scope.events[id].startsAt;
        var reqDate = date.getDate() - 1;
        var reqMonth = date.getMonth();
        var reqYear = date.getFullYear();
        var reqHr = date.getHours();
        var reqMin = date.getMinutes();
        var reqSec = date.getSeconds();
        var consolidateDate = new Date(reqYear, reqMonth, reqDate, reqHr, reqMin, reqSec);
        console.log(" $scope.events[id].id: " + $scope.events[id].id);
        console.log("$scope.events[id]: " + JSON.stringify($scope.events[id]));
        if (consolidateDate > $scope.todayDate) {
            // alert("Edit Started-->");
            var id = $scope.events[id].id;
            //   var cs= $scope.events[id].student_cs;

            //   var stud_id = $scope.events[id].student_id; 
            //   var name = $scope.events[id].student_Name;

            console.log("id: " + id);
            $state.go('dashboard.eventReschedule', {
                'id': id
            });
        } else {
            var loginAlert = $uibModal.open({
                scope: $scope,
                templateUrl: '/html/templates/dashboardwarning.html',
                windowClass: 'show',
                backdropClass: 'static',
                keyboard: false,
                controller: function ($scope, $uibModalInstance) {
                    $scope.message = "Sorry you not allow to edit";
                }
            })
            //alert("Sorry you not allow to edit");
        }
        // var api = "https://norecruits.com/vc/rescheduleEvent/:id";

        // careatorHttpFactory.post(api, obj).then(function (data) {
        //     var checkStatus = careatorHttpFactory.dataValidation(data);
        //     //console.log("data--" + JSON.stringify(data.data));
        //     if (checkStatus) {
        //       console.log("data" + JSON.stringify(data.data));
        //       // $window.location.href = $scope.propertyJson.R082;
        //       alert("Successfully sent the event");
        //       // vm.events.splice(0, 1);
        //       var eventPostedData = data.data.data;

        //       ownerEvents.push(objData);
        //       vm.events.push(objData);
        //     }
        //     else {
        //       alert("Event Send Failed");
        //     }
        // })
        console.log("<--reschedule");
    }

    $scope.waitForTime = function (time, currentTime, wt, ct) {
        console.log("waitForTime-->");

        SweetAlert.swal({
            title: "Its too early",
            text: "Now time is just " + currentTime + " Wait till" + time,
            type: "warning"
        });
        // alert("Wait till " + time);
        console.log("<--waitForTime");
    }

    $scope.conferenceStart = function (url) {
        console.log("conferenceStart-->");
        console.log("url: " + url);
        var splitURL = url.split('/');
        console.log("url: " + JSON.stringify(splitURL));
        localStorage.setItem("schedule_sessionUrlId", splitURL[4]);
        localStorage.setItem("userId", $scope.userData.userId);
        console.log("url: " + localStorage.getItem("schedule_sessionUrlId"));
        console.log("url: " + localStorage.getItem("userId"));
        $window.open(url, '_blank');
        console.log("<--conferenceStart");
    }

    $scope.deleteEvent = function (id) {
        console.log("deleteEvent-->");
        console.log("id: " + id);
        //  alert("Coming Soon");
        console.log("<--deleteEvent");
    }

    /* ### Start: Get event update from event.js(eventSend method)  ### */ //update the client with new data;
    socket.on('eventUpdated', function (data) {
        console.log("eventUpdated-->: " + JSON.stringify(data));
        if (data.id == $scope.userData.id || data.remoteId == $scope.userData.id) {
            $scope.eventGet();
            $rootScope.$emit("CallParent_eventGet", {}); /* ### Note: calling method of parentController(dashboardCtr) ### */
        }
    });
    /* ### End: Get event update from event.js(eventSend method)  ### */

    /* ### Start: Get event update from index.js  ### */ //update the client with new data;
    socket.on('event_viewDetail_toSender', function (data) {
        console.log("****event_viewDetail_toSender-->: " + JSON.stringify(data));;

        if ($scope.userData.id == data.userId) {
            console.log("start calling eventGet");
            $scope.eventGet();
        }
    })
    /* ### End: Get event update from index.js  ### */
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname; //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }





})