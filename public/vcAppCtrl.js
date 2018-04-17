app.controller("vcAppCtrl", function(
  $scope,$rootScope,
  httpFactory,
  $window,
  $timeout,
  $state,
  $http
) {
  console.log("controller==>");

  $scope.vcLogout = function() {
    console.log("vcLogout");
    window.location = "https://vc4all.in/client";
    localStorage.removeItem("userData");
    localStorage.removeItem("userName");
    localStorage.removeItem("status");
    localStorage.removeItem("email");
    localStorage.removeItem("loginType");
    document.getElementById("appLogin").style.display = "block";
    document.getElementById("appLogout").style.display = "none";
    document.getElementById("videoConferenceUrl").style.display = "none";
    document.getElementById("scheduleMeeting").style.display = "none";
    document.getElementById("videoConferenceLinkExtention").style.display =
      "none";
  };

  $rootScope.TimeTable_timing = [
    {"startsAt":"09:00","endsAt":"09:45", "meridian":'AM'},
  {"startsAt":"9:45","endsAt":"10:30", "meridian":'AM'},
  {"startsAt":"10:30", "endsAt":"11:15", "meridian":'AM'},
  {"startsAt":"11:15","endsAt":"12:00", "meridian":'AM'},
  {"startsAt":"01:00", "endsAt":"01:45", "meridian":'PM'},
  {"startsAt":"01:45", "endsAt":"02:30", "meridian":'PM'},
  {"startsAt":"02:30","endsAt":"03:15", "meridian":'PM'},
  {"startsAt":"03:15", "endsAt":"04:00", "meridian":'PM'}]
});
