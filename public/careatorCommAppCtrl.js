careatorApp.controller("careatorCommAppCtrl", function ($scope, $state, careatorSessionAuth, careatorHttpFactory, $timeout, SweetAlert) {
    console.log("Chat controller==>");

    careatorHttpFactory.getFile('property.json');

    $scope.gotToDashboard = function () {
        console.log("gotToDashboard-->");

        $state.go('Cdashboard', {});
    }
    var loginModal; /* ### Note: get login modal instance on this variable ###*/
    var userName;

    $scope.userData = careatorSessionAuth.getAccess("userData");
    console.log(" $scope.userData : " + JSON.stringify($scope.userData));

    if ($scope.userData) {
        userName = $scope.userData.firstName+" "+$scope.userData.lastName;

        // $scope.loginType = $scope.userData.loginType;
        console.log("userData: " + JSON.stringify($scope.userData));
        console.log("userName: " + userName);
        if (($scope.userData.email != null && $scope.userData.email != undefined) && ($scope.userData.sessionPassword != null && $scope.userData.sessionPassword != undefined)) {

        } else {
            console.log("enterEmail: -->");

        }
    }

    $scope.getLogin_hostDetailsById = function (id) {
        console.log("getLogin_hostDetailsById-->: " + id);
        var api = "https://norecruits.com/careator_getUser/careator_getUserById/" + id;
        console.log("api: " + api);
        careatorHttpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("checkStatus: " + checkStatus);
            if (checkStatus) {
                if (data.data.data[0].sessionRandomId == $scope.userData.sessionRandomId) {
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
    
    $scope.logVC = function (email, password) {
        console.log("logVC from ");
        var obj = {
            "password": password,
            "careatorEmail": email
        };
        console.log("obj: " + JSON.stringify(obj));
        console.log("logVC");
        var api = "https://norecruits.com/careator/pswdCheck";
        console.log("api: " + api);
        careatorHttpFactory.post(api, obj).then(function (data) {
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            console.log("checkStatus" + checkStatus);
            console.log("data.message: " + data.data.message);
            if (checkStatus) {
                var datas = data.data;
                console.log("data.message: " + data.data.message);
                $scope.sessionSet(datas);
            } else {
                if (data.data.message == "You've already logged in. To log in again, please reset your session") {

                    SweetAlert.swal({
                        title: "Reset Session",
                        text: "You've already logged in. To log in again, please reset your session", //light text
                        type: "warning", //type -- adds appropiriate icon
                        showCancelButton: true, // displays cancel btton
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Reset",
                        closeOnConfirm: true, //do not close popup after click on confirm, usefull when you want to display a subsequent popup
                        closeOnCancel: true
                    },
                        function (isConfirm) { //Function that triggers on user action.
                            if (isConfirm) {

                                SweetAlert.swal({
                                    title: "Reset Done",
                                    text: "you can login now",
                                    type: "success"
                                });

                                $scope.checkObj = {
                                    "password": password,
                                    "careatorEmail": email
                                }
                                resetId = data.data.data.id;
                                $scope.resetLoginFlag();


                            } else {
                                SweetAlert.swal({
                                    title: "Reset Cancelled",
                                    text: "you can not login",
                                    type: "warning"
                                });

                            }
                        }
                    )
                } else {

                    SweetAlert.swal({
                        title: "Error",
                        text: data.data.message,
                        type: "warning"
                    });

                }
            }
        });

    }

    $scope.$watch($scope.userData, function(newVal, oldVal) {
        if(newVal !== oldVal) {
          // call with updated filters
          console.log("different value found");
        }
        else{
            console.log("Same valeu");
        }
      });

    $scope.sessionSet = function (data) {
        console.log("sessionSet-->");
        console.log("data: " + JSON.stringify(data));
        console.log(" data.sessionData: " + data.sessionData);
        localStorage.setItem("careatorEmail", data.data.email);
        localStorage.setItem("sessionPassword", data.data.password);
        localStorage.setItem("sessionRandomId", data.data.sessionRandomId);
        localStorage.setItem("sessionEnc", data.sessionData);
        console.log("localStorage.getItem(sessionEnc): " + localStorage.getItem("sessionEnc"));
        if (typeof (Storage) !== "undefined") {
            var userData = {
                "email": data.data.email,
                "firstName": data.data.firstName,
                "lastName": data.data.lastName,
                "empId": data.data.empId,
                "userId": data.data._id,
                "sessionPassword": data.data.password,
                "sessionRandomId": data.data.sessionRandomId,
                "loginType": data.data.loginType,
                "orgId": data.data.orgId
            }
            if (data.data.videoRights == 'yes') {
                $scope.videoRights = "yes";
                userData.videoRights = "yes";
                localStorage.setItem("videoRights", 'yes');
            }
            if (data.data.chatRights == 'yes') {
                userData.chatRights = "yes";
                localStorage.setItem("chatRights", 'yes');
            }
            if (data.data.chatStatus) {
                userData.chatStatus = data.data.chatStatus;
            }
            console.log("localStorage.getItem(restrictedTo): " + JSON.stringify(localStorage.getItem("restrictedTo")));
            if (data.data.restrictedTo) {
                console.log("data.data.restrictedTo: " + JSON.stringify(data.data.restrictedTo));
                var restrictedTo = data.data.restrictedTo;
                var restrictedArray = [];
                for (var x = 0; x < restrictedTo.length; x++) {
                    restrictedArray.push(restrictedTo[x].userId);
                }

                localStorage.setItem("restrictedTo", restrictedArray);
                var restrictedUser = restrictedArray;

                userData.restrictedTo = restrictedArray;


                console.log("restrictedArray: " + JSON.stringify(restrictedArray));

            }
            if (data.data.profilePicPath) {
                userData.profilePicPath = data.data.profilePicPath;
            }
            var userData = userData;
            console.log("userData before update into localstorage: "+JSON.stringify(userData));
            careatorSessionAuth.setAccess(userData);
            var userData = careatorSessionAuth.getAccess("userData");
            $scope.userData = careatorSessionAuth.getAccess("userData");
            $scope.loginType = $scope.userData.loginType;
            console.log("userData After update into localstorage: "+JSON.stringify(            $scope.userData));
            console.log("userData: " + JSON.stringify(userData));


            SweetAlert.swal({
                title: "Login Successfully", //light text
                type: "success", //type -- adds appropiriate icon
                showCancelButton: true, // displays cancel btton
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Go Dashboard",
                closeOnConfirm: true, //do not close popup after click on confirm, usefull when you want to display a subsequent popup
                closeOnCancel: true
            },
                function (isConfirm) { //Function that triggers on user action.
                    if (isConfirm) {
                        $state.go('Cdashboard.profile', {});
                    } else {

                    }
                }
            )




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


    $scope.resetLoginFlag = function () {
        console.log("resetLoginFlag-->");
        // $("#notify_msg").modal('hide');
        var id = resetId;
        console.log("Obj ID  " + id);
        var api = "https://norecruits.com/careator_reset/resetLoginFlagsById/" + id;
        console.log("api: " + api);
        careatorHttpFactory.post(api, $scope.checkObj).then(function (data) {
            var checkStatus = careatorHttpFactory.dataValidation(data);
            if (checkStatus) {
                SweetAlert.swal({
                    title: "Reset Done", //light text
                    type: "success", //type -- adds appropiriate icon
                    showCancelButton: true, // displays cancel btton
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "login",
                    closeOnConfirm: true, //do not close popup after click on confirm, usefull when you want to display a subsequent popup
                    closeOnCancel: true
                },
                    function (isConfirm) { //Function that triggers on user action.
                        if (isConfirm) {
                            console.log("data.message: " + data.data.message);
                            $("#empLogin").trigger("click");

                        } else {
                            SweetAlert.swal("you selected to login later");

                        }
                    }
                )


            } else {
                console.log("sorry");
                //alert(data.data.message);
                var loginResetAlert = $uibModal.open({
                    scope: $scope,
                    templateUrl: '/careatorApp/common/loginAlert.html',
                    windowClass: 'show',
                    backdropClass: 'static',
                    keyboard: false,
                    controller: function ($scope, $uibModalInstance) {
                        $scope.message = data.data.message;
                        console.log("$scope.eventDetails: " + JSON.stringify($scope.eventDetails));
                        $scope.close = function () {
                            loginResetAlert.close('resetModel');
                        }
                    }
                })
                $timeout(function () {
                    loginResetAlert.close('resetModel');
                }, 5000);

            }
        })
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
                        type: "success",

                    });
                    var id = $scope.userData.userId;
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
            $scope.userData = careatorSessionAuth.getAccess("userData");



            // $scope.doRedirect();
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
           // $scope.doRedirect();
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







})