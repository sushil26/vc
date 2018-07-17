careatorApp.controller('createGroupCtrl', function ($scope, $state,careatorHttpFactory) {
    console.log("createGroupCtrl==>");

    $scope.names = ['Chat', 'Video'];
    $scope.groupMemberSettings = {
        scrollableHeight: '200px',
        scrollable: true,
        enableSearch: true,
        externalIdProp: ''
    };
    $scope.groupMemberData = [];

    $scope.rightEmployeeList = function (value) {
        console.log("rightEmployeeList-->");
        console.log("value: " + value);
        var api;
        if (value == "chat") {
            api = "https://vc4all.in/careator/getChatRights_emp";
        }
        else if (value == "video") {
            api = "https://vc4all.in/careator/getVideoRights_emp";
        }
        else {
            api = "https://vc4all.in/careator/careator_getChatVideo_emp";
        }
        console.log("api: " + JSON.stringify(api));
        careatorHttpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                var groupMembers = data.data.data;
                console.log("groupMembers: " + JSON.stringify(groupMembers));
                $scope.groupMemberData = [];
                for (var x = 0; x < groupMembers.length; x++) {
                    console.log(" before $scope.groupMemberData: " + JSON.stringify($scope.groupMemberData));
                    console.log("groupMembers[x].email: " + groupMembers[x].email + " groupMembers[x]._id: " + groupMembers[x]._id);
                    $scope.groupMemberData.push({
                        "email": groupMembers[x].email,
                        "label": groupMembers[x].name + " - " + groupMembers[x].empId,
                        "id": groupMembers[x]._id
                    });
                    console.log(" after $scope.groupMemberData: " + JSON.stringify($scope.groupMemberData));
                }

                console.log(data.data.message);
            }
            else {
                console.log("Sorry");
                console.log(data.data.message);
            }
        })
        $scope.groupMemberModel = [];


        console.log("<--rightEmployeeList");
    }
    $scope.$watchCollection('groupMemberModel', function () {
        console.log("value changed")
        $scope.groupAdminModel = [];
        $scope.groupAdminSettings = {
            selectionLimit: 1,
            externalIdProp: '',
            enableSearch: true,
        };
        $scope.groupAdminData = $scope.groupMemberModel;
    });

    $scope.creteGroup = function () {
        console.log("creteGroup-->");
        var api;
        var obj = {
            "groupName": $scope.groupName,
        }
        var members = [];
        for (var x = 0; x < $scope.groupMemberModel.length; x++) {
            members.push({ "name": $scope.groupMemberModel[x].label, "email": $scope.groupMemberModel[x].email, "userId": $scope.groupMemberModel[x].id });
        }
        obj.members = members;
        var admin = {};
        for (var x = 0; x < $scope.groupAdminModel.length; x++) {
            admin = {
                "name": $scope.groupAdminModel[x].label,
                "email": $scope.groupAdminModel[x].email,
                "userId": $scope.groupAdminModel[x].id
            };
        }
        obj.admin = admin;
        console.log("obj: " + JSON.stringify(obj));
        if ($scope.rightSelect == 'chat') {
            api = "https://vc4all.in/careator/careator_chat_creteGroup";
        }
        else if ($scope.rightSelect == 'video') {
            api = "https://vc4all.in/careator/careator_video_creteGroup";
        }
        else if ($scope.rightSelect == 'both') {
            api = "https://vc4all.in/careator/careator_chatVideo_creteGroup";
        }
        console.log("api: " + api);
        careatorHttpFactory.post(api, obj).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                console.log(data.data.message);
                $state.go("Cdashboard.groupListCtrl");
            }
            else {
                console.log("Sorry: " + data.data.message);
            }
        })


    }



})