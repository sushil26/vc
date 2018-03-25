app.controller('calendarCtrl', function ($scope, $window, $filter, httpFactory, moment, calendarConfig) {
  console.log("calendarCtrl==>: " + localStorage.getItem("userData"));

  $scope.deleteEvent = function (id) {
    console.log("deleteEvent-->");
    var api = "https://vc4all.in/vc/deleteEvent";

    var obj = {
      "id": id
    }
    httpFactory.post(api, obj).then(function (data) {
      var checkStatus = httpFactory.dataValidation(data);
      console.log("data--" + JSON.stringify(data.data));
      if (checkStatus) {

        console.log("data" + JSON.stringify(data.data))
        // $window.location.href = $scope.propertyJson.R082;
        alert("Successfully sent the event " + data.data.message);
      }
      else {
        alert("Event Send Failed");

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
  $scope.eventSend = function (res, name, id, email, start, end, startAt, endAt, primColor) {
    console.log("eventSend-->");

    var SIGNALING_SERVER = "https://vc4all.in";
    var queryLink = null;
    var peerNew_id = null;
    var url;
    signaling_socket = io(SIGNALING_SERVER);

    signaling_socket.on('connect', function () {
      console.log("signaling_socket connect-->");

      if (disconnPeerId != null) {
        location.reload();
        disconnPeerId = null;
      }

      signaling_socket.on('message', function (config) {
        console.log("signaling_socket message-->");

        queryLink = config.queryId;
        peerNew_id = config.peer_id;

        url = "https://vc4all.in/client/" + peerNew_id + "/" + url;

        var api = "https://vc4all.in/vc/eventSend";
        //var api = "http://localhost:5000/vc/eventSend";
        console.log("api: " + api);

        var obj = {
          "reason": res,
          "studName": name,
          "studId": id,
          "email": email,
          "start": $scope.startDate,
          "end": $scope.endDateRes,
          "startAt": startAt,
          "endAt": endAt,
          "primColor": primColor,
          "url": url

        }
        console.log("obj: " + JSON.stringify(obj));

        httpFactory.post(api, obj).then(function (data) {
          var checkStatus = httpFactory.dataValidation(data);
          console.log("data--" + JSON.stringify(data.data));
          if (checkStatus) {

            console.log("data" + JSON.stringify(data.data))
            // $window.location.href = $scope.propertyJson.R082;
            alert("Successfully sent the event " + data.data.message);
          }
          else {
            alert("Event Send Failed");

          }

        })

      })
    })

    console.log("startAt: " + startAt);
    // var url = document.getElementById('linkToShare').innerHTML;



  }

  $scope.eventGet = function () {
    console.log("eventGet-->");

    var api = "https://vc4all.in/vc/eventGet";

    httpFactory.get(api).then(function (data) {
      var checkStatus = httpFactory.dataValidation(data);
      console.log("data--" + JSON.stringify(data.data));
      if (checkStatus) {
        $scope.eventData = data.data.data;
        for (var x = 0; x < $scope.eventData.length; x++) {
          console.log("$scope.eventData[" + x + "]: " + JSON.stringify($scope.eventData[x]));
          var obj = {
            'id': $scope.eventData[x]._id,
            'title': 'An Event',
            'color': $scope.eventData[x].primColor,
            'startsAt': new Date($scope.eventData[x].start),
            'endsAt': new Date($scope.eventData[x].end),
            'draggable': true,
            'resizable': true,
            'actions': actions

          }
          console.log(" obj" + JSON.stringify(obj))
          vm.events.push(obj);

        }


        // $window.location.href = $scope.propertyJson.R082;

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

    //  alert.show('Clicked', event);
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