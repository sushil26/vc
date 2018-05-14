app.controller('upcomingEventController', function ($scope, $state, $window, httpFactory, $uibModal, $filter, sessionAuthFactory) {
    console.log("upcomingEventController==>");
    $scope.userData = sessionAuthFactory.getAccess("userData");
    $scope.loginType = $scope.userData.loginType;
    $scope.events = [];

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

    $scope.eventGet = function () {
        console.log("eventGet-->");
        var id = $scope.userData.id;
        var api = "https://vc4all.in/vc/eventGet" + "/" + id;
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
                        'userId': $scope.eventData[x]._userId,
                        'studUserId': $scope.eventData[x].studUserId,
                        "student_cs": $scope.eventData[x].student_cs, 
                        "student_id":$scope.eventData[x].student_id, 
                        "student_Name":$scope.eventData[x].student_Name, 
                        'title': $scope.eventData[x].title,
                        'color': $scope.eventData[x].primColor,
                        'startsAt': new Date($scope.eventData[x].start),
                        'endsAt': new Date($scope.eventData[x].end),
                        'draggable': true,
                        'resizable': true,
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
            templateUrl: '/html/templates/eventDetails.html',
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
        console.log("$scope.events[id]: "+JSON.stringify($scope.events[id]));
        if (consolidateDate > $scope.todayDate) {
           // alert("Edit Started-->");
           var id = $scope.events[id].id;
        //   var cs= $scope.events[id].student_cs;
          
        //   var stud_id = $scope.events[id].student_id; 
        //   var name = $scope.events[id].student_Name;
           
            console.log("id: "+id);
            $state.go('dashboard.eventReschedule', { 'id': id});
        }
        else {
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
        // var api = "https://vc4all.in/vc/rescheduleEvent/:id";

        // httpFactory.post(api, obj).then(function (data) {
        //     var checkStatus = httpFactory.dataValidation(data);
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

    $scope.waitForTime = function(time){
        console.log("waitForTime-->");
        var loginAlert = $uibModal.open({
            scope: $scope,
            templateUrl: '/html/templates/dashboardwarning.html',
            windowClass: 'show',
            backdropClass: 'static',
            keyboard: false,
            controller: function ($scope, $uibModalInstance) {
              $scope.message = "Wait till "+time;
            }
          })
        console.log("<--waitForTime");
    }

    $scope.conferenceStart = function(url, id){
        console.log("conferenceStart-->");
        console.log("id: "+id+"url: "+url);
        localStorage.setItem("id", id);
        localStorage.setItem("schoolName", $scope.userData.schoolName);
       
        $window.open(url, '_blank');
        console.log("<--conferenceStart");
    }

    $scope.deleteEvent = function (id) {
        console.log("deleteEvent-->");
        console.log("id: " + id);
      //  alert("Coming Soon");
        console.log("<--deleteEvent");
    }

    // $scope.upcomingEventGet = function () {
    //     console.log("eventGet-->");
    //     var id = localStorage.getItem("id");
    //     var currentDateTime = new Date();
    //     console.log("currentDateTime: "+currentDateTime);
    //     var api = "https://vc4all.in/vc/upcomingEventGet" + "/" + id+"/"+currentDateTime;
    //     httpFactory.get(api).then(function (data) {
    //         var checkStatus = httpFactory.dataValidation(data);
    //         console.log("data--" + JSON.stringify(data.data));
    //         if (checkStatus) {
    //             $scope.eventData = data.data.data;

    //             // ownerEvents = [];
    //             for (var x = 0; x < $scope.eventData.length; x++) {
    //                 console.log("$scope.eventData[" + x + "]: " + JSON.stringify($scope.eventData[x]));
    //                 var obj = {
    //                     'id': $scope.eventData[x]._id,
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
    //                     "remoteCalendarId": $scope.eventData[x].remoteCalendarId
    //                 }
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
    // $scope.upcomingEventGet();






})