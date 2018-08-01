careatorApp.controller('careator_dashboardCtrl', function ($scope, $rootScope, $filter, $timeout, careatorSessionAuth, careatorHttpFactory) {
    console.log("careator_dashboardCtrl==>");
    $scope.clock = "loading clock..."; // initialise the time variable
    $scope.tickInterval = 1000 //ms
    $scope.propertyJson = $rootScope.propertyJson;
    $scope.getLogin_hostDetailsById = function (id) {
        console.log("getLogin_hostDetailsById-->: " + id);
        var api = "https://norecruits.com/careator_getUser/careator_getUserById/" + id;
        console.log("api: " + api);
        careatorHttpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("checkStatus: " + checkStatus);
            if (checkStatus) {
                if (data.data.data[0].sessionRandomId == localStorage.getItem("sessionRandomId")) {
                    // var sessionHostBlock;
                    console.log("data.data.data[0].isDisconnected: " + data.data.data[0].isDisconnected);
                    if (data.data.data[0].isDisconnected == 'yes' || data.data.data[0].isDisconnected == undefined) {
                        $scope.sessionHostBlock = 'no';
                    } else {
                        $scope.sessionHostBlock = 'yes';
                    }
                    console.log("$scope.sessionHostBlock: " + $scope.sessionHostBlock);
                } else {
                    console.log("localstorage session randomId(" + localStorage.getItem('sessionRandomId') + ") is not matched with db data (" + data.data.data[0].sessionRandomId + ")");
                    /* ##### Start: Logout Logic  ##### */
                    var id = userData.userId;
                    var api = "https://norecruits.com/careator_loggedin/getLoggedinSessionURLById/" + id;
                    console.log("api: " + api);
                    careatorHttpFactory.get(api).then(function (data) {
                        console.log("data--" + JSON.stringify(data.data));
                        var checkStatus = careatorHttpFactory.dataValidation(data);
                        console.log("checkStatus: " + checkStatus);
                        if (checkStatus) {
                            if (data.data.data.sessionURL != undefined) {
                                var sessionURL = data.data.data.sessionURL;
                                console.log(data.data.message);
                                console.log("sessionURL: " + sessionURL);
                                socket.emit("comm_logoutSession", {
                                    "userId": $scope.userData.userId,
                                    "email": $scope.userData.email,
                                    "sessionURL": sessionURL,
                                    "sessionRandomId": data.data.data.sessionRandomId
                                }); /* ### Note: Logout notification to server ### */
                            } else {
                                socket.emit("comm_logoutSession", {
                                    "userId": $scope.userData.userId,
                                    "email": $scope.userData.email,
                                    "sessionURL": "",
                                    "sessionRandomId": data.data.data.sessionRandomId
                                }); /* ### Note: Logout notification to server ### */
                            }
                        } else {
                            console.log("Sorry");
                            console.log(data.data.message);
                        }
                    })
                    /* ##### End: Logout Logic  ##### */
                }



                console.log(data.data.message);

            } else {
                console.log("Sorry");
                console.log(data.data.message);
            }
        })
    }

    var tick = function () {
        $scope.clock = new Date()
        $scope.hour = $filter('date')($scope.clock, 'HH');
        $scope.min = $filter('date')($scope.clock, 'mm');
        $scope.sec = $filter('date')($scope.clock, 'ss');
        $timeout(tick, $scope.tickInterval); // reset the timer
    }
    // Start the timer
    $timeout(tick, $scope.tickInterval);

    var userData = careatorSessionAuth.getAccess("userData");
    $scope.userData = userData;
    console.log("userData==>: " + JSON.stringify(userData));
    if (userData != undefined) {
        $scope.getLogin_hostDetailsById(userData.userId);
    }
    if (userData == undefined || userData.email == null) {
        $scope.getLogin_hostDetailsById(localStorage.getItem("userId"));
        var userData = {
            "email": localStorage.getItem("email"),
            "userName": localStorage.getItem("userName"),
            "empId": localStorage.getItem("empId"),
            "userId": localStorage.getItem("userId"),
            "sessionRandomId": localStorage.getItem("sessionRandomId")
        }
        if (localStorage.getItem("videoRights") == 'yes') {
            $scope.videoRights = "yes";
            userData.videoRights = "yes";
        }
        if (localStorage.getItem("chatRights") == 'yes') {
            userData.chatRights = "yes";
            // $scope.getChatGroupListById(localStorage.getItem("userId"));
        }
        if (localStorage.getItem("chatStatus")) {
            userData.chatStatus = localStorage.getItem("chatStatus");
        }
        console.log("localStorage.getItem(restrictedTo): " + JSON.stringify(localStorage.getItem("restrictedTo")));
        if (localStorage.getItem("restrictedTo")) {
            var restrictedUser = localStorage.getItem("restrictedTo");
            var restrictedArray = restrictedUser.split(',');
            console.log("restrictedArray: " + JSON.stringify(restrictedArray));
            userData.restrictedTo = restrictedArray;
        }
        if (localStorage.getItem("profilePicPath")) {
            userData.profilePicPath = localStorage.getItem("profilePicPath");
        }

        careatorSessionAuth.setAccess(userData);
        var userData = careatorSessionAuth.getAccess("userData");
        $scope.userData = userData;
        console.log("userData: " + JSON.stringify(userData));
    }

    $scope.name = userData.userName;
    if (userData.videoRights == 'yes') {
        $scope.videoRights = "yes";
    } else {
        $scope.videoRights = "no";
    }

    $scope.getAdmin_email_id = function () {
        console.log("getAdmin_email_id-->");
        var api = "https://norecruits.com/careator_adminBasicData/getAdminObjectId";
        console.log("api: " + api);
        careatorHttpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("checkStatus: " + checkStatus);
            if (checkStatus) {
                $rootScope.adminId = data.data.data;
                console.log("$rootScope.adminId: " + $rootScope.adminId);
                console.log(data.data.message);

            } else {
                console.log("Sorry");
                console.log(data.data.message);
            }
        })

    }
    $scope.getAdmin_email_id();

    $scope.videoUrlNavigation = function () {
        console.log("videoUrlNavigation-->");
        console.log("localStorage.getItem(sessionUrlId): " + localStorage.getItem("sessionUrlId"));

        if (localStorage.getItem("sessionUrlId")) {
            alert("You have to disconnect your old session in-order to open new");
        } else {
            window.open('https://norecruits.com/careator', '_blank');
        }

    }
    $scope.logout = function () {
        console.log("logout-->");
        $("#logoutConfirmationButton").trigger("click");
        $scope.userLogout = function () {
            var id = userData.userId;
            var api = "https://norecruits.com/careator_loggedin/getLoggedinSessionURLById/" + id;
            console.log("api: " + api);
            careatorHttpFactory.get(api).then(function (data) {
                console.log("data--" + JSON.stringify(data.data));
                var checkStatus = careatorHttpFactory.dataValidation(data);
                console.log("checkStatus: " + checkStatus);
                if (checkStatus) {

                    if (data.data.data != undefined) {
                        if (data.data.data.sessionURL != undefined) {
                            var sessionURL = data.data.data.sessionURL;
                            console.log(data.data.message);
                            console.log("sessionURL: " + sessionURL);
                            socket.emit("comm_logout", {
                                "userId": $scope.userData.userId,
                                "email": $scope.userData.email,
                                "sessionURL": sessionURL,
                                "sessionRandomId": $scope.userData.sessionRandomId
                            }); /* ### Note: Logout notification to server ### */

                        } else {
                            socket.emit("comm_logout", {
                                "userId": $scope.userData.userId,
                                "email": $scope.userData.email,
                                "sessionURL": sessionURL,
                                "sessionRandomId": $scope.userData.sessionRandomId
                            }); /* ### Note: Logout notification to server ### */
                        }
                    } else {
                        socket.emit("comm_logout", {
                            "userId": $scope.userData.userId,
                            "email": $scope.userData.email,
                            "sessionURL": "",
                            "sessionRandomId": $scope.userData.sessionRandomId
                        }); /* ### Note: Logout notification to server ### */
                    }
                } else {
                    console.log("Sorry");
                    console.log(data.data.message);
                }
            })

        }

    }
    // $scope.closeYourOldSession = function(){
    //     console.log("closeYourOldSession-->");
    //     alert("Close your old session in-order to do new session");
    //     window.open('https://norecruits.com/careator','_blank'); 

    // }
    $scope.doRedirect = function () {
        console.log("$scope.doRedirect--->");
        window.location.href = "https://norecruits.com";
    }

    socket.on('comm_aboutUserEdit', function (data) {
        console.log("***comm_aboutUserEdit-->");
        if (data.id == userData.userId) {
            var id = userData.userId;
            var api = "https://norecruits.com/careator_getUser/careator_getUserById/" + id;
            console.log("api: " + api);
            careatorHttpFactory.get(api).then(function (data) {
                console.log("data--" + JSON.stringify(data.data));
                var checkStatus = careatorHttpFactory.dataValidation(data);
                if (checkStatus) {
                    $scope.getUserById = data.data.data[0];
                    console.log("getUserById: " + JSON.stringify($scope.getUserById));
                    console.log("userData: " + JSON.stringify(userData));

                    var restrictedTo = $scope.getUserById.restrictedTo;
                    var restrictedArray = [];
                    for (var x = 0; x < restrictedTo.length; x++) {
                        restrictedArray.push(restrictedTo[x].userId);
                    }
                    console.log("restrictedArray: " + JSON.stringify(restrictedArray));
                    $scope.restrictedArray = restrictedArray;
                    var userData = {
                        "email": $scope.getUserById.email,
                        "userName": $scope.getUserById.name,
                        "empId": $scope.getUserById.empId,
                        "userId": $scope.getUserById._id,
                        "restrictedTo": restrictedArray
                    }
                    if ($scope.getUserById.videoRights == 'yes' && $scope.getUserById.chatRights == 'yes') {
                        userData.videoRights = "yes";
                        userData.chatRights = "yes";
                        $scope.videoRights = "yes";
                        localStorage.removeItem("videoRights");
                        localStorage.setItem("videoRights", "yes");
                    } else if ($scope.getUserById.videoRights == 'no' && $scope.getUserById.chatRights == 'yes') {
                        userData.chatRights = "yes";
                        userData.videoRights = "no";
                        $scope.videoRights = "no";
                        localStorage.removeItem("videoRights");
                        localStorage.setItem("videoRights", "no");
                    } else if ($scope.getUserById.videoRights == 'yes' && $scope.getUserById.chatRights == 'no') {
                        userData.chatRights = "no";
                        userData.videoRights = "yes";
                        $scope.videoRights = "yes";
                        localStorage.removeItem("videoRights");
                        localStorage.setItem("videoRights", "yes");
                    } else if ($scope.getUserById.videoRights == 'no' && $scope.getUserById.chatRights == 'no') {
                        userData.chatRights = "no";
                        userData.videoRights = "no";
                        $scope.videoRights = "no";
                        localStorage.removeItem("videoRights");
                        localStorage.setItem("videoRights", "no");
                    }
                    console.log("userData: " + JSON.stringify(userData));
                    careatorSessionAuth.clearAccess("userData");
                    careatorSessionAuth.setAccess(userData);
                    var userData = careatorSessionAuth.getAccess("userData");
                    console.log("***userData: " + JSON.stringify(userData));
                    console.log(data.data.message);
                } else {
                    console.log("Sorry");
                    console.log(data.data.message);
                }
            })
        }
    })
    /* #### Start: Logout request from server(index.js) #### */
    socket.on('comm_logoutNotifyToUserById', function (data) {
        console.log("***comm_logoutNotifyToUserById-->: " + JSON.stringify(data));
        var obj = {
            "userId": $scope.userData.userId,
            "email": $scope.userData.email,
            "sessionRandomId": $scope.userData.sessionRandomId
        }
        console.log("obj: " + JSON.stringify(obj));
        if (data.userId == $scope.userData.userId && data.email == $scope.userData.email) {
            console.log("started to remove localstorage");
            localStorage.removeItem("careatorEmail");
            localStorage.removeItem("careator_remoteEmail");
            localStorage.removeItem("email");
            localStorage.removeItem("userName");
            localStorage.removeItem("empId");
            localStorage.removeItem("userId");
            localStorage.removeItem("videoRights");
            localStorage.removeItem("chatRights");
            localStorage.removeItem("restrictedTo");
            localStorage.removeItem("chatStatus");
            localStorage.removeItem("profilePicPath");
            localStorage.removeItem("sessionRandomId");
            careatorSessionAuth.clearAccess("userData");
            $scope.doRedirect();
        }
        // else if (data.userId == $scope.userData.userId && data.email == $scope.userData.email && data.sessionRandomId == $scope.userData.sessionRandomId) {
        //     console.log("NO need of logout")
        // }
    })
    socket.on('comm_logoutNotifyToUserById_beczOfDeadSessionRandomId', function (data) {
        console.log("comm_logoutNotifyToUserById_beczOfDeadSessionRandomId-->: " + JSON.stringify(data));
        if (data.userId == $scope.userData.userId && data.email == $scope.userData.email) {
            console.log("started to remove localstorage");
            localStorage.removeItem("careatorEmail");
            localStorage.removeItem("careator_remoteEmail");
            localStorage.removeItem("email");
            localStorage.removeItem("userName");
            localStorage.removeItem("empId");
            localStorage.removeItem("userId");
            localStorage.removeItem("videoRights");
            localStorage.removeItem("chatRights");
            localStorage.removeItem("restrictedTo");
            localStorage.removeItem("chatStatus");
            localStorage.removeItem("profilePicPath");
            localStorage.removeItem("sessionRandomId");
            careatorSessionAuth.clearAccess("userData");
            $scope.doRedirect();
        }
    })
    socket.on('comm_resetNotifyToUserById', function (data) {
        console.log("***comm_resetNotifyToUserById-->: " + JSON.stringify(data));
        console.log("$scope.userData.userId-->: " + $scope.userData.userId);
        if (data.id == $scope.userData.userId) {
            console.log("started the process for logout");
            $scope.getLogin_hostDetailsById($scope.userData.userId);
        }
    })
    socket.on('comm_sessionCreateUpdate', function (data) {
        console.log("comm_sessionCreateUpdate-->");
        if (data.email == $scope.userData.email) {
            console.log("started to update $scope.sessionHostBlock");
            $scope.sessionHostBlock = "yes";
        }
    })

    /* #### End: Logout request from server(index.js) #### */


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
    var w;
    $scope.navigateintoBoth_CVoption = function () {
        console.log("navigateintoBoth_CVoption-->");
        if (!w || w.closed) {
            w = window.open("https://norecruits.com/careator", "_blank");
        } else {
            console.log('window is already opened');
            $("#closeConfirmationButton").trigger("click");
        }

        $scope.focust = function () {
            w.focus();
        }
    }


    /* ##### Start: on window only one open tab should be there for this page  ##### */
    // if (+localStorage.tabCount > 0) 
    //     var r = confirm("You have already open this url");
    //     if (r == true) {
    //         close()

    //     } else
    //         localStorage.tabCount = 0;

    //     localStorage.tabCount = +localStorage.tabCount + 1;
    //     window.onunload = function () {
    //         localStorage.tabCount = +localStorage.tabCount - 1;

    //     };


    // if (+localStorage.tabCount > 0)
    // $("#closeConfirmationButton").trigger("click");

    //     $scope.userclose=function(){
    //         console.log("userclose-->");
    //         window.close();
    // }
    /* ##### End: on window only one open tab should be there for this page  ##### */
})