
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
      .state('userAuth', {
        url: '/userAuth',
        templateUrl: '/html/userAuthentication.html',
        controller: 'userAuthCtrl'
      })
  });