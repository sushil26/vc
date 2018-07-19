app.controller("vcChatAppCtrl", function ($scope, $http, $timeout) {
    console.log("Chat controller==>");

    //    httpFactory.getFile('property.json');
    //    console.log("$rootScope.propertyJson: "+JSON.stringify($rootScope.propertyJson));


    $scope.getChatHistoryById = function () {
        // var api = "https://vc4all.in/chatHistory/getHistoryByEmailId/" + email;
        var api = "https://vc4all.in/chatHistory/getHistory";
        console.log("api: " + api);
        $http({
            method: 'GET',
            url: api
        }).then(function successCallback(response) {
            console.log("response: " + JSON.stringify(response));
            $scope.chatHistory = response.data.data;
            console.log("$scope.chatHistory[0].chat: " + JSON.stringify($scope.chatHistory[0].chat));
            // $scope.chats = $scope.chatHistory[0].chat;
            console.log("$scope.chatHistory: " + $scope.chatHistory[0].chat.length);
        }, function errorCallback(response) {
            console.log("response: " + JSON.stringify(response));
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }

    $scope.chatShow = function (chatHistory) {
        console.log("chatShow-->");
        console.log("chatHistory: "+JSON.stringify(chatHistory));
        
        $scope.chats = chatHistory.chat;

    }

    if (localStorage.getItem("admin")) {
        $scope.getChatHistoryById();
    }
    else {
        $("#loginClick").trigger("click");
    }

    document.querySelector('#crdsubmit').onclick = function () {
        var id = document.getElementById('crdEmail').value;
        console.log("id: " + id);
        var pswd = document.getElementById('crdPswd').value;
        if (id == 'vc4allAdmin@gmail.com') {
            if (pswd == 'vc4all') {
                $('#crdntl').modal('hide');
                localStorage.setItem("admin", "true");
                $scope.getChatHistoryById();
            }
            else {
                document.getElementById("info_email").innerHTML = "Password is Not Valid"
                setTimeout(function () {
                    $('#info_email').fadeOut('fast');
                    $('#info_email').fadeIn('fast');
                    document.getElementById("info_email").innerHTML = '';
                    document.getElementById("info_email").style.display = 'inline';
                }, 3000);
            }
        }
        else {
            document.getElementById("info_email").innerHTML = "Email is Not Valid"
            setTimeout(function () {
                $('#info_email').fadeOut('fast');
                $('#info_email').fadeIn('fast');
                document.getElementById("info_email").innerHTML = '';
                document.getElementById("info_email").style.display = 'inline';
            }, 3000);

        }
    }

    $scope.careator_chatHistoryLogOut = function(){
        console.log("careator_chatHistoryLogOut-->");
        localStorage.removeItem("admin");
        window.location = "http://www.careator.com/";
    }


    //var email = localStorage.getItem('careatorEmail');


})