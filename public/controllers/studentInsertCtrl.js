app.controller("studentInsertCtrl", function($scope, $rootScope, $window, $uibModal, httpFactory) {
  console.log("studInsertCtrl==>");
  console.log("$scope.parentName: " + $scope.parentName);
  $scope.propertyJson = $rootScope.propertyJson;

  $scope.classS = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12"
  ];
  $scope.sectionS = ["A", "B", "C", "D", "E"];
  $scope.saveStudent = function() {
    console.log("saveStudent-->");
    $scope.cs = [{ class: $scope.class, section: $scope.section }];
    var obj = {
      schoolName: $scope.schoolName,
      studId: $scope.studId,
      studName: $scope.studName,
      parentName: $scope.parentName,
      parentEmail: $scope.parentEmail,
      mobileNum: $scope.mobileNum,
      motherName: $scope.mName,
      motherEmail: $scope.mEmail,
      motherNum: $scope.mothermobileNum,
      cs: $scope.cs,
      pswd: $scope.pswd
    };
    console.log("obj: " + JSON.stringify(obj));

    var api = $scope.propertyJson.VC_studentInsert;
    //var api = "http://localhost:5000/vc/studentInsert";

    httpFactory.post(api, obj).then(function(data) {
      var checkStatus = httpFactory.dataValidation(data);
      console.log("data--" + JSON.stringify(data.data));
      if (checkStatus) {
        console.log("data" + JSON.stringify(data.data));
        // $window.location.href = $scope.propertyJson.R082;
        alert("Successfully Student inserted " + data.data.message);
      } else {
        alert("student Insert Fail");
      }
    });

    console.log("<--saveStudent");
  };

  console.log("<==studInsertCtrl");
});
