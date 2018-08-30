careatorApp.controller('groupListCtrl', function ($scope, $state, careatorHttpFactory, SweetAlert, careatorSessionAuth) {
    console.log("groupListCtrl==>");
    $scope.userData = careatorSessionAuth.getAccess("userData");
    console.log(" $scope.userData : " + JSON.stringify($scope.userData));
    var orgId =  $scope.userData.orgId;

    $scope.getGroupList = function () {
        console.log("getGroupList-->");
        var api = "https://norecruits.com/careator_chatGroupList/careator_getChatGroupList/"+orgId;
        console.log("api: " + api);
        careatorHttpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = careatorHttpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.groupList = data.data.data;
                console.log("GroupList: " + JSON.stringify($scope.groupList));
                console.log(data.data.message);
            } else {
                console.log("Sorry");
                console.log(data.data.message);
            }
        })
        console.log("<--getGroupList");
    }

    $scope.getGroupList();

    $scope.statusChange = function (id, status) {
        console.log("status: "+status);
        if (status == 'active') {
            console.log("active-->");
            SweetAlert.swal({
                    title: "Are you sure to Activate the Group?", //Bold text
                    text: "User will be able to Use !", //light text
                    type: "warning", //type -- adds appropiriate icon
                    showCancelButton: true, // displays cancel btton
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, Activate it!",
                    closeOnConfirm: false, //do not close popup after click on confirm, usefull when you want to display a subsequent popup
                    closeOnCancel: false
                },
                function (isConfirm) { //Function that triggers on user action.
                    if (isConfirm) {
                        SweetAlert.swal({
                            title: "Activated!",
                            type: "success"
                        });
                        console.log("statusChange-->");
                        console.log("id: " + id + " status: " + status);
                        var obj = {
                            "id": id,
                            "status": status
                        }
                        var api = "https://norecruits.com/careator/groupStatusChangeById";
                        console.log("api: " + api);
                        careatorHttpFactory.post(api, obj).then(function (data) {
                            console.log("data--" + JSON.stringify(data.data));
                            var checkStatus = careatorHttpFactory.dataValidation(data);
                            console.log("data--" + JSON.stringify(data.data));
                            if (checkStatus) {
                                $scope.getGroupList();
                                console.log(data.data.message);
                            } else {
                                console.log("Sorry");
                                console.log(data.data.message);
                            }
                        })
                        console.log("<--statusChange");
                    } else {

                        SweetAlert.swal({
                            title: "Not Activated!",
                            type: "info",
                            text: "You did not Activate the group!"
                        });
                    }
                }

            )
        }
        if (status == 'inactive') {
            console.log("inactive-->");
            SweetAlert.swal({
                    title: "Are you sure to Deactivate the Group ?", //Bold text
                    text: "User will not be able to use !", //light text
                    type: "warning", //type -- adds appropiriate icon
                    showCancelButton: true, // displays cancel btton
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, Deactivate!",
                    closeOnConfirm: false, //do not close popup after click on confirm, usefull when you want to display a subsequent popup
                    closeOnCancel: false
                },
                function (isConfirm) { //Function that triggers on user action.
                    if (isConfirm) {
                        SweetAlert.swal({
                            title: "Deactivated!",
                            type: "success"
                        });
                        console.log("statusChange-->");
                        console.log("id: " + id + " status: " + status);
                        var obj = {
                            "id": id,
                            "status": status
                        }
                        var api = "https://norecruits.com/careator/groupStatusChangeById";
                        console.log("api: " + api);
                        careatorHttpFactory.post(api, obj).then(function (data) {
                            console.log("data--" + JSON.stringify(data.data));
                            var checkStatus = careatorHttpFactory.dataValidation(data);
                            console.log("data--" + JSON.stringify(data.data));
                            if (checkStatus) {
                                $scope.getGroupList();
                                console.log(data.data.message);
                            } else {
                                console.log("Sorry");
                                console.log(data.data.message);
                            }
                        })
                        console.log("<--statusChange");
                    } else {
                        SweetAlert.swal({
                            title: "Not Deactivated!",
                            type: "warning",
                            text: "Users can  still use this Group!"
                        });
                    }
                }

            )
        }
    }
    /////////////////Redirect page with data (id)///////////////////////
    $scope.editGroup = function (index) {
        console.log("editGroup-->");
        console.log("$scope.groupList[index]: " + JSON.stringify($scope.groupList[index]));
        var data = $scope.groupList[index];
        $state.go("Cdashboard.editGroup", {
            "id": data._id
        });
    }


    ////////////////Delete User/////////////////////////
    $scope.deleteGroup = function (id) {
        SweetAlert.swal({
                title: "Are you sure you want to delete the Group??", //Bold text
                text: "Your will not be able to recover this Group!", //light text
                type: "warning", //type -- adds appropiriate icon
                showCancelButton: true, // displays cancel btton
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false, //do not close popup after click on confirm, usefull when you want to display a subsequent popup
                closeOnCancel: false
            },
            function (isConfirm) { //Function that triggers on user action.
                if (isConfirm) {
                    SweetAlert.swal({
                        title: "Deleted!",
                        type: "success",
                    });
                    console.log("deleteGroup-->");
                    console.log("Obj ID  " + id);
                    // $("#GroupDeleteButton").trigger("click");
                    var api = "https://norecruits.com/careator_groupDelete/groupDeleteById/" + id;
                    console.log("api: " + api);
                    careatorHttpFactory.get(api).then(function (data) {
                        console.log("data--" + JSON.stringify(data.data));
                        var checkStatus = careatorHttpFactory.dataValidation(data);
                        console.log("data--" + JSON.stringify(data.data));
                        if (checkStatus) {
                            console.log(data.data.message);
                            $scope.getGroupList();
                        } else {
                            console.log("Sorry");
                            console.log(data.data.message);
                        }
                    })
                    console.log("<--statusChange");
                } else {
                    SweetAlert.swal({
                        title: "safe",
                        text: "Your group is safe!",
                        type: "info"
                    });
                }
            }
        )
    }
    /////////serch///////////////////
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname; //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }


    
})