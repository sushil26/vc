app.controller('captureImgCtl', function ($scope, $rootScope, $state, $window, httpFactory, sessionAuthFactory) {
    console.log("captureImgCtl==>");
    $scope.propertyJson = $rootScope.propertyJson;
    $scope.userData = sessionAuthFactory.getAccess();
    var schoolName = $scope.userData.schoolName;
    var id = $scope.userData.id;
    $scope.loginType = $scope.userData.loginType;
    $scope.propertyJson = $rootScope.propertyJson;
    $scope.startCamera = false;

    $scope.getSchoolData = function () {
        console.log("getSchoolData-->");
        $scope.cssList = [];
        var api = $scope.propertyJson.VC_getSchoolData + "/" + schoolName;
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            console.log("data--" + JSON.stringify(data.data));
            var checkStatus = httpFactory.dataValidation(data);
            if (checkStatus) {
                var schoolData = data.data.data;
                $scope.cssList = schoolData.css;
                $scope.timeTable_timing = schoolData.timeTable_timing;
                console.log("schoolData: " + JSON.stringify(schoolData));
                console.log("cssList: " + JSON.stringify($scope.cssList));
                console.log("timeTable_timing: " + JSON.stringify($scope.timeTable_timing));
                if ($scope.cssList.length == 0) {
                    console.log("message: " + data.data.message);
                }
                else {
                    console.log("sorry");
                }
            }
            else {
                console.log(data.data.message);
            }
        })
        console.log("<--getSchoolData");
    }
    $scope.getSchoolData();
    $scope.getStudListForCS = function (clas, section) {

        console.log("getStudListForCS-->");
        // console.log("$scope.cssSelect: "+JSON.stringify($scope.cssSelect));
        console.log("clas" + clas);
        console.log("section" + section);
        var clas = clas;
        var section = section;
        $scope.studList = [];

        var api = $scope.propertyJson.VC_getStudListForCS + "/" + schoolName + "/" + clas + "/" + section;
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            //console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                $scope.studentList = data.data.data;
                console.log("studentList: " + JSON.stringify($scope.studentList));
                for (var x = 0; x < $scope.studentList.length; x++) {
                    $scope.studList.push({ "id": $scope.studentList[x]._id, "name": $scope.studentList[x].firstName, "studId": $scope.studentList[x].schoolId });
                }
                console.log(" $scope.studList.length: " + $scope.studList.length);
            }
            else {
                console.log("sorry");
            }
        })
        console.log("<--getStudListForCS");
    }
    $scope.getStudentPersonalData = function (id) {
        console.log("getMarks-->");
        var api = $scope.propertyJson.VC_getStudentAttendance + "/" + id;
        console.log("api: " + api);
        httpFactory.get(api).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
                var studData = data.data.data;
                console.log("studData: " + JSON.stringify(studData));
                $scope.parentEmail = studData[0].parentEmail;
                $scope.studName = studData[0].firstName;
            }
            else {
                console.log("sorry");
            }
        })
        console.log("<--getMarks");
    }
    $scope.getStudentData = function (cs) {
        $scope.startCamera = true;
        $scope.webCam();
        console.log("getStudentMarks-->");
        $scope.events = [];
        console.log("cs: " + JSON.stringify(cs));
        var id = cs.id;
        $scope.getStudentPersonalData(id);
    }
    $scope.webCam = function () {
        // References to all the element we will need.
        var video = document.querySelector('#camera-stream'),
            image = document.querySelector('#snap'),
            start_camera = document.querySelector('#start-camera'),
            controls = document.querySelector('.controls'),
            take_photo_btn = document.querySelector('#take-photo'),
            delete_photo_btn = document.querySelector('#delete-photo'),
            download_photo_btn = document.querySelector('#download-photo'),
            error_message = document.querySelector('#error-message');


        // The getUserMedia interface is used for handling camera input.
        // Some browsers need a prefix so here we're covering all the options
        navigator.getMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);


        if (!navigator.getMedia) {
            displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
        } else {

            // Request the camera.
            navigator.getMedia({
                video: true
            },
                // Success Callback
                function (stream) {

                    // Create an object URL for the video stream and
                    // set it as src of our HTLM video element.
                    video.src = window.URL.createObjectURL(stream);

                    // Play the video element to start the stream.
                    video.play();
                    video.onplay = function () {
                        showVideo();
                    };

                },
                // Error Callback
                function (err) {
                    displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
                }
            );

        }

        // Mobile browsers cannot play video without user input,
        // so here we're using a button to start it manually.
        start_camera.addEventListener("click", function (e) {
            e.preventDefault();
            // Start video playback manually.
            video.play();
            showVideo();

        });


        take_photo_btn.addEventListener("click", function (e) {

            e.preventDefault();
            console.log("e: " + JSON.stringify(e));

            var snap = takeSnapshot();
            console.log("snap: " + snap);
            console.log("snap: " + JSON.stringify(snap));


            // Show image. 
            image.setAttribute('src', snap);
            image.classList.add("visible");

            // Enable delete and save buttons
            delete_photo_btn.classList.remove("disabled");
            download_photo_btn.classList.remove("disabled");

            // Set the href attribute of the download button to the snap url.
            download_photo_btn.href = snap;

            // Pause video playback of stream.
            video.pause();
            document.getElementById('snap').style.display = 'none';
            var resultBlob = dataURItoBlob(snap);
            console.log("resultBlob: " + resultBlob);
            console.log("resultBlob: " + JSON.stringify(resultBlob));
            $scope.mySelfi = snap;
            var parentEmail = $scope.parentEmail;
            var studName = $scope.studName;
            var api = $scope.propertyJson.VC_captureImgSend + "/" + parentEmail + "/" + studName;
            console.log("api: " + api);
            var obj = {
                "data": snap
            }
            httpFactory.imageUpload(api, resultBlob).then(function (data) {
                var checkStatus = httpFactory.dataValidation(data);
                console.log("data--" + JSON.stringify(data.data));
                $state.reload();
                if (checkStatus) {
                    console.log("data" + JSON.stringify(data.data));
                    alert("success");

                }
                else {
                    // alert("fail");
                }

            });
        })

        function dataURItoBlob(dataURI) {
            // convert base64 to raw binary data held in a string
            // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
            var byteString = atob(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

            // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);

            // create a view into the buffer
            var ia = new Uint8Array(ab);

            // set the bytes of the buffer to the correct values
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            // write the ArrayBuffer to a blob, and you're done
            var blob = new Blob([ab], { type: mimeString });
            return blob;

        }


        delete_photo_btn.addEventListener("click", function (e) {
            $state.reload();
            e.preventDefault();

            // Hide image.
            image.setAttribute('src', "");
            image.classList.remove("visible");

            // Disable delete and save buttons
            delete_photo_btn.classList.add("disabled");
            download_photo_btn.classList.add("disabled");

            // Resume playback of stream.
            video.play();

        });



        function showVideo() {
            // Display the video stream and the controls.

            hideUI();
            video.classList.add("visible");
            controls.classList.add("visible");
        }


        function takeSnapshot() {
            // Here we're using a trick that involves a hidden canvas element.  

            var hidden_canvas = document.querySelector('canvas'),
                context = hidden_canvas.getContext('2d');
            context.webkitImageSmoothingEnabled = false;
            context.mozImageSmoothingEnabled = false;
            context.imageSmoothingEnabled = false;

            var width = video.videoWidth,
                height = video.videoHeight;

            if (width && height) {

                // Setup a canvas with the same dimensions as the video.
                hidden_canvas.width = width;
                hidden_canvas.height = height;

                // Make a copy of the current frame in the video on the canvas.
                context.drawImage(video, 0, 0, width, height);

                // Turn the canvas image into a dataURL that can be used as a src for our photo.
                return hidden_canvas.toDataURL('image/png');

            }
        }


        function displayErrorMessage(error_msg, error) {
            error = error || "";
            if (error) {
                console.log(error);
            }

            error_message.innerText = error_msg;

            hideUI();
            error_message.classList.add("visible");
        }


        function hideUI() {
            // Helper function for clearing the app UI.

            controls.classList.remove("visible");
            start_camera.classList.remove("visible");
            video.classList.remove("visible");
            snap.classList.remove("visible");
            error_message.classList.remove("visible");
        }

    }




})