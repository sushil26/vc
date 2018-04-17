
var app = angular.module('vcApp', ['ui.router', 'mwl.calendar', 'ui.bootstrap', 'ngCookies']);


 app.config(function($stateProvider, $urlRouterProvider) {

    // For any unmatched url, send to /route1
    $urlRouterProvider.otherwise("/calendar")

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
        resolve: {result : function($window)
          {
              // var x =authFact.getLoginType();
              if(localStorage.getItem("loginType") == 'admin')
              {
                 
              }
               else{
                  $window.location.href='https://norecruits.com';
               }
             
             
          }}
      })
      .state('dashboard.teacherInsert', {
        url: dashboardTeacherI(),
        templateUrl: '/html/dashboard/teacherDataInsert.html',
        controller: 'teacherInsertCtrl',
        resolve: {result : function($window)
          {
              // var x =authFact.getLoginType();
              if(localStorage.getItem("loginType") == 'admin')
              {
                 
              }
               else{
                  $window.location.href='https://norecruits.com';
               }
             
             
          }}
      })
      .state('dashboard.studentInsert', {
        url: dashboardstudentI(),
        templateUrl: '/html/dashboard/studentDataInsert.html',
        controller: 'studentInsertCtrl',
        resolve: {result : function($window)
          {
              // var x =authFact.getLoginType();
              if(localStorage.getItem("loginType") == 'admin')
              {
                 
              }
               else{
                  $window.location.href='https://norecruits.com';
               }
                   
          }}
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
      .state('dashboard.eventShedule', {
        url: dashboardEventShedule(),
        templateUrl: '/html/dashboard/scheduler.html',
        controller: 'dashboardScheduleCtrl',
        resolve: {result : function($window)
          {
              // var x =authFact.getLoginType();
              if(localStorage.getItem("loginType") == 'teacher' || localStorage.getItem("loginType") == 'studParent')
              {
                 
              }
               else{
                  $window.location.href='https://norecruits.com';
               }
             
             
          }}
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
        controller: 'upcomingEventController'
      })
      .state('dashboard.history', {
        url: history(),
        templateUrl: '/html/dashboard/history.html',
        controller: 'historyController'
      })
    
  });

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
function dashboardEventShedule(){
  return '/eventShedule';
}
function dashboardUserAuth(){
  return '/userAuth';
}
function dashboardstudentI(){
  return '/studentI';
}
function dashboardstudentI(){
  return '/studentI';
}
function dashboardTeacherI(){
   return '/teacherI';
}
function dashboardComingSoon(){
  return '/comingSoon';
}
function dashboardConference(){
  return '/dashboardConference';
}


