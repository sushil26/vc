careatorApp.controller('vc4allEmpScheduleCtrl', function ($scope, $q, $timeout, $rootScope, $state, $rootScope, $compile, $window, $filter, careatorHttpFactory, careatorSessionAuth, moment, calendarConfig, $uibModal, SweetAlert, $interval) {
  console.log("vc4allEmpScheduleCtrl==>");
  console.log("date: " + new Date());
  var dayEventmodal; /* ### Note: open model for event send ###  */
  var studEvents = []; /* ### Note: selected student events ### */
  var teacherEvents = []; /* ### Note: selected teacher events ### */
  var ownerEvents = []; /* ### Note: logged in person all events ### */
  var remoteEvent = []; /* ### Note:receiver all events ### */

  $scope.userData = careatorSessionAuth.getAccess();

  $scope.propertyJson = $rootScope.propertyJson;
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

      } else { }
    })
    console.log("<--Get To Date");
  }
  $scope.getToDate();

  function getToDateByEachSec () {
    console.log("Get To Date-->");
    var api = "https://norecruits.com/careator_getToDate/careator_getToDate";
    careatorHttpFactory.get(api).then(function (data) {
      var checkStatus = careatorHttpFactory.dataValidation(data);
     // console.log("data--" + JSON.stringify(data.data));
      if (checkStatus) {
       // console.log("data.data.data.date: " + data.data.data.date);
        var todayDate = new Date(data.data.data.date);
       // console.log("todayDate: " + todayDate);
        var reqDate = todayDate.getDate();
        //console.log("reqDate: " + reqDate);
        var reqMonth = todayDate.getMonth();
        var reqYear = todayDate.getFullYear();
        var reqHr = todayDate.getHours();
        var reqMin = todayDate.getMinutes();
        var reqSec = todayDate.getSeconds();
        $scope.todayDate = new Date(reqYear, reqMonth, reqDate, reqHr, reqMin, reqSec);
        $scope.currentTime = $scope.todayDate
        //console.log("$scope.todayDate: " + $scope.todayDate);
      } else { }
    })
    console.log("<--Get To Date");
  }
  getToDateByEachSec();

  $interval(getToDateByEachSec, 10000);

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
        vm.events = [];
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
            "url": $scope.eventData[x].url,
            "date": $scope.eventData[x].date,
            'draggable': true,
            'resizable': true,
            'actions': actions
          }
          console.log(" obj" + JSON.stringify(obj))
          ownerEvents.push(obj);
          vm.events.push(obj);
        }
      } else {
        //alert("Event get Failed");
      }
    })
  }

  $scope.save = function (title, emailList, sd, ed, reason) {
    if (title && emailList && sd && ed && reason) {
      console.log("before save time is: " + $scope.todayDate)
      console.log("title: " + title);
      console.log("emailList: " + emailList);
      console.log("sd: " + sd);
      console.log("ed: " + ed);
      console.log("reason: " + reason);
      var rsd = new Date(sd);
      var red = new Date(ed);
      var PersonalRemoteCombineCal = ownerEvents;
      var reqDate = rsd.getDate() - 1;
      var reqMonth = rsd.getMonth();
      var reqYear = rsd.getFullYear();
      var reqHr = rsd.getHours();
      var reqMin = rsd.getMinutes();
      var reqSec = rsd.getSeconds();
      var consolidateDate = new Date(reqYear, reqMonth, reqDate, reqHr, reqMin, reqSec);
      console.log("rsd.getTime(): " + rsd.getTime() + " red: " + red.getTime());
      var reqDate = $scope.currentTime.getDate();
      var reqMonth = $scope.currentTime.getMonth();
      var reqYear = $scope.currentTime.getFullYear();
      var todayDate = new Date(reqYear, reqMonth, reqDate);
      console.log("todayDate: " + todayDate);
      var selected_reqDate = rsd.getDate();
      var selected_reqMonth = rsd.getMonth();
      var selected_reqYear = rsd.getFullYear();

      var selected_date = new Date(selected_reqYear, selected_reqMonth, selected_reqDate);
      if (rsd.getTime() > $scope.currentTime.getTime()) {
        if (rsd.getTime() < red.getTime()) {
          var diff = red.getHours() - rsd.getHours();
          console.log("diff: " + diff);
          if (diff <= 8) {
            console.log("PersonalRemoteCombineCal.length: " + PersonalRemoteCombineCal.length);
            if (PersonalRemoteCombineCal.length > 0) {
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
                SweetAlert.swal({
                  title: "Not Available",
                  type: "info",
                  text: "you have a apponitment on same time",
                })
                // alert("ON this time you have an appointment");
              } else {
                console.log("no conflicts is there");
                var formatedStartTime = $filter('date')(sd, "HH:mm a");
                var formatedEndTime = $filter('date')(ed, "HH:mm a");
                var dateForEvent = $filter('date')(sd, "EEE MMM dd y");
                dayEventmodal.close('resetModel');
                $scope.eventSend(title, emailList, dateForEvent, formatedStartTime, formatedEndTime, sd, ed, reason);
              }
            } else {
              console.log("no conflicts is there");
              var formatedStartTime = $filter('date')(sd, "HH:mm a");
              var formatedEndTime = $filter('date')(ed, "HH:mm a");
              var dateForEvent = $filter('date')(sd, "EEE MMM dd y");
              dayEventmodal.close('resetModel');
              $scope.eventSend(title, emailList, dateForEvent, formatedStartTime, formatedEndTime, sd, ed, reason);
            }
          } else {
            SweetAlert.swal({
              title: "Invalid Time Duration",
              type: "warning",
              text: "Sorry! maximum 8hours duration only allowed for schedule",
            })
          }

        } else {
          SweetAlert.swal({
            title: "Invalid Date",
            type: "warning",
            text: "End time should not be lesser than/equal to start time",
          })
          // alert("Selected should not be lesser than current date");
        }
      } else {
        SweetAlert.swal({
          title: "Invalid Date",
          type: "warning",
          text: "Sorry! Start time should not be lesser than/equal to current time(" + $scope.currentTime + ")",
        })
      }
    }
    else {
      SweetAlert.swal({
        title: "Invalid Input",
        type: "warning",
        text: "Fill the mandatory feild",
      })
    }

  }


  function getSocketUrlFromServer() {
    console.log("getSocketUrlFromServer-->");
    var dfd = $q.defer();
    var SIGNALING_SERVER = "https://norecruits.com";
    signaling_socket = io(SIGNALING_SERVER);
    signaling_socket.on('connect', function () {
      console.log("signaling_socket connect-->");

      signaling_socket.on('message', function (config) {
        console.log("signaling_socket message-->");

        queryLink = config.queryId;
        peerNew_id = config.peer_id;
        var dt = $scope.todayDate;
        var dy = dt.getDay().toString();
        var fy = dt.getFullYear().toString();
        var m = dt.getMonth().toString();
        var hr = dt.getHours().toString();
        var date = dy.concat(fy, m, hr);
        urlDate = date;

        var url = "https://norecruits.com/vc4all_scheduleConf/" + peerNew_id + "/" + urlDate;
        dfd.resolve(url);
      })
    })
    return dfd.promise;
  }
   
 

  $scope.eventSend = function (title, emailList, dateForEvent, formatedStartTime, formatedEndTime, sd, ed, reason) {
    console.log("eventSend-->");
    //var SIGNALING_SERVER = "http://localhost:5000";
    var queryLink = null;
    var peerNew_id = null;
    var url;
    $timeout(function () {
      getSocketUrlFromServer().then(function (url) {
        console.log("Back to function call-->");
        console.log("url: " + url);
        var api = "https://norecruits.com/careator_eventSchedule/careator_sendEventSchedule";
        console.log("api: " + api);
        var obj = {
          "senderId": $scope.userData.userId,
          "senderName": $scope.userData.firstName+" "+$scope.userData.lastName,
          "senderEmail": $scope.userData.email,
          "title": title,
          "reason": reason,
          "invitingTo": emailList,
          "formatedStartTime": formatedStartTime,
          "formatedEndTime": formatedEndTime,
          "startsAt": sd,
          "endsAt": ed,
          "primColor": "red",
          "url": url,
          "date": dateForEvent,
        }
        console.log("obj: " + JSON.stringify(obj));
        careatorHttpFactory.post(api, obj).then(function (data) {
          var checkStatus = careatorHttpFactory.dataValidation(data);
          console.log("data--" + JSON.stringify(data.data));
          if (checkStatus) {
            if (data.data.failedToSend.length == 0) {
              // alert("Successfully sent the event");
              SweetAlert.swal({
                title: "Invited Successfully",
                type: "success",
                text: "Successfully sent the event",
              })

            } else {
              SweetAlert.swal({
                title: "Failed",
                type: "warning",
                text: "Failed to send" + JSON.stringify(data.data.failedToSend.length)
              })
              // alert("Failed to send " + JSON.stringify(data.data.failedToSend.length));
            }

            // vm.events.splice(0, 1);
            var eventPostedData = data.data.data;
            var objData = {
              "senderId": $scope.userData.userId,
              "senderName": $scope.userData.firstName+" "+$scope.userData.lastName,
              "senderEmail": $scope.userData.email,
              "title": title,
              "reason": reason,
              "invite": emailList,
              "formatedStartTime": formatedStartTime,
              "formatedEndTime": formatedEndTime,
              "startsAt": sd,
              "endsAt": ed,
              "primColor": "red",
              "url": url,
              "date": dateForEvent,
            }
            ownerEvents.push(objData);
            vm.events.push(objData);
          } else {
            // alert("Event Send Failed");
            SweetAlert.swal({
              title: "Failed",
              type: "warning",
              text: "Failed to send"
            })

          }
        })
      });
    }, 0);
    console.log("<--eventSend");
    // var url = document.getElementById('linkToShare').innerHTML;
  }

  var vm = this;
  //These variables MUST be set as a minimum for the calendar to work
  // vm.calendarView = 'month';
  // vm.viewDate = new Date();
  vm.calendarView = 'month';
  vm.viewDate = moment().startOf('day').toDate();
  var originalFormat = calendarConfig.dateFormats.hour;
  calendarConfig.dateFormats.hour = 'HH:mm';
  if ($scope.userData.loginType == 'teacher') {
    var actions = [{
      label: 'Re-Schedule',
      onClick: function (args) {
        console.log("args.calendarEvent: " + args.calendarEvent);
        console.log("JSON args.calendarEvent: " + JSON.stringify(args.calendarEvent));
        var date = args.calendarEvent.startsAt;
        var reqDate = date.getDate() - 1;
        var reqMonth = date.getMonth();
        var reqYear = date.getFullYear();
        var reqHr = date.getHours();
        var reqMin = date.getMinutes();
        var reqSec = date.getSeconds();
        var consolidateDate = new Date(reqYear, reqMonth, reqDate, reqHr, reqMin, reqSec);
        console.log("args.calendarEvent.id: " + args.calendarEvent.id);
        console.log("args.calendarEvent: " + JSON.stringify(args.calendarEvent));
        if (consolidateDate > $scope.todayDate) {
          // alert("Edit Started-->");
          var id = args.calendarEvent.id;
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
          // alert("Sorry you not allow to edit");
        }
      }
    }];
  }

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
  };

  vm.eventClicked = function (event) {
    console.log("eventClicked-->");
    // alert("clicked: " + event);
    console.log("cliecked: " + JSON.stringify(event));
    $scope.evtData = event;
    console.log("$scope.evtData: " + JSON.stringify($scope.evtData));
    // $('#eDetail').trigger('click');
    $uibModal.open({
      scope: $scope,
      templateUrl: '/careatorApp/common/eventDetailTemplate.html',
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
          $scope.message = "ON this time any one of you not free,try other time";
        }
      })
      // alert("ON this time any one of you not free,try on other time");
    } else {
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
    /* ##### Start getdate api  ##### */
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
        console.log("date: " + date);
        console.log("$scope.todayDate: " + $scope.todayDate);
        var reqDate = $scope.todayDate.getDate();
        var reqMonth = $scope.todayDate.getMonth();
        var reqYear = $scope.todayDate.getFullYear();
        var todayDate = new Date(reqYear, reqMonth, reqDate);
        console.log("todayDate: " + todayDate);
        var selected_reqDate = date.getDate();
        var selected_reqMonth = date.getMonth();
        var selected_reqYear = date.getFullYear();

        var selected_date = new Date(selected_reqYear, selected_reqMonth, selected_reqDate);

        console.log("date: " + date);
        console.log("selected_date: " + selected_date);

        if (todayDate > selected_date) {
          SweetAlert.swal({
            title: "Date Error",
            type: "warning",
            text: "Schedule date should not be lesser than current date",
          })

        } else {
          console.log("Ready to process the date");
          $scope.selectedDateForEvent = $filter('date')(date, "EEE");
          $scope.selectedDate = date;
          console.log("todayDate: " + todayDate.getTime() + "selected_date: " + selected_date.getTime());
          if (todayDate.getTime() == selected_date.getTime()) {
            console.log("selected and today both are same");
            selectedStartDate = $scope.todayDate.setMinutes($scope.todayDate.getMinutes() + 5);
            selectedEndDate = $scope.todayDate.setMinutes($scope.todayDate.getMinutes() + 15);
            console.log("selectedStartDate: " + selectedStartDate + "selectedEndDate: " + selectedEndDate);
          } else {
            console.log("selected and today both are different");
            selectedStartDate = date;
            selectedEndDate = date;
          }
          dayEventmodal = $uibModal.open({
            scope: $scope,
            templateUrl: '/careatorApp/common/scheduleTemplate.html',
            windowClass: 'show',
            backdropClass: 'show',
            controller: function ($scope, $uibModalInstance) {
              var dt = new Date();
              $scope.eventDetails = {
                "startsAt": selectedStartDate,
                "endsAt": selectedEndDate
              }
              console.log("$scope.eventDetails: " + JSON.stringify($scope.eventDetails));
            }
          })
        }

      } else { }
    })
    /* ##### End getdate api  ##### */

  }
  if (window.matchMedia('(min-width: 500px)').matches) {
    console.log("<<<<<<<home icon hide>>>>>>>");
    $("#calnwidth").css({
      "width": "75%",
      "margin-left": "20px"
    })
  }
  if (window.matchMedia('(max-width: 500px)').matches) {
    console.log("<<<<<<<home icon hide>>>>>>>");
    $("#calnwidth").css({
      "width": " ",
      "margin-left": " ",
      "font-size": "10px",
    })
    $(".respcal").css({
      "font-size": "10px",
      "padding": "4px"
    })
  }



})