careatorApp.controller('editGroupCtrl', function ($scope, $state, $rootScope, $filter, $window, careatorHttpFactory) {
    console.log("editGroupCtrl==>");
    console.log("id: " + $state.params.id);
    var id = $state.params.id;
    $scope.selectedMembers = []; /* ### $scope.selectedMembers contains groupmembers  ### */
    $scope.getGroup = function () {
        console.log("getGroup-->");
        var api = "https://norecruits.com/careator_getGroup/careator_getGroupById/" + id;
        console.log("api: " + api);
        careatorHttpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            if (checkStatus) {
                $scope.userData = data.data.data[0];
                console.log("userData: " + JSON.stringify($scope.userData));
                console.log(data.data.message);

                for (var x = 0; x < $scope.userData.groupMembers.length; x++) {
                    $scope.selectedMembers.push({
                        "email": $scope.userData.groupMembers[x].email,
                        "label": $scope.userData.groupMembers[x].name,
                        "id": $scope.userData.groupMembers[x].userId
                    })
                }
                $scope.selectedAdmin = $scope.userData.admin; /* ### $scope.selectedAdmin contains admin details  ### */
                $scope.rightEmployeeList();


            } else {
                console.log("Sorry");
                console.log(data.data.message);
            }
        })
        console.log("<--getAllEmployee");
    }
    $scope.getGroup();

    $scope.groupMemberSettings = {
        scrollableHeight: '200px',
        scrollable: true,
        enableSearch: true,
        externalIdProp: ''
    };
    $scope.groupMemberData = [];
    $scope.groupMemberModel = [];

    $scope.rightEmployeeList = function () {
        console.log("rightEmployeeList-->");
        var api = "https://norecruits.com/careator/getChatRights_emp";
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
                    for (var y = 0; y < $scope.selectedMembers.length; y++) {
                        console.log("y iteration-->");
                        if ($scope.selectedMembers[y].id == $scope.groupMemberData[x].id) {
                            $scope.groupMemberModel.push($scope.groupMemberData[x]);
                        }
                    }
                }
                $scope.groupAdminData = $scope.groupMemberModel;
                for (var x = 0; x < $scope.groupAdminData.length; x++) {
                    console.log("$scope.groupAdminData[x]: " + JSON.stringify($scope.groupAdminData[x]));
                    console.log("$scope.selectedAdmin: " + JSON.stringify($scope.selectedAdmin));
                    if ($scope.groupAdminData[x].id == $scope.selectedAdmin.userId) {
                        $scope.groupAdminModel.push($scope.groupAdminData[x]);
                    }
                }
                console.log(data.data.message);
            }
            else {
                console.log("Sorry");
                console.log(data.data.message);
            }
        })
        console.log("<--rightEmployeeList");
    }

    $scope.groupAdminSettings = {
        selectionLimit: 1,
        externalIdProp: '',
        enableSearch: true,
    };

    $scope.groupAdminModel = [];


    $scope.updateGroup = function () {
        console.log("updateGroup-->");
        var api = "https://norecruits.com/careator_groupUpdate/groupUpdateById/" + id;
        console.log("api: " + api);
        var obj = {
            "groupName": $scope.grpname,
        }
        console.log("groupName: " + $scope.grpname);

        var groupMembers = [];
        console.log("$scope.groupMemberModel: " + JSON.stringify($scope.groupMemberModel));
        for (var x = 0; x < $scope.groupMemberModel.length; x++) {
            groupMembers.push({
                "email": $scope.groupMemberModel[x].email,
                "name": $scope.groupMemberModel[x].label,
                "userId": $scope.groupMemberModel[x].id
            })
        }
        obj.memebers = groupMembers;
        console.log("groupMembers: " + JSON.stringify(groupMembers));
        var groupAdmin; /* ### Note: admin storage  ### */
        console.log("$scope.groupAdminModel: " + JSON.stringify($scope.groupAdminModel));
        for (var x = 0; x < $scope.groupAdminModel.length; x++) {
            groupAdmin = {
                "email": $scope.groupAdminModel[x].email,
                "name": $scope.groupAdminModel[x].label,
                "userId": $scope.groupMemberModel[x].id
            }
        }
        obj.admin = groupAdmin;
        console.log("obj: " + JSON.stringify(obj));

        careatorHttpFactory.post(api, obj).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                console.log(data.data.message);
                $state.go("Cdashboard.groupListCtrl")
            }
            else {
                console.log("Sorry: " + data.data.message);
            }
        })
    }




})