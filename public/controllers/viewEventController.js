app.controller('viewEventController', function ($scope, $rootScope, $state, $window, httpFactory, $uibModal) {
    console.log("viewUserController==>");
    var id = $state.params.id;


    $scope.getVideo = function () {
        console.log("getVideo-->");
        var id = $scope.eventDetails.vcRecordId;
        var api = $scope.propertyJson.VC_getRecordVideo + "/" + id;
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                console.log("status true");
                $scope.videoSrc = data.data.data;
                // var x = $scope.videoSrc.substr(9);
                // console.log("")
                // console.log("x: "+x);
                // var splitData =x.split(',');
                // console.log(" $scope.videoSrc : "+ $scope.videoSrc );
                // console.log("splitData: " + splitData[2]);
                var video = document.getElementById('videoPlayer');
                video.src = $scope.videoSrc;
                // $scope.videoSrc = 'data:video/webm;base64,' + $scope.videoSrc;
                
                //$scope.videoSrc = $scope.videoSrc;
                //console.log(" $scope.videoSrc: "+ $scope.videoSrc);
            }
            else {
                console.log("Sorry: status false");
                console.log("data: " + JSON.stringify(data));
            }
            // console.log("$scope.eventDetails: " + JSON.stringify($scope.eventDetails));
        })
    }


    $scope.getEventDetails = function (id) {
        console.log("getTeacherData-->");
        var api = $scope.propertyJson.VC_getEventById + "/" + id;
        //var api = "http://localhost:5000/vc/eventGet"+ "/" + id;;
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.eventDetails = data.data.data[0];
                console.log("$scope.eventDetails: " + JSON.stringify($scope.eventDetails));
                $scope.getVideo();
            }
            else {
                //alert("Event get Failed");
            }
        })
        console.log("<--getTeacherData");
    }
    $scope.getEventDetails(id);

  
})