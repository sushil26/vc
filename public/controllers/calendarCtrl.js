app.controller('calendarCtrl', function ($scope, $compile, $window, $filter, httpFactory, moment, calendarConfig, $uibModal) {
  console.log("calendarCtrl==>: " + localStorage.getItem("userData"));

  // if(localStorage.getItem("loginType")!='teacher'){

  //   window.location.href="https://vc4all.in";


  // }


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
    window.location.href = "https://vc4all.in";
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

    httpFactory.post(api, obj).then(function (data) {
      var checkStatus = httpFactory.dataValidation(data);
      console.log("data--" + JSON.stringify(data.data));
      if (checkStatus) {

        console.log("data" + JSON.stringify(data.data))
        // $window.location.href = $scope.propertyJson.R082;
        alert("Successfully event updated" + data.data.message);
      }
      else {
        alert("Event Send Failed");

      }

    })
    console.log("<--updatedEvent");
  }

  $scope.save = function (date, sd, ed, s, e, sFiltered, eFiltered, title) {
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
  }
  $scope.eventSend = function (res, name, id, primColor) {
    //$scope.eventSend = function (a, b) {
    //alert("a: "+a+"b: "+b);
    console.log("eventSend-->");

    var SIGNALING_SERVER = "https://vc4all.in";
    var queryLink = null;
    var peerNew_id = null;
    var url;
    signaling_socket = io(SIGNALING_SERVER);

    signaling_socket.on('connect', function () {
      console.log("signaling_socket connect-->");

      signaling_socket.on('message', function (config) {
        console.log("signaling_socket message-->");

        queryLink = config.queryId;
        peerNew_id = config.peer_id;

        url = "https://vc4all.in/client/" + peerNew_id + "/" + $scope.urlDate;

        var api = "https://vc4all.in/vc/eventSend";
        //var api = "http://localhost:5000/vc/eventSend";
        console.log("api: " + api);
        var email = document.getElementById('eventEmails').value;
        var obj = {
          "userId": localStorage.getItem("id"),
          "title": $scope.title,
          "reason": res,
          "studName": name,
          "studId": id,
          "email": email,
          "start": $scope.startD,
          "end": $scope.endDateRes,
          "startAt": $scope.startFiltered,
          "endAt": $scope.endFiltered, /* ###Note: have work and this is unwanted */
          "primColor": primColor,
          "url": url,
          "date": $scope.date,
          "sd": $scope.sd,
          "ed": $scope.ed

        }
        console.log("obj: " + JSON.stringify(obj));

        httpFactory.post(api, obj).then(function (data) {
          var checkStatus = httpFactory.dataValidation(data);
          console.log("data--" + JSON.stringify(data.data));
          if (checkStatus) {

            console.log("data" + JSON.stringify(data.data))
            // $window.location.href = $scope.propertyJson.R082;
            alert("Successfully sent the event " + data.data.message);
            vm.events.splice(0, 1);
            var eventPostedData = data.data.data;
            vm.events.push({
              'id': obj.userId,
              'title': obj.title,
              'color': obj.primColor,
              'startsAt': obj.start,
              'endsAt': obj.end,
              'draggable': true,
              'resizable': true,
              'actions': actions,
              'url': obj.url

            });
            // $scope.eventGet();
          }
          else {
            alert("Event Send Failed");

          }

        })

      })
    })

    console.log("<--eventSend");
    // var url = document.getElementById('linkToShare').innerHTML;
  }
  $scope.eventGet = function () {
    console.log("eventGet-->");
    var id = localStorage.getItem("id");
    var api = "https://vc4all.in/vc/eventGet" + "/" + id;
    //var api = "http://localhost:5000/vc/eventGet";

    httpFactory.get(api).then(function (data) {
      var checkStatus = httpFactory.dataValidation(data);
      console.log("data--" + JSON.stringify(data.data));
      if (checkStatus) {
        $scope.eventData = data.data.data;
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
            'actions': actions,
            'url': $scope.eventData[x].url,
            "studentName": $scope.eventData[x].studName,
            "studendtId": $scope.eventData[x].studId,
            "title": $scope.eventData[x].title,
            "reason": $scope.eventData[x].reason,
            "email": $scope.eventData[x].email
          }
          console.log(" obj" + JSON.stringify(obj))
          vm.events.push(obj);

        }
      }
      else {
        //alert("Event get Failed");

      }

    })
  }
  $scope.eventGet();

  var vm = this;

  //These variables MUST be set as a minimum for the calendar to work
  vm.calendarView = 'month';
  vm.viewDate = new Date();
  var actions = [{
    label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
    onClick: function (args) {
      alert('Edited', args.calendarEvent);
      console.log("args.calendarEvent: " + args.calendarEvent);
      console.log("JSON args.calendarEvent: " + JSON.stringify(args.calendarEvent));
      var eClicked = $uibModal.open({
        scope: $scope,
        templateUrl: '/html/templates/eventDetails_edit.html',
        windowClass: 'show',
        backdropClass: 'show',
        controller: function ($scope, $uibModalInstance) {
          $scope.eventDetails = args.calendarEvent;
          console.log("$scope.eventDetails: " + $scope.eventDetails);
        }
      })
      // alert.show('Edited', args.calendarEvent);
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

  $scope.eventDetailClick = function (index) {
    console.log("eventDetailClick--> ");
    var evtData = vm.events[index];
    console.log(" $scope.evtData: " + $scope.evtData);
    var eClicked = $uibModal.open({
      scope: $scope,
      templateUrl: '/html/templates/eventDetails.html',
      windowClass: 'show',
      backdropClass: 'show',
      controller: function ($scope, $uibModalInstance) {
        $scope.eventDetails = evtData;
        console.log("$scope.eventDetails: " + $scope.eventDetails);
      }
    })
    console.log("<--eventDetailClick");
  }

  vm.eventClicked = function (event) {
    console.log("eventClicked-->");
    // alert("clicked: " + event);
    console.log("cliecked: " + JSON.stringify(event));
    $scope.evtData = event;
    console.log("$scope.evtData: " + $scope.evtData);
    console.log("$scope.evtData.id: " + $scope.evtData.id);

    // $('#eDetail').trigger('click');
    var eClicked = $uibModal.open({
      scope: $scope,
      templateUrl: '/html/templates/eventDetails.html',
      windowClass: 'show',
      backdropClass: 'show',
      controller: function ($scope, $uibModalInstance) {
        $scope.eventDetails = event;
        console.log("$scope.eventDetails: " + $scope.eventDetails);
      }
    })
    console.log("<--eventClicked");
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