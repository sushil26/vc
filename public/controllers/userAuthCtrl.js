app.controller('userAuthCtrl', function ($scope, $window, httpFactory) {
    console.log("userAuthCtrl==>: " + localStorage.getItem("userData"));

    var api = "https://vc4all.in/vc/getUserData";
    

    httpFactory.get(api).then(function (data) {
      var checkStatus = httpFactory.dataValidation(data);
      console.log("data--" + JSON.stringify(data.data));
      if (checkStatus) {
        $scope.userData = data.data.data;
        console.log(" obj" + JSON.stringify($scope.userData))
        // for (var x = 0; x < $scope.eventData.length; x++) {
        //   console.log("$scope.eventData[" + x + "]: " + JSON.stringify($scope.eventData[x]));
        //   var obj = {
        //     'id': $scope.eventData[x]._id,
        //     'title': 'An Event',
        //     'color': $scope.eventData[x].primColor,
        //     'startsAt': new Date($scope.eventData[x].start),
        //     'endsAt': new Date($scope.eventData[x].end),
        //     'draggable': true,
        //     'resizable': true,
        //     'actions': actions

        //   }
        //   console.log(" obj" + JSON.stringify(obj))
        //   vm.events.push(obj);

        // }


      }
      else {
        //alert("Event get Failed");

      }

    })
      

})