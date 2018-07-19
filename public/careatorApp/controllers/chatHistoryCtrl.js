careatorApp.controller('chatHistoryCtrl', function ($scope, $rootScope, $filter, $state, careatorHttpFactory) {
    console.log("chatHistoryCtrl==>");
    var allUsers;
    var userData;

    /* ##### Start: UserData  ##### */
    var id = $state.params.id;
    $scope.getUserDataById = function () {
        console.log("getAllEmployee-->: " + id);
        var api = "https://norecruits.com/careator_getUser/careator_getUserById/" + id;
        console.log("api: " + api);
        careatorHttpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            if (checkStatus) {
                userData = {
                    "email": data.data.data[0].email,
                    "userName": data.data.data[0].name,
                    "empId": data.data.data[0].empId,
                    "userId": data.data.data[0]._id
                }
                console.log("userData: " + JSON.stringify(userData));
                $scope.userId = userData.userId;
                $scope.userName = userData.userName;
                $scope.getChatGroupListById($scope.userId);
                
                console.log(data.data.message);
            } else {
                console.log("Sorry");
                console.log(data.data.message);
            }
        })
        console.log("<--getAllEmployee");
    }
    $scope.getUserDataById();
    /* ##### End: UserData  ##### */


    $scope.allGroupAndIndividual = []; /* ### Note:$scope.allGroupAndIndividual contains All employee list(who having chat rights) and group list(which are included by login person)   ### */


    $scope.getChatGroupListById = function (id) {
        console.log("getAllEmployee-->: " + id);
        var api = "https://norecruits.com/careator_chatGroupList/careator_getChatGroupListById/" + id;
        console.log("api: " + api);
        careatorHttpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            if (checkStatus) {
                $scope.allGroup = data.data.data;
                console.log("allGroup: " + JSON.stringify($scope.allGroup));
                console.log(data.data.message);
                $scope.getChatRecords();
            } else {
                console.log("Sorry");
                console.log(data.data.message);
            }
        })
        console.log("<--getAllEmployee");
    }


    $scope.chatMenu = function () {
        console.log("chatMenu-->");
        console.log("screen.width: " + screen.width);
        if (screen.width < 768) {
            //  $("#bcktohome").click();
            console.log("chatMenu-->");
            $('.side-one').css({
                "display": "block"
            });
            $('.conversation').css({
                "position": " ",
                "top": " ",
                "width": " "
            });
        }

    }

    $scope.chatDetails = function (type, id, index) {
        console.log("chatDetails-->");
        console.log("screen.width : " + screen.width);
        if (screen.width < 768) {
            $('.side-one').css({
                "display": "none"
            });
            $('.conversation').css({
                "position": "absolute",
                "top": "0",
                "width": "100%"
            });
        }
        var elem = document.getElementById('pulldown');
        elem.scrollTop = elem.scrollHeight;
        $scope.selectedType = type;
        console.log("  $scope.selectedType: " + $scope.selectedType);
        console.log("id: " + id);
        if ($scope.selectedType == 'group') {
            var group_id = id;
            var api = "https://norecruits.com/careator_groupTextRead/groupTextReadByGroupId/" + group_id;
            console.log("api: " + api);
            careatorHttpFactory.get(api).then(function (data) {
                console.log("data--" + JSON.stringify(data.data));
                var checkStatus = careatorHttpFactory.dataValidation(data);
                if (checkStatus) {
                    $scope.allChat = data.data.data[0];
                    if ($scope.allChat == undefined) {
                        $scope.individualData = $scope.chatedGroup_records[index];
                        $scope.sendGroupText_withData = {
                            "group_id": $scope.individualData._id,
                            "groupName": $scope.individualData.groupName,
                            "senderId": userData.userId,
                            "senderName": userData.userName
                        }
                        // $scope.individualData = data.data.data[0];
                    }
                    else {
                        $scope.individualData = data.data.data[0];
                        console.log("$scope.allChat: " + JSON.stringify($scope.allChat));
                        console.log("$scope.allChat.chats: " + JSON.stringify($scope.allChat.chats));
                        $scope.sendGroupText_withData = {
                            "group_id": $scope.individualData.group_id,
                            "groupName": $scope.individualData.groupName,
                            "senderId": userData.userId,
                            "senderName": userData.userName
                        }
                    }
                    console.log("$scope.individualData : " + JSON.stringify($scope.individualData));

                    console.log("sendGroupText_withData-->: " + JSON.stringify($scope.sendGroupText_withData));
                    // $scope.readText();
                } else {
                    console.log("Sorry");
                    console.log(data.data.message);
                }
            })
        }
        else if ($scope.selectedType == "individual_chats") {
            var api = "https://norecruits.com/careator_getChatsById/getChatsById/" + id;
            console.log("api: " + api);
            careatorHttpFactory.get(api).then(function (data) {
                console.log("data--" + JSON.stringify(data.data));
                var checkStatus = careatorHttpFactory.dataValidation(data);
                if (checkStatus) {
                    $scope.allChat = data.data.data;
                    $scope.individualData = data.data.data;
                    console.log("$scope.allChat: " + JSON.stringify($scope.allChat));
                    console.log("$scope.individualData : " + JSON.stringify($scope.individualData));

                    $scope.receiverData = {
                        "senderId": userData.userId,
                        "senderName": userData.userName,
                    }

                    if ($scope.individualData.receiverId != userData.userId) {
                        $scope.receiverData.receiverId = $scope.individualData.receiverId;
                        $scope.receiverData.receiverName = $scope.individualData.receiverName;
                    }
                    else if ($scope.individualData.senderId != userData.userId) {
                        $scope.receiverData.receiverId = $scope.individualData.senderId;
                        $scope.receiverData.receiverName = $scope.individualData.senderName;
                    }
                    console.log(" $scope.receiverData : " + JSON.stringify($scope.receiverData));


                } else {
                    console.log("Sorry");
                    console.log(data.data.message);
                }
            })
        }


        console.log("$scope.receiverData : " + JSON.stringify($scope.receiverData));
        // console.log("sendGroupText_withData-->: " + JSON.stringify($scope.sendGroupText_withData));
    }


    $scope.getEmpDetail = function (index) {
        console.log("getEmpDetail-->");
        $scope.selectedType = "individual_chats";
        console.log(" $scope.selectedType : " + $scope.selectedType);
        $scope.individualData = $scope.allEmp[index];
        console.log(" $scope.individualData: " + JSON.stringify($scope.individualData));
        $scope.readText();
    }


    $scope.readText = function () {
        console.log("readText-->");
        if ($scope.selectedType == 'group') {
            var group_id = $scope.individualData._id;
            var api = "https://norecruits.com/careator_groupTextRead/groupTextReadByGroupId/" + group_id;
            console.log("api: " + api);
            careatorHttpFactory.get(api).then(function (data) {
                console.log("data--" + JSON.stringify(data.data));
                var checkStatus = careatorHttpFactory.dataValidation(data);
                if (checkStatus) {
                    $scope.allChat = data.data.data[0];
                    console.log("allChat: " + JSON.stringify($scope.allChat));
                    console.log(data.data.message);
                } else {
                    console.log("Sorry");
                    console.log(data.data.message);
                }
            })

        } else {
            var sId = userData.userId;
            var rId = $scope.individualData._id;
            var api = "https://norecruits.com/careator_individualTextRead/individualTextReadById/" + sId + "/" + rId;
            console.log("api: " + api);
            careatorHttpFactory.get(api).then(function (data) {
                console.log("data--" + JSON.stringify(data.data));
                var checkStatus = careatorHttpFactory.dataValidation(data);
                if (checkStatus) {
                    $scope.allChat = data.data.data[0];
                    console.log("allChat: " + JSON.stringify($scope.allChat));
                    console.log(data.data.message);
                } else {
                    console.log("Sorry");
                    console.log(data.data.message);
                }
            })
        }
    }

    $scope.getChatRecords = function () {
        console.log("getChatRecords-->");
        var id = $scope.userId;
        var api = "https://norecruits.com/careator_getChatListRecordById/getChatListRecordById/" + id;
        console.log("api: " + api);
        careatorHttpFactory.get(api).then(function (data) {
            // console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            if (checkStatus) {
                $scope.allChatRecords = data.data.data;
                console.log("allChatRecords: " + JSON.stringify($scope.allChatRecords));
                console.log(data.data.message);
                $scope.chatedGroup_records = $scope.allChatRecords; /* ### Note: $scope.chatedGroup_records is Chat(chated records) and group(group records) records storage  ### */
                for (var x = 0; x < $scope.allGroup.length; x++) {
                    $scope.chatedGroup_records.push($scope.allGroup[x]);
                }
                console.log(" $scope.chatedGroup_records[0]: " + JSON.stringify($scope.chatedGroup_records[0]));
                console.log(" $scope.chatedGroup_records[3]: " + JSON.stringify($scope.chatedGroup_records[3]));
            } else {
                console.log("Sorry");
                console.log(data.data.message);
            }
        })
    }


    /* ### Start: receive message from careator.js  ### */ //update to client with new message;
    socket.on('comm_textReceived', function (data) {
        console.log("****comm_textReceived-->: " + JSON.stringify(data));;
        console.log("$scope.individualData._id: " + $scope.individualData._id);
        console.log(" data.id: " + data.id);
        console.log("$scope.individualData._id: " + JSON.stringify($scope.individualData));
        console.log(" data.id: " + JSON.stringify(data));

        // if ($scope.allChat._id == data.id) {
        //     console.log("1)start pushing message");
        //     $scope.allChat.chats.push({
        //         "senderId": data.senderId,
        //         "senderName": data.senderName,
        //         "message": data.message,
        //         "sendTime": data.sendTime
        //     });
        //     $scope.scrollDown();
        // }
        if (data.freshInsert == true) {
            var id = data.id;
            var api = "https://norecruits.com/careator_getChatsById/getChatsById/" + id;
            console.log("api: " + api);
            careatorHttpFactory.get(api).then(function (data) {
                console.log("data--" + JSON.stringify(data.data));
                var checkStatus = careatorHttpFactory.dataValidation(data);
                if (checkStatus) {
                    $scope.allChat = data.data.data;
                    $scope.individualData = data.data.data;
                    console.log("$scope.allChat: " + JSON.stringify($scope.allChat));
                    console.log("$scope.individualData : " + JSON.stringify($scope.individualData));

                    $scope.receiverData = {
                        "senderId": userData.userId,
                        "senderName": userData.userName,
                    }

                    if ($scope.individualData.receiverId != userData.userId) {
                        $scope.receiverData.receiverId = $scope.individualData.receiverId;
                        $scope.receiverData.receiverName = $scope.individualData.receiverName;
                    }
                    else if ($scope.individualData.senderId != userData.userId) {
                        $scope.receiverData.receiverId = $scope.individualData.senderId;
                        $scope.receiverData.receiverName = $scope.individualData.senderName;
                    }
                    console.log(" $scope.receiverData : " + JSON.stringify($scope.receiverData));


                } else {
                    console.log("Sorry");
                    console.log(data.data.message);
                }
            })
        }


        if ($scope.individualData._id == data.id) {
            console.log("2)start pushing message");
            $scope.allChat.chats.push({
                "senderId": data.senderId,
                "senderName": data.senderName,
                "message": data.message,
                "sendTime": data.sendTime
            });
            $scope.scrollDown();
        }

    })
    /* ### End: Get event update from index.js  ### */

    /* ### Start: Front end  CSS### */
    $(".heading-compose").click(function () {
        $(".side-two").css({
            "left": "0"
        });
        console.log("heading-compose");
    });

    $(".newMessage-back").click(function () {
        $(".side-two").css({
            "left": "-100%"
        });
        console.log("newMessage-back");
    });
    // /* ### End: Front end CSS ### */
    $("#comment").keyup(function (event) {
        if (event.keyCode === 13) {
            $("#sndmgs").click();
        }
    });


    /////Auto Scroll Down Chat////////////////
    $scope.scrollDown = function () {
        console.log("scrollDown-->");
        $("#pulldown").animate({
            scrollTop: $("#pulldown").prop("scrollHeight")
        }, 500);
    }





    //////////emoji/////////////////////////////
    // $(document).ready(function() {
    //     $("#emojionearea1").emojioneArea({
    //       pickerPosition: "right",
    //     tonesStyle: "bullet"
    //   });
    //     $("#emojionearea2").emojioneArea({
    //       pickerPosition: "bottom",
    //     tonesStyle: "radio"
    //   });
    //     $("#emojionearea3").emojioneArea({
    //       pickerPosition: "right",
    //       filtersPosition: "bottom",
    //     tonesStyle: "square"
    //   });
    //     $("#emojionearea4").emojioneArea({
    //       pickerPosition: "bottom",
    //       filtersPosition: "bottom",
    //     tonesStyle: "checkbox"
    //   });
    //     $("#emojionearea5").emojioneArea({
    //       pickerPosition: "top",
    //       filtersPosition: "bottom",
    //     tones: false,
    //     autocomplete: false,
    //     inline: true,
    //     hidePickerOnBlur: false
    //   });
    //   $("#standalone").emojioneArea({
    //     standalone: true,
    //     autocomplete: false
    //   });
    // });




})