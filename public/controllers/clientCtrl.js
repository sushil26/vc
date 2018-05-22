app.controller('clientCtrl', function($scope, $rootScope, httpFactory, $window) {
    console.log("client controller==>");
    $scope.title = "VC4ALL";

    $scope.regVc = function(name, id, pswd){
        console.log("regVc-->");

        var api = "http://localhost:8080/vc/register4VC";
        console.log("api: " + api);

        var obj = {
            "userName":name,
            "email": id,
            "password": pswd

        }

        httpFactory.post(api, obj).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {

                console.log("data" + JSON.stringify(data.data))
                // $window.location.href = $scope.propertyJson.R082;
                alert("Successfully registered, after 1hr you can login");
            }
            else {
                alert("Registration Failed");

            }

        })

        console.log("<--regVc");
    }

    $scope.logVC = function(email,pswd){
        console.log("logVC-->");

        var api = "http://localhost:8080/vc/login4VC";
        console.log("api: " + api);

       

        var obj = {
            "email":email,
            "password": pswd
        }
       
        httpFactory.post(api, obj).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {

                console.log("data" + JSON.stringify(data.data))
                // $window.location.href = $scope.propertyJson.R082;
                if(data.data.message=='Profile Inactive'){
                    alert("Profile inactive wait for 1hour for authorization");
                }
                else{
                    alert("Successfully login");
                    
                }

               
               
            }
            else {
                alert("Login Failed");
            }

        })

        console.log("<--logVC");
    } 


})