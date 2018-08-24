careatorApp.controller('userRestrictionCtrl', function ($scope, $state, $rootScope, careatorHttpFactory, careatorSessionAuth) {
    console.log("editGroupCtrl==>");
    $scope.userData = careatorSessionAuth.getAccess("userData");
    console.log(" $scope.userData : " + JSON.stringify($scope.userData));
    var orgId =  $scope.userData.orgId;
    console.log("id: " + $state.params.id);
    var id = $state.params.id;
    $scope.selectedMembers = []; /* ### $scope.selectedMembers contains groupmembers  ### */
    var allUsers = [];

    $scope.allUserSettings = {
        scrollableHeight: '200px',
        scrollable: true,
        enableSearch: true,
        externalIdProp: '',
        selectionLimit: 1,
    };
    $scope.userSelectEvent = {
        onItemSelect: function (item) {
            console.log('selected: ' + item);
            console.log('selected json: ' + JSON.stringify(item));
            var id = item.id;
            var api = "https://norecruits.com//careator_getUser/careator_getUserById/" + id;
            console.log("api: " + JSON.stringify(api));
            careatorHttpFactory.get(api).then(function (data) {
                console.log("data--" + JSON.stringify(data.data));
                var checkStatus = careatorHttpFactory.dataValidation(data);
                console.log("data--" + JSON.stringify(data.data));
                if (checkStatus) {
                    allUsersData = data.data.data[0];
                    console.log("allUsersData: " + JSON.stringify(allUsersData));
                    $scope.restrictedTo = [];
                    
                    if (allUsersData.restrictedTo == undefined) {
                        $scope.authorizedFor();
                    }
                    else {
                        console.log("allUsersData.restrictedTo: " + JSON.stringify(allUsersData.restrictedTo));
                        console.log("allUsersData.restrictedTo.length: " + allUsersData.restrictedTo.length);

                        for (var x = 0; x < allUsersData.restrictedTo.length; x++) {
                            $scope.restrictedTo.push(allUsersData.restrictedTo[x].userId);
                        }
                        console.log("$scope.restrictedTo: " + JSON.stringify($scope.restrictedTo));
                        $scope.authorizedFor();
                    }

                }
            })
        },
        onItemDeselect: function (item) {
            console.log('unselected: ' + item);
            console.log('unselected json: ' + JSON.stringify(item));
        }
    }
    $scope.allUserData = [];
    $scope.allUserModel = [];

    $scope.rightEmployeeList = function () {
        console.log("rightEmployeeList-->");
        var api = "https://norecruits.com/careator/getChatRights_emp/"+orgId;
        console.log("api: " + JSON.stringify(api));
        careatorHttpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                allUsers = data.data.data;

                console.log("allUsers: " + JSON.stringify(allUsers));
                $scope.allUserData = [];
                for (var x = 0; x < allUsers.length; x++) {
                    console.log(" before $scope.allUserData: " + JSON.stringify($scope.allUserData));
                    console.log("allUsers[x].email: " + allUsers[x].email + " allUsers[x]._id: " + allUsers[x]._id);
                    $scope.allUserData.push({
                        "email": allUsers[x].email,
                        "label": allUsers[x].firstName +" "+allUsers[x].lastName+" - " + allUsers[x].empId,
                        "id": allUsers[x]._id
                    });
                    for (var y = 0; y < $scope.selectedMembers.length; y++) {
                        console.log("y iteration-->");
                        if ($scope.selectedMembers[y].id == $scope.allUserData[x].id) {
                            $scope.allUserModel.push($scope.allUserData[x]);
                        }
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
    $scope.rightEmployeeList();

    $scope.authorizedUserModel = [];
    $scope.authorizedUserSettings = {
        scrollableHeight: '200px',
        scrollable: true,
        enableSearch: true,
        externalIdProp: '',
        showUncheckAll: false
    };
    $scope.restrictedUserSelectEvent = {
        onItemSelect: function (item) {
            console.log('selected: ' + item);
            console.log('selected json: ' + JSON.stringify(item));
            var id = item.id;
            var restrictedTo = {
                "userId": $scope.allUserModel[0].id
            }
            console.log("restrictedTo: " + JSON.stringify($scope.restrictedTo));
            var api = "https://norecruits.com/careator_restrictedTo/restrictedTo/" + id;
            console.log("api: " + api);
            var obj = {
                "restrictedTo": restrictedTo
            }
            careatorHttpFactory.post(api, obj).then(function (data) {
                console.log("data--" + JSON.stringify(data.data));
                var checkStatus = careatorHttpFactory.dataValidation(data);
                console.log("data--" + JSON.stringify(data.data));
                if (checkStatus) {
                    console.log(data.data.message);
                    $scope.addRestrictionToSelectedUser($scope.allUserModel[0].id, item.id);
                }
                else {
                    console.log("Sorry: " + data.data.message);
                }
            })
        },
        onItemDeselect: function (item) {
            console.log('unselected: ' + item);
            console.log('unselected json: ' + JSON.stringify(item));
            var id = $scope.allUserModel[0].id;
            console.log("id: " + id);
            var restrictedTo = {
                "userId": item.id
            }
            console.log("restrictedTo: " + JSON.stringify(restrictedTo));
            var api = "https://norecruits.com/careator_removeRestrictedUserById/removeRestrictedUserById/" + id;
            console.log("api: " + api);
            var obj = {
                "restrictedTo": restrictedTo
            }
            careatorHttpFactory.post(api, obj).then(function (data) {
                console.log("data--" + JSON.stringify(data.data));
                var checkStatus = careatorHttpFactory.dataValidation(data);
                console.log("data--" + JSON.stringify(data.data));
                if (checkStatus) {
                    console.log(data.data.message);
                    $scope.removeRestriction(item.id, $scope.allUserModel[0].id);
                }
                else {
                    console.log("Sorry: " + data.data.message);
                }
            })
        },
        onSelectAll: function () {
            console.log('onSelectAll-->');
            alert("Coming Soon: As per now, please select one item at a time");
            console.log('All authorizedUserData: ' + JSON.stringify($scope.authorizedUserData));
        },
        onDeselectAll: function () {
            console.log('onDeselectAll-->');
            console.log('All authorizedUserData: ' + JSON.stringify($scope.authorizedUserData));
        }
    }
    $scope.authorizedFor = function () {
        console.log("authorizedFor-->");
        $scope.authorizedUserData = [];
        $scope.authorizedUserModel = [];
        console.log("$scope.restrictedTo: " + JSON.stringify($scope.restrictedTo));
        var counter = 0;
        for (var x = 0; x < allUsers.length; x++) {
            console.log("start to gather data");
            if ($scope.allUserModel[0].id != allUsers[x]._id) {
                counter = counter + 1;
                $scope.authorizedUserData.push({
                    "email": allUsers[x].email,
                    "label": allUsers[x].firstName +" "+allUsers[x].lastName + " - " + allUsers[x].empId,
                    "id": allUsers[x]._id,
                });
                console.log("$scope.restrictedTo.indexOf(" + allUsers[x]._id + "): " + $scope.restrictedTo.indexOf(allUsers[x]._id));
                if ($scope.restrictedTo.indexOf(allUsers[x]._id) >= 0) {
                    $scope.authorizedUserModel.push($scope.authorizedUserData[counter - 1]);
                }

            }
        }
        console.log("authorizedUserData: " + JSON.stringify($scope.authorizedUserData));
        console.log("authorizedUserModel: " + JSON.stringify($scope.authorizedUserModel));
    }

    $scope.restrictUpdate = function () {
        console.log("restrictUpdate-->");
        console.log("allUserModel: " + JSON.stringify($scope.allUserModel));
        var id = $scope.allUserModel[0].id;
        console.log("allUserModel[0].id: " + $scope.allUserModel[0].id);
        console.log("authorizedUserModel: " + JSON.stringify($scope.authorizedUserModel));
        var restrictedTo = [];
        for (var x = 0; x < $scope.authorizedUserModel.length; x++) {
            restrictedTo.push({
                "userId": $scope.authorizedUserModel[x].id
            });
        }
        console.log("restrictedTo: " + JSON.stringify($scope.restrictedTo));
        var api = "https://norecruits.com/careator_restrictedToSave/restrictedToSave/" + id;
        console.log("api: " + api);
        var obj = {
            "restrictedTo": restrictedTo
        }
        careatorHttpFactory.post(api, obj).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                console.log(data.data.message);

            }
            else {
                console.log("Sorry: " + data.data.message);
            }
        })
    }

    $scope.removeRestriction = function (id, restrictedId) {
        console.log("removeRestriction-->");
        var id = id;
        console.log("id: " + id);
        var restrictedTo = {
            "userId": restrictedId
        }
        console.log("restrictedTo: " + JSON.stringify(restrictedTo));
        var api = "https://norecruits.com/careator_removeRestrictedUserById/removeRestrictedUserById/" + id;
        console.log("api: " + api);
        var obj = {
            "restrictedTo": restrictedTo
        }
        careatorHttpFactory.post(api, obj).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                console.log(data.data.message);

            }
            else {
                console.log("Sorry: " + data.data.message);
            }
        })
    }

    $scope.addRestrictionToSelectedUser = function (id, restrictedId) {
        console.log("removeRestriction-->");
        var id = id;
        console.log("id: " + id);
        var restrictedTo = {
            "userId": restrictedId
        }
        console.log("restrictedTo: " + JSON.stringify(restrictedTo));
        var api = "https://norecruits.com/careator_restrictedTo/restrictedTo/" + id;
        console.log("api: " + api);
        var obj = {
            "restrictedTo": restrictedTo
        }
        careatorHttpFactory.post(api, obj).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                console.log(data.data.message);

            }
            else {
                console.log("Sorry: " + data.data.message);
            }
        })
    }


})