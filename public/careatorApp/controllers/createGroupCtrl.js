careatorApp.controller('createGroupCtrl', function ($scope, $state,careatorHttpFactory, careatorSessionAuth) {
    console.log("createGroupCtrl==>");
    $scope.userData = careatorSessionAuth.getAccess("userData");
    console.log(" $scope.userData : " + JSON.stringify($scope.userData));
    var orgId =  $scope.userData.orgId;

    $scope.names = ['Chat', 'Video'];
    $scope.groupMemberSettings = {
        scrollableHeight: '200px',
        scrollable: true,
        enableSearch: true,
        externalIdProp: ''
    };
    $scope.groupMemberData = [];

    $scope.rightEmployeeList = function () {
        console.log("rightEmployeeList-->");
        // console.log("value: " + value);
        var api;
        // if (value == "chat") {
            api = "https://norecruits.com/careator/getChatRights_emp/"+orgId;
        // }
        // else if (value == "video") {
        //     api = "https://norecruits.com/careator/getVideoRights_emp";
        // }
        // else {
        //     api = "https://norecruits.com/careator/careator_getChatVideo_emp";
        // }
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
                    if(groupMembers[x].loginType=='admin'){
                        $scope.groupMemberData.push({
                            "email": groupMembers[x].email,
                            "label": groupMembers[x].firstName+" "+ groupMembers[x].lastName + "(Admin)",
                            "id": groupMembers[x]._id
                        });
                    }
                    else{
                        $scope.groupMemberData.push({
                            "email": groupMembers[x].email,
                            "label": groupMembers[x].firstName+" "+ groupMembers[x].lastName + " - " + groupMembers[x].empId,
                            "id": groupMembers[x]._id
                        });
                    }
                   
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
    $scope.rightEmployeeList();
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
            "orgId": orgId
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
        // if ($scope.rightSelect == 'chat') {
            api = "https://norecruits.com/careator/careator_chat_creteGroup";
        // }
        // else if ($scope.rightSelect == 'video') {
        //     api = "https://norecruits.com/careator/careator_video_creteGroup";
        // }
        // else if ($scope.rightSelect == 'both') {
        //     api = "https://norecruits.com/careator/careator_chatVideo_creteGroup";
        // }
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