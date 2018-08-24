careatorApp.controller('careator_dashboardCtrl', function ($scope, $rootScope, $filter, $timeout, $window, careatorSessionAuth, careatorHttpFactory, SweetAlert) {
    console.log("careator_dashboardCtrl==>");
    $scope.clock = "loading clock..."; // initialise the time variable
    $scope.tickInterval = 1000 //ms
    $scope.propertyJson = $rootScope.propertyJson;
    console.log("localStorage.getItem(careatorEmail): " + localStorage.getItem("careatorEmail"));
    var userData = careatorSessionAuth.getAccess("userData");
    $scope.userData =userData;
    $scope.loginUserName = userData.firstName + " " + userData.lastName;
    $scope.userId = userData.userId;
    var orgId;
    if($scope.userData.loginType!= 'superAdmin'){
        orgId = $scope.userData.orgId;
    }
    

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
            } else {}
        })
        console.log("<--Get To Date");
    }
    $scope.getToDate();
    $scope.getLogin_hostDetailsById = function (id) {
        console.log("getLogin_hostDetailsById-->: " + id);
        var api = "https://norecruits.com/careator_getUser/careator_getUserById/" + id;
        console.log("api: " + api);
        careatorHttpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("checkStatus: " + checkStatus);
            if (checkStatus) {
                if (data.data.data[0].sessionRandomId ==  $scope.userData.sessionRandomId) {
                    // var sessionHostBlock;
                    console.log("data.data.data[0].isDisconnected: " + data.data.data[0].isDisconnected);
                    if (data.data.data[0].isDisconnected == 'yes' || data.data.data[0].isDisconnected == undefined) {
                        $scope.sessionHostBlock = 'no';
                    } else {
                        $scope.sessionHostBlock = 'yes';
                    }
                    console.log("$scope.sessionHostBlock: " + $scope.sessionHostBlock);
                } else {
                    console.log("localstorage session randomId(" + $scope.userData.sessionRandomId + ") is not matched with db data (" + data.data.data[0].sessionRandomId + ")");
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
    $scope.loginType = userData.loginType;
    console.log("userData==>: " + JSON.stringify(userData));
    if (userData != undefined) {
        $scope.getLogin_hostDetailsById(userData.userId);
    }
    // if (userData == undefined || userData.email == null) {
    //     $scope.getLogin_hostDetailsById(localStorage.getItem("userId"));
    //     var userData = {
    //         "email": localStorage.getItem("email"),
    //         "userName": localStorage.getItem("userName"),
    //         "empId": localStorage.getItem("empId"),
    //         "userId": localStorage.getItem("userId"),
    //         "sessionPassword": localStorage.getItem("sessionPassword"),
    //         "sessionRandomId": localStorage.getItem("sessionRandomId"),
            
    //     }
    //     if (localStorage.getItem("videoRights") == 'yes') {
    //         $scope.videoRights = "yes";
    //         userData.videoRights = "yes";
    //     }
    //     if (localStorage.getItem("chatRights") == 'yes') {
    //         userData.chatRights = "yes";
    //         // $scope.getChatGroupListById(localStorage.getItem("userId"));
    //     }
    //     if (localStorage.getItem("chatStatus")) {
    //         userData.chatStatus = localStorage.getItem("chatStatus");
    //     }
    //     console.log("localStorage.getItem(restrictedTo): " + JSON.stringify(localStorage.getItem("restrictedTo")));
    //     if (localStorage.getItem("restrictedTo")) {
    //         var restrictedUser = localStorage.getItem("restrictedTo");
    //         var restrictedArray = restrictedUser.split(',');
    //         console.log("restrictedArray: " + JSON.stringify(restrictedArray));
    //         userData.restrictedTo = restrictedArray;
    //     }
    //     if (localStorage.getItem("profilePicPath")) {
    //         userData.profilePicPath = localStorage.getItem("profilePicPath");
    //     }

    //     careatorSessionAuth.setAccess(userData);
    //     var userData = careatorSessionAuth.getAccess("userData");
    //     $scope.userData = userData;
    //     console.log("userData: " + JSON.stringify(userData));
    // }

    $scope.name = userData.userName;
    if (userData.videoRights == 'yes') {
        $scope.videoRights = "yes";
    } else {
        $scope.videoRights = "no";
    }


    // $scope.instantConference = function () {
    //     console.log("instantConference-->");

    // }

    $scope.getAdmin_email_id = function () {
        console.log("getAdmin_email_id-->");
        if($scope.userData.loginType=='admin'){
            var api = "https://norecruits.com/careator_adminBasicData/getSuperAdminObjectId";
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
       else if($scope.userData.loginType=='employee'){
        var api = "https://norecruits.com/careator_adminBasicData/getAdminObjectIdByOrgId/"+orgId;
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
       else if($scope.userData.loginType=='superAdmin'){
        var api = "https://norecruits.com/careator_adminBasicData/getAllAdminObjectIdByOrgId";
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
       

    }
    $scope.getAdmin_email_id();

    $scope.videoUrlNavigation = function () {
        console.log("videoUrlNavigation-->");
        console.log("localStorage.getItem(sessionUrlId): " + localStorage.getItem("sessionUrlId"));

        if (localStorage.getItem("sessionUrlId")) {
            SweetAlert.swal({
                title: "Disconnected",
                type: "warning",
                text: "You have to disconnect your old session in-order to open new",
            });
            // alert("You have to disconnect your old session in-order to open new");
        } else {
            window.open('https://norecruits.com/careator', '_blank');
        }

    }
    $scope.logout = function () {
        console.log("logout-->");
        SweetAlert.swal({
                title: "Have you closed all the sessions?", //Bold text
                text: "It will close all your open sessions", //light text
                type: "warning", //type -- adds appropiriate icon
                showCancelButton: true, // displays cancel btton
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Sure",
                closeOnConfirm: false, //do not close popup after click on confirm, usefull when you want to display a subsequent popup
                closeOnCancel: false
            },
            function (isConfirm) { //Function that triggers on user action.
                if (isConfirm) {
                    SweetAlert.swal({
                        title: "Logged Out",
                        type: "success"
                    });
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
                                        "sessionRandomId": $scope.userData.sessionRandomId,
                                        "orgId":$scope.userData.orgId
                                    }); /* ### Note: Logout notification to server ### */

                                } else {
                                    socket.emit("comm_logout", {
                                        "userId": $scope.userData.userId,
                                        "email": $scope.userData.email,
                                        "sessionURL": sessionURL,
                                        "sessionRandomId": $scope.userData.sessionRandomId,
                                        "orgId":$scope.userData.orgId
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
                } else {
                    SweetAlert.swal({
                        title: "Your still logged in",
                        type: "info"
                    });
                }
            }

        )
        // $("#logoutConfirmationButton").trigger("click");
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
            localStorage.removeItem("sessionPassword");
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
            localStorage.removeItem("sessionPassword");
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
        console.log("toggle click");
        $(this).toggleClass('open');
    });

    var w;
    $scope.navigateintoBoth_CVoption = function () {
        console.log("navigateintoBoth_CVoption-->");
        if (!w || w.closed) {
            localStorage.setItem("careatorEmail", userData.email);
            localStorage.setItem("sessionPassword", userData.sessionPassword);
            var dt = $scope.todayDate;
            var dy = dt.getDay().toString();
            var fy = dt.getFullYear().toString();
            var m = dt.getMonth().toString();
            var hr = dt.getHours().toString();
            var date = dy.concat(fy, m, hr);
            urlDate = date;
            // w = window.open("https://norecruits.com/careator", "_blank");
            var SIGNALING_SERVER = "https://norecruits.com";
            signaling_socket = io(SIGNALING_SERVER);
            signaling_socket.on('connect', function () {
                console.log("signaling_socket connect-->");
                signaling_socket.on('message', function (config) {
                    console.log("signaling_socket message-->");
                    queryLink = config.queryId;
                    peerNew_id = config.peer_id;
                    var url = "https://norecruits.com/vc4all_conf/" + peerNew_id + "/" + urlDate;
                    // window.location.href = url;
                    var api = "https://norecruits.com/careator/setCollection";
                    console.log("api: " + api);
                    var obj = {
                        "email": localStorage.getItem('careatorEmail'),
                        "url": url
                    }
                    console.log("obj: " + JSON.stringify(obj));
                    careatorHttpFactory.post(api, obj).then(function (data) {
                        var checkStatus = careatorHttpFactory.dataValidation(data);
                        console.log("data--" + JSON.stringify(data.data));
                        console.log("checkStatus--" + checkStatus);
                        if (checkStatus) {
                            localStorage.setItem("sessionUrlId", peerNew_id);
                            console.log("url: " + url);
                            w = window.open(url, '_blank');
                            $window.close();
                            console.log("***");
                            // $window.open(url, "_blank");

                        } else {
                            console.log("Sorry");
                        }
                    })
                })
            })
        } else {
            SweetAlert.swal({
                    title: "window is already opened", //Bold text
                    text: "we will take you the desired page!", //light text
                    type: "warning", //type -- adds appropiriate icon
                    showCancelButton: true, // displays cancel btton
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Go to the page",
                    closeOnConfirm: false, //do not close popup after click on confirm, usefull when you want to display a subsequent popup
                    closeOnCancel: false
                },
                function (isConfirm) { //Function that triggers on user action.
                    if (isConfirm) {
                        w.focus();
                    } else {
                        SweetAlert.swal({
                            title: "Cancelled",
                            text: "You have entered cancel you are still in same Page",
                            type: "info"
                        });

                    }
                }

            )

        }


    }




    // ###################################################################################


    $scope.initializeJS = function () {

        //tool tips
        $('.tooltips').tooltip();

        //popovers
        $('.popovers').popover();

        //custom scrollbar
        //for html


        //sidebar dropdown menu
        $('#sidebar .sub-menu > a').click(function () {
            var last = $('.sub-menu.open', $('#sidebar'));
            $('.menu-arrow').removeClass('arrow_carrot-right');
            $('.sub', last).slideUp(200);
            var sub = $(this).next();
            if (sub.is(":visible")) {
                $('.menu-arrow').addClass('arrow_carrot-right');
                sub.slideUp(200);
            } else {
                $('.menu-arrow').addClass('arrow_carrot-down');
                sub.slideDown(200);
            }
            var o = ($(this).offset());
            diff = 200 - o.top;
            if (diff > 0)
                $("#sidebar").scrollTo("-=" + Math.abs(diff), 500);
            else
                $("#sidebar").scrollTo("+=" + Math.abs(diff), 500);
        });

        // sidebar menu toggle
        $(function () {
            function responsiveView() {
                var wSize = $(window).width();
                if (wSize <= 768) {
                    $('#container').addClass('sidebar-close');
                    $('#sidebar > ul').hide();
                    console.log("mobile view");
                    $('#profile').css({
                        'margin-top ': '195px'

                    });

                }

                if (wSize > 768) {
                    $('#container').removeClass('sidebar-close');
                    $('#sidebar > ul').show();
                    console.log("Desktop view");
                    $('#profile').css({
                        'margin-top ': '195px'
                    });


                }

            }
            $(window).on('load', responsiveView);
            $(window).on('resize', responsiveView);
        });
        $scope.menuclick = function () {
            if ($('#sidebar').is(":visible") === true) {
                $('#main-content').css({
                    'margin-left': '0px'
                });
                $('#sidebar').css({
                    'margin-left': '-180px'
                });
                $('#sidebar').hide();
                $("#container").addClass("sidebar-closed");
            } else {
                $('#main-content').css({
                    'margin-left': '180px'
                });
                $('#sidebar').show();
                $('#sidebar').css({
                    'margin-left': '0'
                });
                $("#container").removeClass("sidebar-closed");
            }


        }
        $('.toggle-nav').click(function () {
            if ($('#sidebar').is(":visible") === true) {
                $('#main-content').css({
                    'margin-left': '0px'
                });
                $('#sidebar').css({
                    'margin-left': '-180px'
                });
                $('#sidebar').hide();
                $("#container").addClass("sidebar-closed");
            } else {
                $('#main-content').css({
                    'margin-left': '180px'
                });
                $('#sidebar').show();
                $('#sidebar').css({
                    'margin-left': '0'
                });
                $("#container").removeClass("sidebar-closed");
            }


            // if (wSize <= 768) {
            //     $('#profile').css({
            //         'margin-top ': '195px'
            //     });

            // }
            // if (wSize > 768) {
            //     $('#profile').css({
            //         'margin-top ': ''
            //     });

            // }

            // if ($(window).width() <= 768){	
            //     $('#profile').css({
            //         'margin-top ': '195px'
            //     });


            // }
            // if ($('#sidebar > ul').is(":visible") === true) {
            //     $('#main-content').css({
            //         'margin-left': '0px'
            //     });
            //     $('#sidebar').css({
            //         'margin-left': '-180px'
            //     });
            //     $('#sidebar > ul').hide();
            //     $("#container").addClass("sidebar-closed");
            // } else {
            //     $('#main-content').css({
            //         'margin-left': '180px'
            //     });
            //     $('#sidebar > ul').show();
            //     $('#sidebar').css({
            //         'margin-left': '0'
            //     });
            //     $("#container").removeClass("sidebar-closed");
            // }
        });

        //bar chart
        if ($(".custom-custom-bar-chart")) {
            $(".bar").each(function () {
                var i = $(this).find(".value").html();
                $(this).find(".value").html("");
                $(this).find(".value").animate({
                    height: i
                }, 2000)
            })
        }

    }




    $scope.initializeJS();


    if (window.matchMedia('(min-width: 768px)').matches) {
        console.log("<<<<<<<home icon hide>>>>>>>");
        $("#sidebarmnu").css({
            "display": "none"
        })
        $("#sidebarmnudesktop").css({
            "margin-top": "4px"
        })

    }
    if (window.matchMedia('(max-width: 768px)').matches) {
        console.log("<<<<<<<home icon hide>>>>>>>");
        $("#sidebarmnudesktop").css({
            "display": "none"
        })
        $("#sidebarmnu").css({
            "margin-top": "50px"
        })
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