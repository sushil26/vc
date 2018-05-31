app.controller("teacherInsertCtrl", function($scope, $rootScope, $window, httpFactory, $uibModal) 
{
  console.log("teacherInsertCtrl==>");
  $scope.class = ["1","2","3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  $scope.section = ["A", "B", "C", "D", "E"];
  $scope.css = [];
  $scope.propertyJson = $rootScope.propertyJson;

  $scope.addSCC = function() {
    console.log("addSCC-->");
    $scope.css.push({ class: "", section: "", subject: "" });
    console.log("<--addSCC");
  };

  $scope.saveTeacher = function() {
    console.log("saveTeacher-->");
    var obj = {
      schoolName: $scope.schoolName,
      teacherId: $scope.teacherId,
      teacherName: $scope.teacherName,
      teacherEmail: $scope.teacherEmail,
      mobileNum: $scope.mobileNum,
      css: $scope.css,
      pswd: $scope.pswd,
      timetabletech: [
        {
          Monday: [
            {
              class: $scope.selectedClass1,
              section: $scope.selectedSection1,
              subject: $scope.subj1
            },
            {
              class: $scope.selectedClass2,
              section: $scope.selectedSection2,
              subject: $scope.subj2
            },
            {
              class: $scope.selectedClass3,
              section: $scope.selectedSection3,
              subject: $scope.subj3
            },
            {
              class: $scope.selectedClass4,
              section: $scope.selectedSection4,
              subject: $scope.subj4
            },
            {
              class: $scope.selectedClass5,
              section: $scope.selectedSection5,
              subject: $scope.subj5
            },
            {
              class: $scope.selectedClass6,
              section: $scope.selectedSection6,
              subject: $scope.subj6
            },
            {
              class: $scope.selectedClass7,
              section: $scope.selectedSection7,
              subject: $scope.subj7
            },
            {
              class: $scope.selectedClass8,
              section: $scope.selectedSection8,
              subject: $scope.subj8
            }
          ]}, 
          {Tues: [
            {
              class: $scope.selectedClass9,
              section: $scope.selectedSection9,
              subject: $scope.subj9
            },
            {
              class: $scope.selectedClass10,
              section: $scope.selectedSection10,
              subject: $scope.subj10
            },
            {
              class: $scope.selectedClass11,
              section: $scope.selectedSection11,
              subject: $scope.subj11
            },
            {
              class: $scope.selectedClass12,
              section: $scope.selectedSection12,
              subject: $scope.subj12
            },
            {
              class: $scope.selectedClass13,
              section: $scope.selectedSection13,
              subject: $scope.subj13
            },
            {
              class: $scope.selectedClass14,
              section: $scope.selectedSection14,
              subject: $scope.subj14
            },
            {
              class: $scope.selectedClass15,
              section: $scope.selectedSection15,
              subject: $scope.subj15
            },
            {
              class: $scope.selectedClass16,
              section: $scope.selectedSection16,
              subject: $scope.subj16
            }
          ]},
          {Wed: [
            {
              class: $scope.selectedClass17,
              section: $scope.selectedSection17,
              subject: $scope.subj17
            },
            {
              class: $scope.selectedClass18,
              section: $scope.selectedSection18,
              subject: $scope.subj18
            },
            {
              class: $scope.selectedClass19,
              section: $scope.selectedSection19,
              subject: $scope.subj19
            },
            {
              class: $scope.selectedClass20,
              section: $scope.selectedSection20,
              subject: $scope.subj20
            },
            {
              class: $scope.selectedClass21,
              section: $scope.selectedSection21,
              subject: $scope.subj21
            },
            {
              class: $scope.selectedClass22,
              section: $scope.selectedSection22,
              subject: $scope.subj22
            },
            {
              class: $scope.selectedClass23,
              section: $scope.selectedSection23,
              subject: $scope.subj23
            },
            {
              class: $scope.selectedClass24,
              section: $scope.selectedSection24,
              subject: $scope.subj24
            }
          ]},
          {Thurs: [
            {
              class: $scope.selectedClass25,
              section: $scope.selectedSection25,
              subject: $scope.subj25
            },
            {
              class: $scope.selectedClass26,
              section: $scope.selectedSection26,
              subject: $scope.subj26
            },
            {
              class: $scope.selectedClass27,
              section: $scope.selectedSection27,
              subject: $scope.subj27
            },
            {
              class: $scope.selectedClass28,
              section: $scope.selectedSection28,
              subject: $scope.subj29
            },
            {
              class: $scope.selectedClass29,
              section: $scope.selectedSection29,
              subject: $scope.subj29
            },
            {
              class: $scope.selectedClass30,
              section: $scope.selectedSection30,
              subject: $scope.subj30
            },
            {
              class: $scope.selectedClass31,
              section: $scope.selectedSection31,
              subject: $scope.subj31
            },
            {
              class: $scope.selectedClass32,
              section: $scope.selectedSection32,
              subject: $scope.subj32
            }
          ]},
          {Fri: [
            {
              class: $scope.selectedClass33,
              section: $scope.selectedSection33,
              subject: $scope.subj33
            },
            {
              class: $scope.selectedClass34,
              section: $scope.selectedSection34,
              subject: $scope.subj34
            },
            {
              class: $scope.selectedClass35,
              section: $scope.selectedSection35,
              subject: $scope.subj35
            },
            {
              class: $scope.selectedClass36,
              section: $scope.selectedSection36,
              subject: $scope.subj36
            },
            {
              class: $scope.selectedClass37,
              section: $scope.selectedSection37,
              subject: $scope.subj37
            },
            {
              class: $scope.selectedClass38,
              section: $scope.selectedSection38,
              subject: $scope.subj38
            },
            {
              class: $scope.selectedClass39,
              section: $scope.selectedSection39,
              subject: $scope.subj39
            },
            {
              class: $scope.selectedClass40,
              section: $scope.selectedSection40,
              subject: $scope.subj40
            }
          ]},
          {Sat: [
            {
              class: $scope.selectedClass41,
              section: $scope.selectedSection41,
              subject: $scope.subj41
            },
            {
              class: $scope.selectedClass42,
              section: $scope.selectedSection42,
              subject: $scope.subj42
            },
            {
              class: $scope.selectedClass43,
              section: $scope.selectedSection43,
              subject: $scope.subj43
            },
            {
              class: $scope.selectedClass44,
              section: $scope.selectedSection44,
              subject: $scope.subj44
            },
            {
              class: $scope.selectedClass45,
              section: $scope.selectedSection45,
              subject: $scope.subj45
            },
            {
              class: $scope.selectedClass46,
              section: $scope.selectedSection46,
              subject: $scope.subj46
            },
            {
              class: $scope.selectedClass47,
              section: $scope.selectedSection47,
              subject: $scope.subj47
            },
            {
              class: $scope.selectedClass48,
              section: $scope.selectedSection48,
              subject: $scope.subj48
            }
          ]}
        
      ]
    };
    console.log("obj: " + JSON.stringify(obj));

    var api = $scope.propertyJson.VC_teacherInsert;
    //var api = "http://localhost:5000/vc/teacherInsert";
    httpFactory.post(api, obj).then(function(data) {
      var checkStatus = httpFactory.dataValidation(data);
      console.log("data--" + JSON.stringify(data.data));
      if (checkStatus) {
        console.log("data" + JSON.stringify(data.data));
        // $window.location.href = $scope.propertyJson.R082;
        alert("Successfully teacher inserted " + data.data.message);
      } else {
        alert("Teacher Insert Fail");
      }
    });

    console.log("<--saveTeacher");
  };

  console.log("<==teacherInsertCtrl");
});
