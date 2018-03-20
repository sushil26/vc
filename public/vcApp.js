
var app = angular.module('vcApp', ['ui.router', 'mwl.calendar', 'ui.bootstrap', 'ngCookies']);
app.config(function ($stateProvider, $urlRouterProvider) {
    // $urlRouterProvider.otherwise('/vc');
//  $urlRouterProvider.otherwise('/client');
    $stateProvider
        // .state('vc', {
        //     url: '/vc',
        //     templateUrl: '/home.html'
        // })
        .state('client', {
            url: '/:urlId',
            templateUrl: '/client.html',
            controller:'vcAppCtrl'
        })
 
      
        .state('calendar', {
            url: '/calendar',
            templateUrl: '/html/calendar.html',
            controller:'calendarCtrl'
        })
 })