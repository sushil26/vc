app.controller("vcAppCtrl", function(
  $scope,
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
});
