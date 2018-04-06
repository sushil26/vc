app.controller('teacherInsertCtrl', function ($scope, $window, httpFactory) {
    console.log("teacherInsertCtrl==>");

    $scope.class = ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    $scope.section = ["A", "B", "C", "D", "E"];
    $scope.css = [];
    $scope.addSCC = function () {
        console.log("addSCC-->");

        $scope.css.push({ "class": "", "section": "", "subject": "" })
        
        console.log("<--addSCC");
    }

    $scope.saveTeacher = function(){
        console.log("saveTeacher-->");

        var obj ={

            "schoolName": $scope.schoolName,
            "teacherId": $scope.teacherId,
            "teacherName": $scope.teacherName,
            "teacherEmail" : $scope.teacherEmail,
            "mobileNum": $scope.mobileNum,
            "css": $scope.css,
            "pswd": $scope.pswd
        }
        console.log("obj: " + JSON.stringify(obj));
        
        var api = "https://vc4all.in/vc/teacherInsert";
        httpFactory.post(api, obj).then(function (data) {
            var checkStatus = httpFactory.dataValidation(data);
            console.log("data--" + JSON.stringify(data.data));
            if (checkStatus) {
  
              console.log("data" + JSON.stringify(data.data))
              // $window.location.href = $scope.propertyJson.R082;
              alert("Successfully teacher inserted " + data.data.message);
             
            }
            else {
              alert("Teacher Insert Fail");
  
            }
  
          })

        console.log("<--saveTeacher");
    }

    console.log("<==teacherInsertCtrl");
})