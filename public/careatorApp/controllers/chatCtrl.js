careatorApp.controller("chatCtrl", function (
  $scope,
  $rootScope,
  careatorHttpFactory,
  careatorSessionAuth
) {
  console.log("chatCtrl==>");
  $scope.count = 0;
  var userData = careatorSessionAuth.getAccess("userData");
  $scope.loginUserName = userData.userName;
  $scope.userId = userData.userId;
  if (userData.chatStatus) {
    $scope.chatStatus = userData.chatStatus;
  } else {
    $scope.chatStatus = "Available";
  }
  console.log("userData: " + JSON.stringify(userData));
  $scope.allEmpWithIndexById = []; /* ### Note: Will keep all employee indexed by employee id ### */
  $scope.allChatRecordsId = []; /* ### Note: Will keep all receiver   ### */
  $scope.allGroupIds = []; /* ### Note: Will keep all GroupIds   ### */
  $scope.allGroupAndIndividual = []; /* ### Note:$scope.allGroupAndIndividual contains All employee list(who having chat rights) and group list(which are included by login person)   ### */
  var restrictedUser = userData.restrictedTo;
  $scope.restrictedArray = restrictedUser;
  // console.log("restrictedUser: " + JSON.stringify(restrictedUser));
  // $scope.restrictedArray = restrictedUser.split(',');
  console.log(
    " $scope.restrictedArray: " + JSON.stringify($scope.restrictedArray)
  );
  var id = userData.userId;
  $scope.getUserDataById = function () {
    console.log("getUserDataById--> ");
    var api =
      "https://norecruits.com//careator_getUser/careator_getUserById/" + id;
    console.log("api: " + api);
    careatorHttpFactory.get(api).then(function (data) {
      console.log("data--" + JSON.stringify(data.data));
      var checkStatus = careatorHttpFactory.dataValidation(data);
      if (checkStatus) {
        var userDetails = data.data.data[0];
        $scope.userDetails = userDetails;
        $scope.profilePicPath = $scope.userDetails.profilePicPath;
        console.log(
          "   $scope.userDetails: " + JSON.stringify($scope.userDetails)
        );
        console.log("data.data.message: " + data.data.message);
      } else {
        console.log("Sorry");
        console.log("data.data.message: " + data.data.message);
      }
    });
  };
  $scope.getUserDataById();
  $scope.getChatGroupListById = function (id) {
    console.log("getAllEmployee-->: " + id);
    var api =
      "https://norecruits.com/careator_chatGroupList/careator_getChatGroupListById/" +
      id;
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
    });
    console.log("<--getAllEmployee");
  };
  if (userData.chatRights == "yes") {
    $scope.getChatGroupListById(localStorage.getItem("userId"));
  }

  $scope.statusUpdate = function (status) {
    console.log("statusUpdate-->: " + status);

    var id = userData.userId;
    api = "https://norecruits.com/careator_profile/chatStatusUpdateById/" + id;
    console.log("api: " + api);
    var obj = {
      chatStatus: status
    };
    careatorHttpFactory.post(api, obj).then(function (data) {
      console.log("data--" + JSON.stringify(data.data));
      var checkStatus = careatorHttpFactory.dataValidation(data);
      if (checkStatus) {
        console.log("data.data.data: " + JSON.stringify(data.data.data));
        $scope.chatStatus = status;
        var userData = {
          email: localStorage.getItem("email"),
          userName: localStorage.getItem("userName"),
          empId: localStorage.getItem("empId"),
          userId: localStorage.getItem("userId"),
          restrictedTo: localStorage.getItem("restrictedTo"),
          chatStatus: status
        };
        if (localStorage.getItem("videoRights") == "yes") {
          userData.videoRights = "yes";
        }
        if (localStorage.getItem("chatRights") == "yes") {
          userData.chatRights = "yes";
          // $scope.getChatGroupListById(localStorage.getItem("userId"));
        }
        careatorSessionAuth.clearAccess("userData");
        careatorSessionAuth.setAccess(userData);
        var userData = careatorSessionAuth.getAccess("userData");
        console.log("***userData: " + JSON.stringify(userData));

        // var userData = userData;
        // userData.chatStatus = status;
        // careatorSessionAuth.clearAccess("userData");
        // careatorSessionAuth.setAccess("userData");
        // var userData = careatorSessionAuth.getAccess("userData");
        console.log("userData: " + JSON.stringify(userData));
        console.log(data.data.message);
      } else {
        console.log("Sorry");
        console.log(data.data.message);
      }
    });
  };

  $scope.chatMenu = function () {
    console.log("chatMenu-->");
    console.log("screen.width: " + screen.width);
    if (screen.width < 768) {
      //  $("#bcktohome").click();
      console.log("chatMenu-->");
      $(".side-one").css({
        display: "block"
      });
      $(".conversation").css({
        position: " ",
        top: " ",
        width: " "
      });
    }
  };

  $scope.chatDetails = function (type, id, index) {
    $scope.scrollDown();
    console.log("chatDetails-->");
    $scope.chatListSection = "chatWindow";
    console.log("screen.width : " + screen.width);
    if (screen.width < 768) {
      $(".side-one").css({
        display: "none"
      });
      $(".conversation").css({
        position: "absolute",
        top: "0",
        width: "100%"
      });
    }
    $scope.selectedType = type;
    console.log("  $scope.selectedType: " + $scope.selectedType);
    console.log("id: " + id);
    if ($scope.selectedType == "group") {
      console.log("**Group text seen");
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
              group_id: $scope.individualData._id,
              groupName: $scope.individualData.groupName,
              senderId: userData.userId,
              senderName: userData.userName,
              groupMembers: $scope.individualData.groupMembers
            };
          } else {
            $scope.individualData = data.data.data[0];
            console.log("$scope.allChat: " + JSON.stringify($scope.allChat));
            console.log(
              "$scope.allChat.chats: " + JSON.stringify($scope.allChat.chats)
            );
            $scope.sendGroupText_withData = {
              group_id: $scope.individualData.group_id,
              groupName: $scope.individualData.groupName,
              senderId: userData.userId,
              senderName: userData.userName,
              groupMembers: $scope.individualData.groupMembers
            };
          }
          console.log("$scope.individualData : " + JSON.stringify($scope.individualData));
          console.log("sendGroupText_withData-->: " + JSON.stringify($scope.sendGroupText_withData));
          var group_id = id;
          var obj = {
            "seenBy": userData.userId,
            "unseenCount": 0,
          }
          console.log("obj: " + JSON.stringify(obj));
          var api = "https://norecruits.com/careator_textSeenFlagUpdate_toGroupChat/textSeenFlagUpdate_toGroupChat/" + group_id;
          console.log("*api: " + api);
          careatorHttpFactory.post(api, obj).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            if (checkStatus) {
              console.log("Remove notification for this chat: " + data.data.message);
              var index = $scope.allGroupIds.indexOf(data.group_id);
              console.log("index: " + index);
              // if (index >= 0) {
              //   for (var x = 0; x < data.groupMembers.length; x++) {
              //     if (userData.userId == data.groupMembers[x].userId) {
              //       $scope.allChatRecords[index].unseenCount = data.groupMembers[x].unseenCount;
              //       console.log(" $scope.allChatRecords[index]: " + JSON.stringify($scope.allChatRecords[index]));
              //       break;
              //     }
              //     else {
              //       console.log("Noting to do");
              //     }
              //   }
              // }
            } else {
              console.log("Sorry: " + data.data.message);
            }
          })
        } else {
          console.log("Sorry");
          console.log(data.data.message);
        }
      });

    } else if ($scope.selectedType == "individual_chats") {
      console.log("**Individual text seen");
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
            senderId: userData.userId,
            senderName: userData.userName
          };
          if ($scope.individualData.receiverId != userData.userId) {
            $scope.receiverData.receiverId = $scope.individualData.receiverId;
            $scope.receiverData.receiverName =
              $scope.individualData.receiverName;
          } else if ($scope.individualData.senderId != userData.userId) {
            $scope.receiverData.receiverId = $scope.individualData.senderId;
            $scope.receiverData.receiverName = $scope.individualData.senderName;
          }
          console.log(" $scope.receiverData : " + JSON.stringify($scope.receiverData));
          $scope.getReceiverDataById($scope.receiverData.receiverId);

          var obj = {
            "receiverSeen": "yes",
            "seenBy": userData.userId
          }
          console.log("obj: " + JSON.stringify(obj));
          var api = "https://norecruits.com/careator_textSeenFlagUpdate/textSeenFlagUpdate/" + id;
          console.log("api: " + api);
          careatorHttpFactory.post(api, obj).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            if (checkStatus) {
              console.log("Remove notification for this chat: " + data.data.message);

            } else {
              console.log("Sorry: " + data.data.message);
            }
          })
        } else {
          console.log("Sorry");
          console.log(data.data.message);
        }
      });
    }
  };

  $scope.chatDetailsFromNew = function (type, index) {
    console.log("chatDetailsFromNew-->");
    $("#backkjkj").click();
    $scope.chatListSection = "newChatWindow";
    $scope.selectedType = type;
    console.log("  $scope.selectedType: " + $scope.selectedType);
    console.log(
      " $scope.allGroupAndIndividual[index]: " +
      JSON.stringify($scope.allGroupAndIndividual[index])
    );
    $scope.individualData = $scope.allGroupAndIndividual[index];
    $scope.receiverChatStatus = $scope.individualData.chatStatus;
    if ($scope.individualData.profilePicPath) {
      $scope.receiverProfilePicPath = $scope.individualData.profilePicPath;
    } else {
      $scope.receiverProfilePicPath = undefined;
    }
    $scope.sendGroupText_withData = {
      group_id: $scope.individualData._id,
      groupName: $scope.individualData.groupName,
      senderId: userData.userId,
      senderName: userData.userName
    };
    console.log("sendGroupText_withData-->: " + JSON.stringify($scope.individualData));
    console.log("individualData-->: " + JSON.stringify($scope.sendGroupText_withData));
    console.log(" $scope.restrictedArray: " + JSON.stringify($scope.restrictedArray));
    if ($scope.selectedType == "group") {
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
          console.log(
            " $scope.individualData : " + JSON.stringify($scope.individualData)
          );

          console.log(data.data.message);
        } else {
          console.log("Sorry");
          console.log(data.data.message);
        }
      });
    } else {
      $scope.chatFromNewWindow =
        "yes"; /* ### Note: identify chat is coming new window means, may be we dont have chat record in the chated list, so we have to show the reciever as well sender to refresh the all chated list ### */
      $scope.receiverData = {
        senderId: userData.userId,
        senderName: userData.userName,
        receiverId: $scope.individualData._id,
        receiverName: $scope.individualData.name
      };
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
          $scope.getChatRecords();
        } else {
          console.log("Sorry");
          console.log(data.data.message);
        }
      });
    }
  };

  $scope.getReceiverDataById = function (id) {
    console.log("getReceiverData-->");
    var api =
      "https://norecruits.com//careator_getUser/careator_getUserById/" + id;
    console.log("api: " + api);
    careatorHttpFactory.get(api).then(function (data) {
      console.log("data--" + JSON.stringify(data.data));
      var checkStatus = careatorHttpFactory.dataValidation(data);
      if (checkStatus) {
        var receiverData = data.data.data[0];
        console.log("receiverData: " + JSON.stringify(receiverData));
        $scope.receiverChatStatus = receiverData.chatStatus;
        if (receiverData.profilePicPath) {
          $scope.receiverProfilePicPath = receiverData.profilePicPath;
        } else {
          $scope.receiverProfilePicPath = undefined;
        }
        console.log(
          "$scope.receiverProfilePicPath: " + $scope.receiverProfilePicPath
        );
        console.log("data.data.message: " + data.data.message);
      } else {
        console.log("Sorry");
        console.log("data.data.message: " + data.data.message);
      }
    });
  };
  $scope.getGroupDataById = function () {
    console.log("getGroupDataById-->");
  };

  $scope.getAllChatRightEmp = function () {
    console.log("getAllChatRightEmp-->");
    $scope.allGroupAndIndividual = [];
    var id = userData.userId;
    api = "https://norecruits.com/careator_getEmp/careator_getChatRightsAllemp_byLoginId/" +
      id; /* #### without restricted emp  #### */
    console.log("api: " + JSON.stringify(api));
    careatorHttpFactory.get(api).then(function (data) {
      console.log("data--" + JSON.stringify(data.data));
      var checkStatus = careatorHttpFactory.dataValidation(data);
      if (checkStatus) {
        $scope.allEmp = data.data.data;
        console.log(" $scope.allEmp : " + JSON.stringify($scope.allEmp));
        console.log("data.data.message: " + data.data.message);
        for (var x = 0; x < $scope.allEmp.length; x++) {
          $scope.allGroupAndIndividual.push($scope.allEmp[x]);
          $scope.allEmpWithIndexById[$scope.allEmp[x]._id] = $scope.allEmp[x];
        }
        for (var x = 0; x < $scope.allGroup.length; x++) {
          $scope.allGroupAndIndividual.push($scope.allGroup[x]);
        }
        console.log(
          " $scope.allEmpWithIndexById: " +
          JSON.stringify($scope.allEmpWithIndexById)
        );
        console.log(
          " $scope.allGroupAndIndividual: " +
          JSON.stringify($scope.allGroupAndIndividual)
        );
      } else {
        console.log("Sorry: " + data.data.message);
      }
    });
  };
  $scope.getAllChatRightEmp();
  $scope.getEmpDetail = function (index) {
    console.log("getEmpDetail-->");
    $scope.selectedType = "individual_chats";
    console.log(" $scope.selectedType : " + $scope.selectedType);
    $scope.individualData = $scope.allEmp[index];
    console.log(
      " $scope.individualData: " + JSON.stringify($scope.individualData)
    );
    $scope.readText();
  };

  $scope.sendText = function () {
    $("#comment").val("");
    console.log("sendText-->");
    console.log("$scope.typedMessage: " + $scope.typedMessage);
    var api;
    var obj;
    console.log("$scope.selectedType: " + $scope.selectedType);
    if ($scope.selectedType == "individual_chats") {
      api = "https://norecruits.com/careator_individualText/individualText";
      console.log("api: " + api);
      console.log(
        "$scope.receiverData.receiverId: " + $scope.receiverData.receiverId
      );
      console.log(
        " $scope.receiverData.receiverId: " + $scope.receiverData.receiverId
      );
      console.log(" $rootScope.adminId: " + $rootScope.adminId);
      if ($rootScope.adminId == userData.userId) {
        /* ### Note: if loginId is admin id then no need to check restricted list ### */
        obj = {
          senderId: userData.userId,
          receiverId: $scope.receiverData.receiverId,
          senderName: userData.userName,
          receiverName: $scope.receiverData.receiverName,
          message: $scope.typedMessage
        };
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
        });
      } else if (
        ($scope.restrictedArray != undefined && $scope.restrictedArray.indexOf($scope.receiverData.receiverId) >= 0) ||
        ($scope.restrictedArray != undefined || $scope.receiverData.receiverId == $rootScope.adminId)) {
        obj = {
          senderId: userData.userId,
          receiverId: $scope.receiverData.receiverId,
          senderName: userData.userName,
          receiverName: $scope.receiverData.receiverName,
          message: $scope.typedMessage
        };
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
        });
      } else {
        $scope.notifyMsg = "You do not have permission to chat with " + $scope.receiverData.receiverName;
        console.log(" $scope.notifyMsg: " + $scope.notifyMsg);
        $("#alertButton").trigger("click");
      }
    } else if ($scope.selectedType == "group") {
      obj = {
        group_id: $scope.sendGroupText_withData.group_id,
        groupName: $scope.sendGroupText_withData.groupName,
        groupMembers: $scope.sendGroupText_withData.groupMembers,
        senderId: userData.userId,
        senderName: userData.userName,
        message: $scope.typedMessage
      };
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
      });
    }
  };

  $scope.readText = function () {
    console.log("readText-->");
    if ($scope.selectedType == "group") {
      var group_id = $scope.individualData._id;
      var api =
        "https://norecruits.com/careator_groupTextRead/groupTextReadByGroupId/" +
        group_id;
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
      });
    } else {
      var sId = userData.userId;
      var rId = $scope.individualData._id;
      var api =
        "https://norecruits.com/careator_individualTextRead/individualTextReadById/" +
        sId +
        "/" +
        rId;
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
      });
    }
  };

  $scope.getChatRecords = function () {
    console.log("getChatRecords-->");
    var id = $scope.userId;
    var api = "https://norecruits.com/careator_getChatListRecordById/getChatListRecordById/" +
      id;
    console.log("api: " + api);
    careatorHttpFactory.get(api).then(function (data) {
      // console.log("data--" + JSON.stringify(data.data));
      var checkStatus = careatorHttpFactory.dataValidation(data);
      if (checkStatus) {
        $scope.allChatRecords = data.data.data;
        console.log("allChatRecords: " + JSON.stringify($scope.allChatRecords));
        console.log(data.data.message);
        for (var x = 0; x < $scope.allChatRecords.length; x++) {
          if( $scope.allChatRecords[x].unseenCount!=undefined){

          }
          if ($scope.allChatRecords[x].senderId != userData.userId) {
            $scope.allChatRecordsId[x] = $scope.allChatRecords[x]._id;
            var tempData = $scope.allEmpWithIndexById[$scope.allChatRecords[x].senderId];
            //console.log("tempData: "+JSON.stringify(tempData));
            if (tempData != undefined) {
              if (tempData.profilePicPath != undefined) {
                $scope.allChatRecords[x].profilePicPath = tempData.profilePicPath;
              }
            } else { }
          } else {
            $scope.allChatRecordsId[x] = $scope.allChatRecords[x]._id;
            var tempData = $scope.allEmpWithIndexById[$scope.allChatRecords[x].receiverId];
            console.log("tempData: " + JSON.stringify(tempData));
            if (tempData != undefined) {
              if (tempData.profilePicPath != undefined) {
                $scope.allChatRecords[x].profilePicPath = tempData.profilePicPath;
              }
            } else {

            }
          }
        }
        $scope.chatedGroup_records = $scope.allChatRecords; /* ### Note: $scope.chatedGroup_records is Chat(chated records) and group(group records) records storage  ### */
        for (var x = 0; x < $scope.allGroup.length; x++) {
          console.log(" $scope.allGroup.length: " + $scope.allGroup.length);
          console.log("  $scope.chatedGroup_records.length: " + $scope.chatedGroup_records.length);
          $scope.allGroupIds[$scope.chatedGroup_records.length] = $scope.allGroup[x]._id;
          $scope.chatedGroup_records.push($scope.allGroup[x]);
        }
      } else {
        console.log("Sorry");
        console.log(data.data.message);
      }
    });
  };
  $scope.getChatRecords();

  $scope.getGroupDetails = function (id) {
    console.log("getGroupDetails-->");
    console.log("id: " + id);
    var api =
      "https://norecruits.com/careator_getGroup/careator_getGroupById/" + id;
    console.log("api: " + api);
    careatorHttpFactory.get(api).then(function (data) {
      // console.log("data--" + JSON.stringify(data.data));
      var checkStatus = careatorHttpFactory.dataValidation(data);
      if (checkStatus) {
        $scope.groupData = data.data.data[0];

        console.log("groupData: " + JSON.stringify($scope.groupData));
        console.log(data.data.message);
      } else {
        console.log("Sorry");
        console.log(data.data.message);
      }
    });
  };

  /* ### Start: receive message from careator.js  ### */
  socket.on("comm_textReceived", function (data) {
    $scope.scrollDown();
    console.log("****comm_textReceived-->: " + JSON.stringify(data));
    console.log("$scope.individualData: " + JSON.stringify($scope.individualData));

    if (userData.userId == data.receiverId) {
      $scope.playAudio = function () {
        var x = document.getElementById("myAudio");
        x.play();
        $scope.count = $scope.count + 1;
      };
      $scope.playAudio();
    }
    if (data.group_id != undefined) {
      console.log("**Group text received");
      if (data.freshInsert == true && $scope.individualData != undefined && $scope.individualData._id == data.group_id) {
        console.log("Fresh Insert");
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
            console.log(
              "$scope.individualData : " + JSON.stringify($scope.individualData)
            );
            $scope.receiverData = {
              senderId: userData.userId,
              senderName: userData.userName
            };
            if ($scope.individualData.receiverId != userData.userId) {
              $scope.receiverData.receiverId = $scope.individualData.receiverId;
              $scope.receiverData.receiverName =
                $scope.individualData.receiverName;
            } else if ($scope.individualData.senderId != userData.userId) {
              $scope.receiverData.receiverId = $scope.individualData.senderId;
              $scope.receiverData.receiverName = $scope.individualData.senderName;
            }
            console.log("$scope.receiverData : " + JSON.stringify($scope.receiverData));

          } else {
            console.log("Sorry");
            console.log(data.data.message);
          }
        });
        $scope.getChatRecords();

        // $scope.allChat.chats.push({
        //   senderId: data.senderId,
        //   senderName: data.senderName,
        //   message: data.message,
        //   sendTime: data.sendTime
        // });
        // $scope.scrollDown();
      }
      else {
        if ($scope.individualData != undefined && $scope.individualData._id == data.id) {
          var group_id = data.group_id;
          var obj = {
            "seenBy": userData.userId,
            "unseenCount": 0,
          }
          console.log("obj: " + JSON.stringify(obj));
          var api = "https://norecruits.com/careator_textSeenFlagUpdate_toGroupChat/textSeenFlagUpdate_toGroupChat/" + group_id;
          console.log("*api: " + api);
          careatorHttpFactory.post(api, obj).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            if (checkStatus) {
              console.log("Message: " + data.data.message);
            } else {
              console.log("Sorry: " + data.data.message);
            }
          })
          $scope.allChat.chats.push({
            senderId: data.senderId,
            senderName: data.senderName,
            message: data.message,
            sendTime: data.sendTime
          });
          $scope.scrollDown();
        }
        else {
          console.log("Need to notify");
          console.log("")
          if (($scope.individualData != undefined && $scope.individualData._id != data.id) || ($scope.individualData == undefined && $scope.allGroupIds.indexOf(data.group_id) >= 0)) {
            console.log("UnseenCount added to group");
            var index = $scope.allGroupIds.indexOf(data.group_id);
            console.log("index: " + index);
            if (index >= 0) {
              for (var x = 0; x < data.groupMembers.length; x++) {
                if (userData.userId == data.groupMembers[x].userId) {
                  $scope.allChatRecords[index].unseenCount = data.groupMembers[x].unseenCount;
                  console.log(" $scope.allChatRecords[index]: " + JSON.stringify($scope.allChatRecords[index]));
                  break;
                }
                else {
                  console.log("Noting to do");
                }
              }
            }
          }
        }
      }
    }
    else if (data.group_id == undefined) {
      console.log("**Individual text received");
      if ($scope.individualData != undefined && data.freshInsert == true && (userData.userId == data.senderId || userData.userId == data.receiverId)) {
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
            console.log(
              "$scope.individualData : " + JSON.stringify($scope.individualData)
            );
            $scope.receiverData = {
              senderId: userData.userId,
              senderName: userData.userName
            };
            if ($scope.individualData.receiverId != userData.userId) {
              $scope.receiverData.receiverId = $scope.individualData.receiverId;
              $scope.receiverData.receiverName =
                $scope.individualData.receiverName;
            } else if ($scope.individualData.senderId != userData.userId) {
              $scope.receiverData.receiverId = $scope.individualData.senderId;
              $scope.receiverData.receiverName = $scope.individualData.senderName;
            }
            console.log("$scope.receiverData : " + JSON.stringify($scope.receiverData));
          } else {
            console.log("Sorry");
            console.log(data.data.message);
          }
        });
        $scope.getChatRecords();
      }
      else if ($scope.individualData == undefined && data.freshInsert == true && userData.userId == data.receiverId) {
        $scope.getChatRecords();
      }
      else if (data.freshInsert == undefined) {
        console.log("$scope.individualData: " + JSON.stringify($scope.individualData));
        console.log("data.id: " + data.id);
        if ($scope.individualData != undefined && $scope.individualData._id == data.id) {
          console.log("2)start pushing message");
          var id = data.id;
          console.log("id: " + id);
          if (data.senderId != userData.userId) {
            var obj = { "receiverSeen": "yes" }
            console.log("obj: " + JSON.stringify(obj));
            var api = "https://norecruits.com/careator_textSeenFlagUpdate/textSeenFlagUpdate/" + id;
            console.log("api: " + api);

            careatorHttpFactory.post(api, obj).then(function (data) {
              console.log("data--" + JSON.stringify(data.data));
              var checkStatus = careatorHttpFactory.dataValidation(data);
              if (checkStatus) {
                console.log("Message: " + data.data.message);
              } else {
                console.log("Sorry: " + data.data.message);
              }
            })
          }
          $scope.allChat.chats.push({
            senderId: data.senderId,
            senderName: data.senderName,
            message: data.message,
            sendTime: data.sendTime
          });
          $scope.scrollDown();
        } else if ($scope.individualData == undefined || $scope.allChatRecordsId.indexOf(data.id) >= 0) {
          console.log("Notify the Unseen message count: " + JSON.stringify(data));
          if (data.receiverId == userData.userId) {
            console.log("UnseenCount added to individual text");
            var index = $scope.allChatRecordsId.indexOf(data.id);
            $scope.allChatRecords[index].unseenCount = data.unseenCount;
          }

        }
        else {
        }
      }
    }
  });
  socket.on("comm_textSeenFlagUpdate", function (data) {
    console.log("****comm_textSeenFlagUpdate-->: " + JSON.stringify(data));
    //console.log("$scope.allChatRecordsId: " + JSON.stringify($scope.allChatRecordsId));
    //console.log("$scope.allChatRecordsIdindexOf(data.id): " + $scope.allChatRecordsId.indexOf(data.id));
    console.log("$scope.individualData: " + JSON.stringify($scope.individualData));
    console.log("sendGroupText_withData-->: " + JSON.stringify($scope.sendGroupText_withData));
    if (data.isFromGroup != undefined) {
      if (($scope.individualData != undefined && $scope.individualData.group_id == data.id)) {
        console.log("UnseenCount added to group");
        console.log("$scope.allGroupIds: " + JSON.stringify($scope.allGroupIds));
        var index = $scope.allGroupIds.indexOf(data.id);
        if (data.seenBy == userData.userId && index >= 0) {
          $scope.allChatRecords[index].unseenCount = data.unseenCount;
        }
      }
    }
    else {
      if (($scope.allChatRecordsId.indexOf(data.id) >= 0) && data.seenBy == userData.userId) {
        console.log("Need to update");
        var index = $scope.allChatRecordsId.indexOf(data.id);
        $scope.allChatRecords[index].unseenCount = data.unseenCount;
      }
      else if (($scope.allChatRecordsId.indexOf(data.id) >= 0) && data.seenBy != userData.userId) {
        console.log("No need to update");
      }
    }
  })
  socket.on("comm_aboutRestrictedUpdate", function (data) {
    //update to client about their new restricted users
    console.log("****comm_aboutRestrictedUpdate-->: " + JSON.stringify(data));

    if (data.id == userData.userId) {
      var id = userData.userId;
      var api =
        "https://norecruits.com/careator_getUser/careator_getUserById/" + id;
      console.log("api: " + api);
      careatorHttpFactory.get(api).then(function (data) {
        console.log("data--" + JSON.stringify(data.data));
        var checkStatus = careatorHttpFactory.dataValidation(data);
        if (checkStatus) {
          $scope.getUserById = data.data.data[0];
          console.log("getUserById: " + JSON.stringify($scope.getUserById));
          //console.log("$scope.getUserById.restrictedTo: "+JSON.stringify($scope.getUserById.restrictedTo));
          console.log("userData: " + JSON.stringify(userData));
          //var restrictedUser =  $scope.getUserById.restrictedTo;
          var restrictedTo = $scope.getUserById.restrictedTo;
          var restrictedArray = [];
          for (var x = 0; x < restrictedTo.length; x++) {
            restrictedArray.push(restrictedTo[x].userId);
          }
          console.log("restrictedArray: " + JSON.stringify(restrictedArray));
          $scope.restrictedArray = restrictedArray;
          var userData = {
            email: localStorage.getItem("email"),
            userName: localStorage.getItem("userName"),
            empId: localStorage.getItem("empId"),
            userId: localStorage.getItem("userId"),
            restrictedTo: restrictedArray
          };
          if (localStorage.getItem("videoRights") == "yes") {
            userData.videoRights = "yes";
          }
          if (localStorage.getItem("chatRights") == "yes") {
            userData.chatRights = "yes";
            // $scope.getChatGroupListById(localStorage.getItem("userId"));
          }
          if (localStorage.getItem("chatStatus")) {
            userData.chatStatus = localStorage.getItem("chatStatus");
          }

          console.log(
            "userData.restrictedTo: " + JSON.stringify(userData.restrictedTo)
          );

          careatorSessionAuth.clearAccess("userData");
          careatorSessionAuth.setAccess(userData);
          var userData = careatorSessionAuth.getAccess("userData");
          console.log("***userData: " + JSON.stringify(userData));
          $scope.getAllChatRightEmp();
          console.log(data.data.message);
        } else {
          console.log("Sorry");
          console.log(data.data.message);
        }
      });
    }
  });
  socket.on("comm_receiverStatusUpdate", function (data) {
    console.log("****comm_receiverStatusUpdate-->: " + JSON.stringify(data));
    if ($scope.receiverData.receiverId == data.id) {
      $scope.receiverChatStatus = data.status;
    }
  });
  /* ### End: receive message from careator.js  ### */

  /* ### Start: Front end  CSS### */
  $(".heading-compose").click(function () {
    $(".side-two").css({
      left: "0"
    });
    console.log("heading-compose");
  });

  $(".newMessage-back").click(function () {
    $(".side-two").css({
      left: "-100%"
    });
    console.log("newMessage-back");
  });
  // /* ### End: Front end CSS ### */
  $("#comment").keyup(function (event) {
    if (event.keyCode === 13) {
      // $(this).val('');
      $("#sndmgs").click();
      $("#comment").val("");
    }
  });

  ///Auto Scroll Down Chat////////////////
  $scope.scrollDown = function () {
    var clientHeight = document.getElementById('pulldown').scrollHeight;
    console.log("clientHeight" + clientHeight);
    console.log("scrollDown-->");
    $("#pulldown").animate({
      scrollTop: 1234567890
    }, 500);
  };
  if (window.matchMedia('(min-width: 768px)').matches) {
    console.log("<<<<<<<home icon hide>>>>>>>");
    $("#homeicon").css({
      "display": "none"
    })
  }
  if (window.matchMedia('(max-width: 768px)').matches) {
    console.log("<<<<<<<home icon hide>>>>>>>");
    $("#homeicon").css({
      "display": "block"
    })
  }

  ///////chat welcome user////////////
  $scope.startachat=function(){
    $("#newchatwin").trigger("click");
  }


});