
var app = angular.module('vcApp', ['ui.router', 'mwl.calendar', 'ui.bootstrap', 'ngCookies', 'ngImageInputWithPreview']);


app.config(function ($stateProvider, $urlRouterProvider) {

  // // For any unmatched url, send to /route1
  // $urlRouterProvider.otherwise("/calendar")

  $stateProvider
    .state('calendar', {
      url: '/calendar',
      templateUrl: '/html/calendar.html',
      controller: 'calendarCtrl'
    })
    .state('dashboard.userAuth', {
      url: dashboardUserAuth(),
      templateUrl: '/html/dashboard/userAuthentication.html',
      controller: 'userAuthCtrl',
      resolve: {
        result: function (sessionAuthFactory, $window) {
          var userData = sessionAuthFactory.getAccess("userData");
          if (userData.loginType == 'admin') {

          }
          else {
            $window.location.href = 'https://vc4all.in';
          }
        }
      }
    })
    .state('dashboard.teacherInsert', {
      url: dashboardTeacherI(),
      templateUrl: '/html/dashboard/teacherDataInsert.html',
      controller: 'teacherInsertCtrl',
      resolve: {
        result: function (sessionAuthFactory, $window) {
          var userData = sessionAuthFactory.getAccess("userData");
          if (userData.loginType == 'admin') {

          }
          else {
            $window.location.href = 'https://vc4all.in';
          }
        }
      }
    })
    .state('dashboard.studentInsert', {
      url: dashboardstudentI(),
      templateUrl: '/html/dashboard/studentDataInsert.html',
      controller: 'studentInsertCtrl',
      resolve: {
        result: function (sessionAuthFactory, $window) {
          var userData = sessionAuthFactory.getAccess("userData");
          if (userData.loginType == 'admin') {

          }
          else {
            $window.location.href = 'https://vc4all.in';
          }
        }
      }
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: '/html/dashboard/dashboard.html',
      controller: 'dashboardController'
    })
    .state('dashboard.personalDetail', {
      url: dashboardPersonalDetail(),
      templateUrl: '/html/dashboard/dashboardPersonalDetail.html',
      controller: 'dashboardPersonalDetailController'
    })
    .state('dashboard.editDetails', {
      url: dashboardEdit(),
      templateUrl: '/html/dashboard/dashboardEdit.html',
      controller: 'dashboardEditController'
    })
    .state('dashboard.event', {
      url: dashboardEvent(),
      templateUrl: '/html/dashboard/dashboardEvent.html',
      controller: 'dashboardEventController'
    })
    .state('dashboard.viewUser', {
      url: viewUser(),
      templateUrl: '/html/dashboard/viewUser.html',
      controller: 'viewUserController'
    })
    .state('dashboard.eventShedule', {
      url: dashboardEventShedule(),
      templateUrl: '/html/dashboard/scheduler.html',
      controller: 'dashboardScheduleCtrl',
      resolve: {
        result: function (sessionAuthFactory, $window) {
          var userData = sessionAuthFactory.getAccess("userData");
          if (userData.loginType == 'teacher' || userData.loginType == 'studParent') {
          }
          else {
            $window.location.href = 'https://vc4all.in';
          }
        }
      }

    })
    .state('dashboard.eventReschedule', {
      url: dashboardEventReschedule(),
      templateUrl: '/html/dashboard/rescheduler.html',
      controller: 'dashboardRescheduleCtrl',
      resolve: {
        result: function (sessionAuthFactory, $window) {
          var userData = sessionAuthFactory.getAccess("userData");
          if (userData.loginType == 'teacher') {
          }
          else {
            $window.location.href = 'https://vc4all.in';
          }
        }
      }
    })
    .state('dashboard.conference', {
      url: dashboardConference(),
      templateUrl: '/html/dashboard/conference.html',
      controller: 'dashboardConfCtrl'
    })
    .state('dashboard.comingSoon', {
      url: dashboardComingSoon(),
      templateUrl: '/html/dashboard/comingSoon.html'

    })
    .state('dashboard.upcomingEvent', {
      url: upcomingEvent(),
      templateUrl: '/html/dashboard/upcomingEvent.html',
      controller: 'upcomingEventController',
      resolve: {
        result: function (sessionAuthFactory, $window) {
          var userData = sessionAuthFactory.getAccess("userData");
          if (userData.loginType == 'teacher' || userData.loginType == 'studParent') {
          }
          else {
            $window.location.href = 'https://vc4all.in';
          }
        }
      }
    })
    .state('dashboard.history', {
      url: history(),
      templateUrl: '/html/dashboard/history.html',
      controller: 'historyController',
      resolve: {
        result: function (sessionAuthFactory, $window) {
          var userData = sessionAuthFactory.getAccess("userData");
          if (userData.loginType == 'teacher' || userData.loginType == 'studParent') {
          }
          else {
            $window.location.href = 'https://vc4all.in';
          }
        }
      }
    })

    .state('dashboard.reportsUpload', {
      url: reportsUpload(),
      templateUrl: '/html/dashboard/reportsUpload.html',
      controller: 'reportsUploadCtl',
      resolve: {
        result: function (sessionAuthFactory, $window) {
          var userData = sessionAuthFactory.getAccess("userData");
          if (userData.loginType == 'admin') {
          }
          else {
            $window.location.href = 'https://vc4all.in';
          }
        }
      }
    })
    .state('dashboard.reportsUpdate', {
      url: reportsUpdate(),
      templateUrl: '/html/dashboard/reportsUpdate.html',
      controller: 'reportsUpdateCtl',
      resolve: {
        result: function (sessionAuthFactory, $window) {
          var userData = sessionAuthFactory.getAccess("userData");
          if (userData.loginType == 'admin') {
          }
          else {
            $window.location.href = 'https://vc4all.in';
          }
        }
      }
    })
    .state('dashboard.attendanceView', {
      url: attendanceView(),
      templateUrl: '/html/dashboard/attendanceView.html',
      controller: 'attendanceViewCtl',
      resolve: {
        result: function (sessionAuthFactory, $window) {
          var userData = sessionAuthFactory.getAccess("userData");
          if (userData.loginType == 'teacher' || userData.loginType == 'studParent') {
          }
          else {
            $window.location.href = 'https://vc4all.in';
          }
        }
      }
    })
    .state('dashboard.automationAttendanceView', {
      url: automationAttendanceView(),
      templateUrl: '/html/dashboard/attendanceViewWithConfId.html',
      controller: 'attendanceViewWithConfId_Ctl'
    })
    .state('dashboard.markView', {
      url: markView(),
      templateUrl: '/html/dashboard/markView.html',
      controller: 'markViewCtl',
      resolve: {
        result: function (sessionAuthFactory, $window) {
          var userData = sessionAuthFactory.getAccess("userData");
          if (userData.loginType == 'teacher' || userData.loginType == 'studParent') {
          }
          else {
            $window.location.href = 'https://vc4all.in';
          }
        }
      }
    })
    .state('dashboard.automationResultView', {
      url: automationResultView(),
      templateUrl: '/html/dashboard/markViewWithConfId.html',
      controller: 'markViewWithConfId_Ctl'
    })
    .state('dashboard.adminCreate', {
      url: adminCreate(),
      templateUrl: '/html/dashboard/adminCreate.html',
      controller: 'adminCreateCtl',
      resolve: {
        result: function (sessionAuthFactory, $window) {
          var userData = sessionAuthFactory.getAccess("userData");
          if (userData.loginType == 'vc4allAdmin') {
          }
          else {
            $window.location.href = 'https://vc4all.in';
          }
        }
      }
    })
    .state('dashboard.allUser', {
      url: allUser(),
      templateUrl: '/html/dashboard/allUser.html',
      controller: 'allUserCtl',
      resolve: {
        result: function (sessionAuthFactory, $window) {
          var userData = sessionAuthFactory.getAccess("userData");
          if (userData.loginType == 'vc4allAdmin') {
          }
          else {
            $window.location.href = 'https://vc4all.in';
          }
        }
      }

    })
    .state('dashboard.allAdmin', {
      url: allAdmin(),
      templateUrl: '/html/dashboard/allAdmin.html',
      controller: 'allAdminCtl',
      resolve: {
        result: function (sessionAuthFactory, $window) {
          var userData = sessionAuthFactory.getAccess("userData");
          if (userData.loginType == 'vc4allAdmin') {
          }
          else {
            $window.location.href = 'https://vc4all.in';
          }
        }
      }
    })
    .state('dashboard.allSchool', {
      url: allSchool(),
      templateUrl: '/html/dashboard/allSchool.html',
      controller: 'allSchoolCtl',
      resolve: {
        result: function (sessionAuthFactory, $window) {
          var userData = sessionAuthFactory.getAccess("userData");
          if (userData.loginType == 'vc4allAdmin') {
          }
          else {
            $window.location.href = 'https://vc4all.in';
          }
        }
      }
    })
    .state('dashboard.logout', {
      url: logout(),
      templateUrl: '/html/dashboard/logout.html',
      controller: 'logoutCtl'

    })
    .state('dashboard.contact', {
      url: contact(),
      templateUrl: '/html/dashboard/contact.html',
      controller: 'contactController'
    })


});


function viewUser() {
  return '/viewUser/:id/:loginType';
}
function contact() {
  return '/contact';
}

function dashboardEdit() {
  return '/editDetails';
}
function upcomingEvent() {
  return '/upcomingEvent';
}
function history() {
  return '/history';
}
function dashboardEvent() {
  return '/event';
}
function dashboardPersonalDetail() {
  return '/personalDetail';
}
function dashboardEventShedule() {
  return '/eventShedule';
}
function dashboardEventReschedule() {
  return '/reschedule/:id';
}
function dashboardUserAuth() {
  return '/userAuth';
}
function dashboardstudentI() {
  return '/studentI';
}
function dashboardstudentI() {
  return '/studentI';
}
function dashboardTeacherI() {
  return '/teacherI';
}
function dashboardComingSoon() {
  return '/comingSoon';
}
function dashboardConference() {
  return '/dashboardConference';
}
function adminCreate() {
  return '/adminCreate';
}
function reportsUpload() {
  return '/reportsUpload';
}
function reportsUpdate() {
  return '/reportsUpdate';
}
function adminCreate() {
  return '/adminCreate';
}
function allUser() {
  return '/allUser';
}
function allAdmin() {
  return '/allAdmin';
}
function allSchool() {
  return '/allSchool';
}
function logout() {
  return '/logout';
}
function attendanceView() {
  return '/attendanceView';
}
function markView() {
  return '/markView';
}
function automationResultView() {
  return '/automationResultView/:id';
}
function automationAttendanceView(){
  return '/automationAttendanceView/:id';
}



