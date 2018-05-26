app.controller('dashboardController', function ($scope, $rootScope, $window, httpFactory, $uibModal, sessionAuthFactory, $filter, $timeout) {

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

    $scope.iconMenuClick = function () {
        console.log("iconMenuClick--> ");
        var element = document.getElementById("container");
        // var x = window.matchMedia("(max-width: 768px)")
        if (element.classList.contains("sidebar-closed")) {
            // if (x.matches) {
            //     document.getElementById("profile").style.marginTop = "195px";
            // }
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
        window.location.href = "https://vc4all.in";
        console.log("<--logOut");
    }

    $scope.homeClick = function () {
        console.log("homeClick-->");
        window.location.href = "https://vc4all.in";
        console.log("<--homeClick");
    }








})