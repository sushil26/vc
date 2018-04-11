app.controller('studentInsertCtrl', function ($scope, $window, httpFactory) {
    console.log("studInsertCtrl==>");
    console.log("$scope.parentName: "+$scope.parentName);

   
  
    $scope.saveStudent = function(){
        console.log("saveStudent-->");
        $scope.cs = [{ "class": $scope.class, "section": $scope.section}];
        var obj ={

            "schoolName": $scope.schoolName,
            "studId": $scope.studId,
            "studName": $scope.studName,
            "parentName" : $scope.parentName,
            "parentEmail": $scope.parentEmail,
            "mobileNum": $scope.mobileNum,
            "motherName" : $scope.mName,
            "motherEmail": $scope.mEmail,
            "motherNum": $scope.mothermobileNum,

            "cs": $scope.cs,
            "pswd": $scope.pswd
        }
        console.log("obj: " + JSON.stringify(obj));
        
        var api = "https://vc4all.in/vc/studentInsert";
        //var api = "http://localhost:5000/vc/studentInsert";

        httpFactory.post(api, obj).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
  
              console.log("data" + JSON.stringify(data.data))
              // $window.location.href = $scope.propertyJson.R082;
              alert("Successfully Student inserted " + data.data.message);
             
            }
            else {
              alert("student Insert Fail");
  
            }
  
          })

        console.log("<--saveStudent");
    }

    console.log("<==studInsertCtrl");
})