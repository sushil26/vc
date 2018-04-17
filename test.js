app.controller('calendarCtrl', function ($scope, $window, $filter, httpFactory, moment, calendarConfig) {
    console.log("calendarCtrl==>: " + localStorage.getItem("userData"));
  
    // if(localStorage.getItem("loginType")!='teacher'){
  
    //   window.location.href="https://norecruits.com";
  
    // }
  
    
    //{"schoolName" : "dempo2", "studId" : "demos0001", "studName" : "demos1", "parentName" : "demofather", "parentEmail" : "shirdhi@careator.com", "mobileNum" : "99999999","MotherName" : "demomother","MotherEmail" : "shirdhi@Careator.com","MotherNum" : "88888888","cs" : [{"class" : "8","section" : "A" }], "pswd" : "abc", "status" : "active", "loginType" : "studParent"}


    if (localStorage.getItem("loginType") == 'admin') {
      console.log("loginType: " + localStorage.getItem("loginType"));
      document.getElementById('userAuth').style.display = "block";
      $scope.userLoginType = 'admin';
  
    }
    else if (localStorage.getItem("loginType") == 'teacher') {
      document.getElementById('userAuth').style.display = "none";
      $scope.userLoginType = 'teacher';
    }
    else {
      window.location.href = "https://norecruits.com";
    }
  
    $scope.eventColors = ['red', 'green', 'blue'];
  
    $scope.deleteEvent = function (id, index) {
      console.log("deleteEvent-->");
      var api = "https://norecruits.com/vc/deleteEvent";
      //var api = "http://localhost:5000/vc/deleteEvent";
      vm.events.splice(index, 1);
      var obj = {
        "id": id
      }
      httpFactory.post(api, obj).then(function (data) {
        var checkStatus = httpFactory.dataValidation(data);
        console.log("data--" + JSON.stringify(data.data));
        if (checkStatus) {
          console.log("data" + JSON.stringify(data.data))
          // $window.location.href = $scope.propertyJson.R082;
          alert(data.data.message);
        }
        else {
          alert("Event Delete Failed");
  
        }
      })
      console.log("<--deleteEvent");
    }
  
    $scope.save = function (s, e) {
      console.log("s: " + s);
      console.log("e: " + e);
      var res = $filter('limitTo')(s, 2);
  
      console.log("res: " + res);
  
  
      console.log("$scope.startDate with filter : " + $filter('date')(s, "EEE MMM dd y"));
  
      console.log("$scope.endDate with filter: " + $filter('date')(e, "HH:mm:ss 'GMT'Z (IST)'"));
      $scope.startDate = $filter('date')(s, "EEE MMM dd y");
      $scope.endDate = $filter('date')(e, "HH:mm:ss 'GMT'Z (IST)'");
      $scope.endDateRes = $scope.startDate + ' ' + $scope.endDate;
      $scope.urlDate = $filter('date')(s, "EEEMMMddyHHmmss");
      console.log("$scope.endDateRes: " + $scope.endDateRes);
    }
    $scope.eventSend = function (a,b) {
      console.log("eventSend-->");
      // console.log("startAt, endAt: "+startAt+" "+ endAt)
      // console.log("start: "+start);
      // console.log("$scope.endDateRes: "+$scope.endDateRes);
      alert("a and b: "+a+" "+b);
  
      var SIGNALING_SERVER = "https://norecruits.com";
      var queryLink = null;
      var peerNew_id = null;
      var url;
      signaling_socket = io(SIGNALING_SERVER);
  
      // signaling_socket.on('connect', function () {
      //   console.log("signaling_socket connect-->");
  
      //   signaling_socket.on('message', function (config) {
      //     console.log("signaling_socket message-->");
  
      //     queryLink = config.queryId;
      //     peerNew_id = config.peer_id;
  
      //     url = "https://norecruits.com/client/" + peerNew_id + "/" + $scope.urlDate;
  
      //     var api = "https://norecruits.com/vc/eventSend";
      //     //var api = "http://localhost:5000/vc/eventSend";
      //     console.log("api: " + api);
      //     var email = document.getElementById('eventEmails').value;
      //     var obj = {
      //       "userId": localStorage.getItem("id"),
      //       "reason": res,
      //       "studName": name,
      //       "studId": id,
      //       "email": email,
      //       "start": start,
      //       "end": $scope.endDateRes,
      //       "startAt": startAt,
      //       "endAt": endAt,
      //       "primColor": primColor,
      //       "url": url
      //     }
      //     console.log("obj: " + JSON.stringify(obj));
  
      //     httpFactory.post(api, obj).then(function (data) {
      //       var checkStatus = httpFactory.dataValidation(data);
      //       console.log("data--" + JSON.stringify(data.data));
      //       if (checkStatus) {
  
      //         console.log("data" + JSON.stringify(data.data))
      //         // $window.location.href = $scope.propertyJson.R082;
      //         alert("Successfully sent the event " + data.data.message);
      //         // $scope.eventGet();
      //         // vm.events.push({
      //         //   title: 'New event',
      //         //   startsAt: data.data.start,
      //         //   endsAt: data.data.end,
      //         //   color: data.data.primColor,
      //         //   draggable: true,
      //         //   resizable: true
      //         // });
      //       }
      //       else {
      //         alert("Event Send Failed");
  
      //       }
  
      //     })
  
      //   })
      // })
  
      console.log("startAt: " + startAt);
      // var url = document.getElementById('linkToShare').innerHTML;
    }
    // $scope.eventGet = function () {
    //   console.log("eventGet-->");
    //   var id = localStorage.getItem("id");
    //   var api = "https://norecruits.com/vc/eventGet"+ "/" + id;
    //   //var api = "http://localhost:5000/vc/eventGet";
  
    //   httpFactory.get(api).then(function (data) {
    //     var checkStatus = httpFactory.dataValidation(data);
    //     console.log("data--" + JSON.stringify(data.data));
    //     if (checkStatus) {
    //       $scope.eventData = data.data.data;
    //       for (var x = 0; x < $scope.eventData.length; x++) {
    //         console.log("$scope.eventData[" + x + "]: " + JSON.stringify($scope.eventData[x]));
    //         var obj = {
    //           'id': $scope.eventData[x]._id,
    //           'title': 'An Event',
    //           'color': $scope.eventData[x].primColor,
    //           'startsAt': new Date($scope.eventData[x].start),
    //           'endsAt': new Date($scope.eventData[x].end),
    //           'draggable': true,
    //           'resizable': true,
    //           'actions': actions,
    //           'url': $scope.eventData[x].url
  
    //         }
    //         console.log(" obj" + JSON.stringify(obj))
    //         vm.events.push(obj);
  
    //       }
    //     }
    //     else {
    //       //alert("Event get Failed");
  
    //     }
  
    //   })
    // }
    // $scope.eventGet();
  
    var vm = this;
  
    //These variables MUST be set as a minimum for the calendar to work
    vm.calendarView = 'month';
    vm.viewDate = new Date();
    var actions = [{
      label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
      onClick: function (args) {
        alert.show('Edited', args.calendarEvent);
      }
    }, {
      label: '<i class=\'glyphicon glyphicon-remove\'></i>',
      onClick: function (args) {
        alert.show('Deleted', args.calendarEvent);
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
  
      // {
      //   title: '<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Another event</span>, with a <i>html</i> title',
      //   color: calendarConfig.colorTypes.info,
      //   startsAt: moment().subtract(1, 'day').toDate(),
      //   endsAt: moment().add(5, 'days').toDate(),
      //   draggable: true,
      //   resizable: true,
      //   actions: actions
      // }, {
      //   title: 'This is a really long event title that occurs on every year',
      //   color: calendarConfig.colorTypes.important,
      //   startsAt: moment().startOf('day').add(7, 'hours').toDate(),
      //   endsAt: moment().startOf('day').add(19, 'hours').toDate(),
      //   recursOn: 'year',
      //   draggable: true,
      //   resizable: true,
      //   actions: actions
      // }
    ];
  
    vm.cellIsOpen = true;
  
    vm.addEvent = function () {
      vm.events.push({
        title: 'New event',
        startsAt: moment().startOf('day').toDate(),
        endsAt: moment().endOf('day').toDate(),
        color: calendarConfig.colorTypes.important,
        draggable: true,
        resizable: true
      });
    };
  
    vm.eventClicked = function (event) {
      alert("clicked: " + event);
      console.log("cliecked: " + event);
    };
  
    $scope.eventClicked = function (event) {
      alert("clicked: " + event);
      console.log("cliecked: " + event);
  
      //  alert.show('Clicked', event);
    };
  
    vm.eventEdited = function (event) {
      alert("eventEdited");
      console.log("cliecked: " + event);
  
      // alert.show('Edited', event);
    };
  
    vm.eventDeleted = function (event) {
      alert("eventDeleted");
      console.log("deleted");
      // alert.show('Deleted', event);
    };
  
    vm.eventTimesChanged = function (event) {
      alert.show('Dropped or resized', event);
    };
  
    vm.toggle = function ($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };
  
    vm.timespanClicked = function (date, cell) {
  
      if (vm.calendarView === 'month') {
        if ((vm.cellIsOpen && moment(date).startOf('day').isSame(moment(vm.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
          vm.cellIsOpen = false;
        } else {
          vm.cellIsOpen = true;
          vm.viewDate = date;
        }
      } else if (vm.calendarView === 'year') {
        if ((vm.cellIsOpen && moment(date).startOf('month').isSame(moment(vm.viewDate).startOf('month'))) || cell.events.length === 0) {
          vm.cellIsOpen = false;
        } else {
          vm.cellIsOpen = true;
          vm.viewDate = date;
        }
      }
  
    };
  
  
  
  
  
  
  })