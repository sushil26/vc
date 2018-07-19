careatorApp.controller('careator_dashboardCtrl', function ($scope, $rootScope, $filter, $timeout, careatorSessionAuth, careatorHttpFactory) {
    console.log("careator_dashboardCtrl==>");
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

    var userData = {
        "email": localStorage.getItem("email"),
        "userName": localStorage.getItem("userName"),
        "empId": localStorage.getItem("empId"),
        "userId": localStorage.getItem("userId"),
    }
    if (localStorage.getItem("videoRights") == 'yes') {
        userData.videoRights = "yes";
    }
    if (localStorage.getItem("chatRights") == 'yes') {
        userData.chatRights = "yes";
        // $scope.getChatGroupListById(localStorage.getItem("userId"));
    }
    console.log("localStorage.getItem(restrictedTo): " + JSON.stringify(localStorage.getItem("restrictedTo")));
    if (localStorage.getItem("restrictedTo")) {
       
       
        userData.restrictedTo =localStorage.getItem("restrictedTo");
    }

    careatorSessionAuth.setAccess(userData);
    var userData = careatorSessionAuth.getAccess("userData");
    console.log("userData: " + JSON.stringify(userData));
    $scope.name = userData.userName;

    $scope.logout = function () {
        console.log("logout-->");
        localStorage.removeItem("careatorEmail");
        localStorage.removeItem("sessionUrlId");
        localStorage.removeItem("careator_remoteEmail");
        localStorage.removeItem("videoRights");
        localStorage.removeItem("chatRights");
        localStorage.removeItem("sessionUrlId");
        localStorage.removeItem("careator_remoteEmail");
        careatorSessionAuth.clearAccess("userData");
        window.location.href = "https://norecruits.com";
    }




    ///////////////Hamburger/////////////////////////
    $('#nav-icon1,#nav-icon2,#nav-icon3,#nav-icon4').click(function () {
        $(this).toggleClass('open');
    });

    //////////////toggle//////////////////////////////
    $('#tog').click(function () {

        $('#tog').css({
            "display": "none"
        });
        $('#fog').css({
            "display": "inline"
        });

    });
    $('#fog').click(function () {

        $('#tog').css({
            "display": "inline"
        });
        $('#fog').css({
            "display": "none"
        });

    });





})