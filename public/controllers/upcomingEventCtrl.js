app.controller('upcomingEventController', function ($scope, $window, httpFactory, $uibModal) {
    console.log("upcomingEventController==>");
    $scope.events = [];
    $scope.eventGet = function () {
        console.log("eventGet-->");
        var id = localStorage.getItem("id");
        var api = "https://norecruits.com/vc/eventGet" + "/" + id;
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
    $scope.eventGet();

    $scope.viewDetail = function(id){
        console.log("viewDetail-->");
        console.log("id: "+id);
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

    $scope.rescheduleEvent = function(id){
        console.log("reschedule-->");
        console.log("id: "+id);
        alert("Coming Soon");
        console.log("<--reschedule");
    }

    $scope.deleteEvent = function(id){
        console.log("deleteEvent-->");
        console.log("id: "+id);
        alert("Coming Soon");
        console.log("<--deleteEvent");
    }
   






    // $scope.upcomingEventGet = function () {
    //     console.log("eventGet-->");
    //     var id = localStorage.getItem("id");
    //     var currentDateTime = new Date();
    //     console.log("currentDateTime: "+currentDateTime);
    //     var api = "https://norecruits.com/vc/upcomingEventGet" + "/" + id+"/"+currentDateTime;
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