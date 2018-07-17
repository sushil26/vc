app.controller("vcAppCtrl", function ($scope, $rootScope, httpFactory, $window,sessionAuthFactory, $uibModal) {
  console.log("controller==>");
  //document.getElementById('mobile-nav').style.display='none';
  var loginModal; /* ### Note: get login modal instance on this variable ###*/
  var userName;
  httpFactory.getFile('property.json');
  $scope.userData = sessionAuthFactory.getAccess("userData");
  console.log(" $scope.userData : " + JSON.stringify($scope.userData));
  if ($scope.userData) {
    userName = $scope.userData.userName;
    // $scope.loginType = $scope.userData.loginType;
    console.log("userData: " + JSON.stringify($scope.userData));
    console.log("userName: " + userName);
    console.log("loginType: " + $scope.userData.loginType);
  }
  $scope.logVC = function (loginType, email, Password) {
    console.log("logVC from ");
    // loginModal.close('resetModel');
    var obj = {
      "email": email,
      "password": Password,
      "loginType": loginType
    };
    console.log("obj: " + JSON.stringify(obj));
    console.log("logVC");
    var api = "vc/login4VC";
    //var api = "http://localhost:5000/vc/teacherDetail" + "/" + id;
    //var api = "http://localhost:5000/vc/eventGet";
    console.log("api: " + api);
    httpFactory.post(api, obj).then(function (data) {
      var checkStatus = httpFactory.dataValidation(data);
      console.log("data--" + JSON.stringify(data.data));
      console.log("checkStatus" + checkStatus);
      console.log("data.message: " + data.data.message);
      if (checkStatus) {
        var datas = data.data;
        console.log("data.message: " + data.data.message);
        if (data.data.message == 'Profile Inactive') {
          var loginAlert = $uibModal.open({
            scope: $scope,
            templateUrl: '/html/templates/loginAlert.html',
            windowClass: 'show',
            backdropClass: 'static',
            keyboard: false,
            controller: function ($scope, $uibModalInstance) {
              $scope.message = "Your Profile is inactive, inform your system admin to verify it";
              console.log("$scope.eventDetails: " + JSON.stringify($scope.eventDetails));
            }
          })
          //alert("Your Profile is inactive, inform your system admin to verify it");
        } else if (data.data.message == 'Login Successfully') {
          console.log("Login Successfully");

          $scope.sessionSet(datas);
          userName = data.data.userName;
        } else {
          var loginAlert = $uibModal.open({
            scope: $scope,
            templateUrl: '/html/templates/loginAlert.html',
            windowClass: 'show',
            backdropClass: 'static',
            keyboard: false,
            controller: function ($scope, $uibModalInstance) {
              $scope.message = data.data.message;
              console.log("$scope.eventDetails: " + JSON.stringify($scope.eventDetails));
              $scope.close = function () {
                loginAlert.close('resetModel');

              }
            }
          })

        }
      } else {
        console.log("sorry");
      }
    });

  }

  $scope.sessionSet = function (data) {
    console.log("sessionSet-->");
    console.log("data: " + JSON.stringify(data));
    console.log(" data.sessionData: " + data.sessionData);
    // var encryptedUrl = CryptoJS.AES.encrypt(data.sessionData.url,"url");
    // var encryptedPswd = CryptoJS.AES.encrypt(data.sessionData.pswd,"pswd");
    // localStorage.setItem("encUrl",encryptedUrl); 
    // localStorage.setItem("encPswd",encryptedPswd);
    localStorage.setItem("sessionEnc", data.sessionData);
    console.log("localStorage.getItem(sessionEnc): " + localStorage.getItem("sessionEnc"));
    if (typeof (Storage) !== "undefined") {
      if (data.data.loginType == 'teacher') {
        var un = data.data.firstName + " " + data.data.lastName
        var userData = {
          "userName": un,
          "status": data.data.status,
          "email": data.data.teacherEmail,
          "loginType": data.data.loginType,
          "id": data.data._id,
          "schoolName": data.data.schoolName,
        }
        console.log("userData: " + JSON.stringify(userData));
        sessionAuthFactory.setAccess(userData);

        $scope.userData = sessionAuthFactory.getAccess("userData");
        userName = $scope.userData.userName;
        $scope.loginType = $scope.userData.loginType;
        $window.location.reload();

      } else if (data.data.loginType == 'studParent') {
        var un = data.data.firstName + " " + data.data.lastName
        var userData = {
          "userName": un,
          "status": data.data.status,
          "email": data.data.parentEmail,
          "loginType": data.data.loginType,
          "id": data.data._id,
          "schoolName": data.data.schoolName
        }
        sessionAuthFactory.setAccess(userData);

        $scope.userData = sessionAuthFactory.getAccess("userData");
        userName = $scope.userData.userName;
        $scope.loginType = $scope.userData.loginType;
        $window.location.reload();
      } else if (data.data.loginType == 'admin') {
        var un = data.data.firstName + " " + data.data.lastName
        var userData = {
          "userName": un,
          "status": data.data.status,
          "email": data.data.email,
          "loginType": data.data.loginType,
          "id": data.data._id,
          "schoolName": data.data.schoolName,
        }
        console.log("userData: " + JSON.stringify(userData));
        sessionAuthFactory.setAccess(userData);

        $scope.userData = sessionAuthFactory.getAccess("userData");
        userName = $scope.userData.userName;
        $scope.loginType = $scope.userData.loginType;
        $window.location.reload();
      } else {
        var un = data.data.firstName + " " + data.data.lastName
        var userData = {
          "userName": un,
          "status": data.data.status,
          "email": data.data.email,
          "loginType": data.data.loginType,
          "id": data.data._id

        }
        console.log("userData: " + JSON.stringify(userData));
        sessionAuthFactory.setAccess(userData);
        $scope.userData = sessionAuthFactory.getAccess("userData");
        userName = $scope.userData.userName;
        $scope.loginType = $scope.userData.loginType;
        $window.location.reload();
      }
    } else {
      var loginAlert = $uibModal.open({
        scope: $scope,
        templateUrl: '/html/templates/dashboardwarning.html',
        windowClass: 'show',
        backdropClass: 'static',
        keyboard: false,
        controller: function ($scope, $uibModalInstance) {
          $scope.message = "Sorry, your browser does not support Web Storage...";
        }
      })
    }
    console.log("<--sessionSet");
  }
  $scope.vcLogin = function () {
    console.log("vcLogin-->");
    loginModal = $uibModal.open({
      scope: $scope,
      templateUrl: '/html/templates/loginPopup.html',
      windowClass: 'show',
      backdropClass: 'show',
      controller: function ($scope, $uibModalInstance) {
        console.log("<--vcLogin");
      }
    })
  }
  $rootScope.TimeTable_timing = [{
      "startsAt": "09:00",
      "endsAt": "09:45",
      "meridian": 'AM'
    },
    {
      "startsAt": "9:45",
      "endsAt": "10:30",
      "meridian": 'AM'
    },
    {
      "startsAt": "10:30",
      "endsAt": "11:15",
      "meridian": 'AM'
    },
    {
      "startsAt": "11:15",
      "endsAt": "12:00",
      "meridian": 'AM'
    },
    {
      "startsAt": "01:00",
      "endsAt": "01:45",
      "meridian": 'PM'
    },
    {
      "startsAt": "01:45",
      "endsAt": "02:30",
      "meridian": 'PM'
    },
    {
      "startsAt": "02:30",
      "endsAt": "03:15",
      "meridian": 'PM'
    },
    {
      "startsAt": "03:15",
      "endsAt": "04:00",
      "meridian": 'PM'
    }
  ];



});