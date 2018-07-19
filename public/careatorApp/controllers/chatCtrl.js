careatorApp.controller('chatCtrl', function ($scope, $rootScope, $filter, $window, careatorHttpFactory, careatorSessionAuth) {
    console.log("chatCtrl==>");
    var userData = careatorSessionAuth.getAccess("userData");
    $scope.userId = userData.userId;
    console.log("userData: " + JSON.stringify(userData));
    $scope.allGroupAndIndividual = []; /* ### Note:$scope.allGroupAndIndividual contains All employee list(who having chat rights) and group list(which are included by login person)   ### */
    var restrictedUser = userData.restrictedTo;

    console.log("restrictedUser: " + JSON.stringify(restrictedUser));
    $scope.restrictedArray = restrictedUser.split(',');
    console.log(" $scope.restrictedArray: " + JSON.stringify($scope.restrictedArray));

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

            } else {
                console.log("Sorry");
                console.log(data.data.message);
            }
        })
        console.log("<--getAllEmployee");
    }

    if (userData.chatRights == 'yes') {
        $scope.getChatGroupListById(localStorage.getItem("userId"));
    }
    // if (screen.width < 768){
    //     $('#homeicon').css({
    //         "display": "block"
    //     });

    // }
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
        $scope.scrollDown();
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
                    } else {
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
        } else if ($scope.selectedType == "individual_chats") {
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
                    } else if ($scope.individualData.senderId != userData.userId) {
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

    $scope.chatDetailsFromNew = function (type, index) {
        console.log("chatDetailsFromNew-->");
        $("#backkjkj").click();
        $scope.selectedType = type;
        console.log("  $scope.selectedType: " + $scope.selectedType);
        console.log(" $scope.allGroupAndIndividual[index]: " + JSON.stringify($scope.allGroupAndIndividual[index]));
        $scope.individualData = $scope.allGroupAndIndividual[index];
        $scope.sendGroupText_withData = {
            "group_id": $scope.individualData._id,
            "groupName": $scope.individualData.groupName,
            "senderId": userData.userId,
            "senderName": userData.userName
        }
        console.log("sendGroupText_withData-->: " + JSON.stringify($scope.individualData));
        console.log("individualData-->: " + JSON.stringify($scope.sendGroupText_withData));
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
                    if ($scope.allChat == undefined) {
                        //$scope.individualData = $scope.allGroupAndIndividual[index];
                    } else {
                        $scope.individualData = $scope.allChat;
                    }

                    //$scope.allChat = $scope.allGroupAndIndividual[index];
                    //$scope.individualData = $scope.allChat;
                    console.log(" $scope.individualData : " + JSON.stringify($scope.individualData));

                    console.log(data.data.message);
                } else {
                    console.log("Sorry");
                    console.log(data.data.message);
                }
            })

        } else {
            $scope.receiverData = {
                "senderId": userData.userId,
                "senderName": userData.userName,
                "receiverId": $scope.individualData._id,
                "receiverName": $scope.individualData.name
            }
            console.log(" $scope.receiverData : " + JSON.stringify($scope.receiverData));
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
                    if ($scope.allChat == undefined) {
                        $scope.individualData = $scope.allGroupAndIndividual[index];
                    } else {
                        $scope.individualData = $scope.allChat;
                    }

                    console.log(" $scope.individualData : " + JSON.stringify($scope.individualData));

                    console.log(data.data.message);
                } else {
                    console.log("Sorry");
                    console.log(data.data.message);
                }
            })
        }
    }

    $scope.getAllChatRightEmp = function () {
        console.log("getAllChatRightEmp-->");
        $scope.allGroupAndIndividual = [];
        var id = userData.userId;
        console.log(" $scope.restrictedArray: " + JSON.stringify($scope.restrictedArray));
        // var restrictedUser = userData.restrictedTo;
        // console.log("restrictedUser: " + JSON.stringify(restrictedUser));
        // var splitRestrictedUser = restrictedUser.split(',');
        // console.log("splitRestrictedUser: " + JSON.stringify(splitRestrictedUser));

        var restrictedUsers = $scope.restrictedArray;
        var obj = {
            "restrictedTo": restrictedUsers
        }
        console.log("obj: " + JSON.stringify(obj));
        api = "https://norecruits.com/careator_getEmp/careator_getChatRightsAllemp/" + id; /* #### without restricted emp  #### */
        console.log("api: " + JSON.stringify(api));
        careatorHttpFactory.post(api, obj).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            if (checkStatus) {
                $scope.allEmp = data.data.data;
                console.log(" $scope.allEmp : " + JSON.stringify($scope.allEmp));
                console.log("data.data.message: " + data.data.message);
                for (var x = 0; x < $scope.allEmp.length; x++) {
                    $scope.allGroupAndIndividual.push($scope.allEmp[x]);
                }
                for (var x = 0; x < $scope.allGroup.length; x++) {
                    $scope.allGroupAndIndividual.push($scope.allGroup[x]);
                }
                console.log(" $scope.allGroupAndIndividual: " + JSON.stringify($scope.allGroupAndIndividual));
            } else {
                console.log("Sorry: " + data.data.message);
            }
        })
    }
    // $scope.getAllChatRightEmp();
    $scope.getEmpDetail = function (index) {
        console.log("getEmpDetail-->");
        $scope.selectedType = "individual_chats";
        console.log(" $scope.selectedType : " + $scope.selectedType);
        $scope.individualData = $scope.allEmp[index];
        console.log(" $scope.individualData: " + JSON.stringify($scope.individualData));
        $scope.readText();
    }

    $scope.sendText = function () {
        $('#comment').val('');
        console.log("sendText-->");
        console.log("$scope.typedMessage: " + $scope.typedMessage);
        var api;
        var obj;
        console.log("$scope.selectedType: " + $scope.selectedType);
        if ($scope.selectedType == 'individual_chats') {
            api = "https://norecruits.com/careator_individualText/individualText";
            console.log("api: " + api);
            console.log("$scope.receiverData.receiverId: " + $scope.receiverData.receiverId);
            if ($scope.restrictedArray.indexOf($scope.receiverData.receiverId) >= 0) {
                obj = {
                    "senderId": userData.userId,
                    "receiverId": $scope.receiverData.receiverId,
                    "senderName": userData.userName,
                    "receiverName": $scope.receiverData.receiverName,
                    "message": $scope.typedMessage
                }
                console.log("obj: " + JSON.stringify(obj));
                careatorHttpFactory.post(api, obj).then(function (data) {
                    console.log("data--" + JSON.stringify(data.data));
                    var checkStatus = careatorHttpFactory.dataValidation(data);
                    if (checkStatus) {
                        console.log("data.data.data: " + JSON.stringify(data.data.data));
                        console.log(data.data.message);
                    } else {
                        console.log("Sorry");
                        console.log(data.data.message);
                    }
                })
            }
            else {
                alert("You not allowed to chat with " + $scope.receiverData.receiverName);
            }


        } else if ($scope.selectedType == 'group') {
            obj = {
                "group_id": $scope.sendGroupText_withData.group_id,
                "groupName": $scope.sendGroupText_withData.groupName,
                "senderId": userData.userId,
                "senderName": userData.userName,
                "message": $scope.typedMessage
            }
            console.log("obj: " + JSON.stringify(obj));
            api = "https://norecruits.com//careator_groupText/groupText";
            console.log("api: " + api);
            careatorHttpFactory.post(api, obj).then(function (data) {
                console.log("data--" + JSON.stringify(data.data));
                var checkStatus = careatorHttpFactory.dataValidation(data);
                if (checkStatus) {
                    console.log("data.data.data: " + JSON.stringify(data.data.data));
                    console.log(data.data.message);
                } else {
                    console.log("Sorry");
                    console.log(data.data.message);
                }
            })

        }


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

            } else {
                console.log("Sorry");
                console.log(data.data.message);
            }
        })
    }
    $scope.getChatRecords();

    /* ### Start: receive message from careator.js  ### */
    socket.on('comm_textReceived', function (data) { //update to client with new message;
        console.log("****comm_textReceived-->: " + JSON.stringify(data));
        console.log("$scope.individualData._id: " + $scope.individualData._id);
        console.log(" data.id: " + data.id);
        console.log("$scope.individualData._id: " + JSON.stringify($scope.individualData));
        console.log(" data.id: " + JSON.stringify(data));
        if (data.freshInsert == true && (userData.userId==data.senderId || userData.userId==data.receiverId)) {
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
                    } else if ($scope.individualData.senderId != userData.userId) {
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
    socket.on('comm_aboutRestrictedUpdate', function (data) { //update to client about their new restricted users
        console.log("****comm_aboutRestrictedUpdate-->: " + JSON.stringify(data));
        if (data.moreIds == 'yes') {
            console.log("data: " + JSON.stringify(data));
            console.log("data.ids.indexOf($scope.userId): " + data.ids.indexOf($scope.userId));            
        }
        else {
            if ($scope.userId == data.id) {
                console.log("Updated Started-->");
                var restrictedUser = data.restrictedTo;
                $scope.restrictedArray = [];
                for (var x = 0; x < restrictedUser.length; x++) {
                    $scope.restrictedArray.push(restrictedUser[x].userId);
                }
                console.log(" $scope.restrictedArray: " + JSON.stringify($scope.restrictedArray));
                // if(restrictedArray.length>1){
                //     var splitRestrictedUser = restrictedArray.split(',');
                //     console.log("splitRestrictedUser: " + JSON.stringify(splitRestrictedUser));
                // }


            }
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


    ///Auto Scroll Down Chat////////////////
    $scope.scrollDown = function () {
        console.log("scrollDown-->");
        $("#pulldown").animate({
            scrollTop: $("#pulldown").prop("scrollHeight")
        }, 500);
    }

    // $scope.scrollDown = function () {
    //     console.log("scrollDown-->");
    //     $("#pulldown").animate({
    //         scrollTop: $("#pulldown").prop(0,0)
    //     }, 500);
    // }





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