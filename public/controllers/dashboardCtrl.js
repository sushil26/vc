app.controller('dashboardController', function ($scope, $rootScope, $timeout, $window, httpFactory, $uibModal, sessionAuthFactory, $filter, $timeout) {

    console.log("dashboardController==>");

    //$("#mobile-nav").css("display", "none");

    $scope.clock = "loading clock..."; // initialise the time variable
    $scope.tickInterval = 1000 //ms
    $scope.propertyJson = $rootScope.propertyJson;

    var tick = function () {
        $scope.clock = new Date()
        $scope.hour = $filter('date')($scope.clock, 'HH');
        $scope.min = $filter('date')($scope.clock, 'mm');
        $scope.sec = $filter('date')($scope.clock, 'ss');
        $timeout(tick, $scope.tickInterval); // reset the timer
    }
    // Start the timer
    $timeout(tick, $scope.tickInterval);
    $scope.userData = sessionAuthFactory.getAccess("userData");
    $scope.loginType = $scope.userData.loginType;
    $scope.userName = $scope.userData.userName;
    /* ##### Start dashboard submenu hide declaration ##### */
    $scope.sideBarMenu = false;
    $scope.events_subMenu = true;
    $scope.academic_subMenu = true;
    $scope.setting_subMenu = true;
    $scope.comm_subMenu = true;
    $scope.quickMsg_subMenu = true;
    $scope.numberOfNotif_event = 0;
    $scope.numberOfNotif_quickMsg = 0;

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
                console.log("  $scope.todayDate: " + $scope.todayDate);
                console.log("consolidateDate: " + $scope.consolidateDate);
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
        var api = $scope.propertyJson.VC_eventGet + "/" + id;
        console.log("api: " + api);
        //var api = "http://localhost:5000/vc/eventGet"+ "/" + id;;
        $scope.calendarOwner = "Your";
        httpFactory.get(api).then(function (data) {
            $scope.numberOfNotif_event = 0;
            var checkStatus = httpFactory.dataValidation(data);
            // console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.eventData = data.data.data;
                // ownerEvents = [];
                for (var x = 0; x < $scope.eventData.length; x++) {
                    console.log("$scope.eventData[" + x + "]: " + JSON.stringify($scope.eventData[x]));
                    var startD = new Date($scope.eventData[x].start);
                    console.log("$scope.eventData[x].startAt: " + $scope.eventData[x].startAt + " $scope.todayDate: " + $scope.todayDate);
                    if ($scope.eventData[x].notificationNeed == 'yes' && startD >= $scope.todayDate) {
                        if ($scope.eventData[x].userId != $scope.userData.id) {
                            console.log("not equal");
                            $scope.numberOfNotif_event = $scope.numberOfNotif_event + 1;
                        }
                    }
                }
            }
            else {
                //alert("Event get Failed");
            }
        })
    }

    $scope.eventGet();

    $scope.getSelectedStudentPersonalData = function () {
        console.log("get Selected Student PersonalData-->");
        var id = $scope.userData.id;
        var api = $scope.propertyJson.VC_studentPersonalData + "/" + id;
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            // console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.studentPersonalData = data.data.data;
                $scope.studCS = $scope.studentPersonalData[0].cs;
                console.log("  $scope.studCS: " + JSON.stringify($scope.studCS));
                console.log("$scope.studentPersonalData: " + JSON.stringify($scope.studentPersonalData));
                $scope.quickMsgGet();
            }
            else {
                //alert("Event get Failed");
            }

        })
        console.log("<--get Selected Student PersonalData");
    }

    $scope.quickMsgGet = function () {
        console.log("quickMsgGet-->");
        var id = $scope.userData.id;
        //console.log("$scope.studCS: " + JSON.stringify($scope.studCS));
        if ($scope.loginType == 'studParent') {
            var clas = $scope.studCS[0].class;
            var section = $scope.studCS[0].section;
            var api = $scope.propertyJson.VC_quickMsgGetForStud + "/" + id + "/" + clas + "/" + section;
        }
        else if ($scope.loginType == 'teacher') {
            var api = $scope.propertyJson.VC_quickMsgGet + "/" + id;
        }

        //var api = "http://localhost:5000/vc/eventGet"+ "/" + id;;
        $scope.calendarOwner = "Your";

        httpFactory.get(api).then(function (data) {
            $scope.numberOfNotif_quickMsg = 0;
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.eventData = data.data.data;
                for (var x = 0; x < $scope.eventData.length; x++) {
                    console.log("$scope.eventData[" + x + "]: " + JSON.stringify($scope.eventData[x]));
                    console.log("$scope.eventData[x].userId: " + $scope.eventData[x].userId + " $scope.userData.id: " + $scope.userData.id);
                    if ($scope.eventData[x].notificationNeed == 'yes' && $scope.eventData[x].userId != $scope.userData.id) {
                        $scope.numberOfNotif_quickMsg = $scope.numberOfNotif_quickMsg + 1;
                    }
                }
            }
            else {
                //alert("Event get Failed");
            }
        })
    }
    if ($scope.loginType == 'studParent') {
        $scope.getSelectedStudentPersonalData();

    }
    else {

        $scope.quickMsgGet();
    }
    $scope.iconMenuClick = function () {
        console.log("iconMenuClick--> ");
        var element = document.getElementById("container");
        if (element.classList.contains("sidebar-closed")) {
            console.log("if is true");
            element.classList.remove("sidebar-closed");
            $scope.sideBarMenu = false;
            $scope.events_subMenu = true;
            $scope.academic_subMenu = true;
            $scope.setting_subMenu = true;
            $scope.comm_subMenu = true;
            $scope.quickMsg_subMenu = true;
        } else {
            console.log("if is false");
            $scope.sideBarMenu = true;
            element.classList.add("sidebar-closed");
            // document.getElementById("profile").style.marginTop = "0px";
        }
        console.log("<--iconMenuClick");
    }
    //$scope.iconMenuClick();
    $scope.eventClick = function (submenu) {
        console.log("eventClick-->: " + submenu);
        if (submenu == "events_subMenu") {
            if ($scope.events_subMenu == true) {
                $scope.events_subMenu = false;
            } else {
                $scope.events_subMenu = true;
            }
            $scope.academic_subMenu = true;
            $scope.setting_subMenu = true;
            $scope.quickMsg_subMenu = true;
            $scope.comm_subMenu = true;
        } else if (submenu == "academic_subMenu") {
            console.log(" $scope.academic_subMenu : " + $scope.academic_subMenu);
            if ($scope.academic_subMenu == true) {
                $scope.academic_subMenu = false;
            } else {
                $scope.academic_subMenu = true;
            }
            $scope.events_subMenu = true;
            $scope.comm_subMenu = true;
            $scope.setting_subMenu = true;
            $scope.quickMsg_subMenu = true;
        } else if (submenu == "comm_subMenu") {
            console.log(" $scope.comm_subMenu : " + $scope.comm_subMenu);
            if ($scope.comm_subMenu == true) {
                $scope.comm_subMenu = false;
            } else {
                $scope.comm_subMenu = true;
            }
            $scope.events_subMenu = true;
            $scope.academic_subMenu = true;
            $scope.setting_subMenu = true;
            $scope.quickMsg_subMenu = true;
        }
        else if (submenu == "quickMsg_subMenu") {
            console.log(" $scope.quickMsg_subMenu : " + $scope.quickMsg_subMenu);
            if ($scope.quickMsg_subMenu == true) {
                $scope.quickMsg_subMenu = false;
            } else {
                $scope.quickMsg_subMenu = true;
            }
            $scope.events_subMenu = true;
            $scope.academic_subMenu = true;
            $scope.setting_subMenu = true;
            $scope.comm_subMenu = true;
        }
        else {
            if ($scope.setting_subMenu == true) {
                $scope.setting_subMenu = false;
            } else {
                $scope.setting_subMenu = true;
            }
            $scope.events_subMenu = true;
            $scope.academic_subMenu = true;
            $scope.comm_subMenu = true;
        }
        console.log("<--eventClick: " + submenu);
    }
    /* ##### End dashboard submenu hide declaration ##### */

    $scope.logOut = function () {
        console.log("logOut-->");
        sessionAuthFactory.clearAccess();
        $scope.userData = sessionAuthFactory.getAccess("userData");
        window.location.href = "https://norecruits.com";
        console.log("<--logOut");
    }

    $scope.homeClick = function () {
        console.log("homeClick-->");
        window.location.href = "https://norecruits.com";
        console.log("<--homeClick");
    }

    /* ##### Strat function call request from another controller  ##### */
    $rootScope.$on("CallParent_quickMsgGet", function () {
        console.log("CallParent_quickMsgGet-->");
        if ($scope.loginType == 'studParent') {
            console.log("CallParent_quickMsgGet with login Type: " + $scope.loginType);
            $scope.getSelectedStudentPersonalData();
        }
        else if ($scope.loginType == 'teacher') {
            console.log("CallParent_quickMsgGet with login Type: " + $scope.loginType);
            $scope.quickMsgGet();
        }
    })
    $rootScope.$on("CallParent_eventGet", function () {
        $scope.eventGet();
    })


    /* ##### End function call request from another controller  ##### */

})