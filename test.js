// var encUrl = localStorage.getItem("encUrl");
// var encPswd = localStorage.getItem("encPswd");
// var decryptedUrl = CryptoJS.AES.decrypt(encUrl, "url");
// var decryptedPswd = CryptoJS.AES.decrypt(encPswd, "pswd");
// console.log("decryptedUrl: "+decryptedUrl.toString(CryptoJS.enc.Utf8));
// console.log("decryptedPswd: "+decryptedPswd.toString(CryptoJS.enc.Utf8));

// ];
$('html, body').css('overflow-x', 'hidden');
var sesionEnc = localStorage.getItem("sessionEnc");
console.log("sesionEnc: " + sesionEnc);

/** CONFIG **/
console.log("Signaling Socket.js");
console.log("sessionUrlId: "+localStorage.getItem("sessionUrlId"));
var SIGNALING_SERVER = "https://norecruits.com";
//var SIGNALING_SERVER = "http://localhost:5000";
var streamArray = [];
var signaling_socket = null; /* our socket.io connection to our webserver */
var local_media_stream = null; /* our own microphone / webcam */
var local_media_shareStream = null;
var peers = {}; /* keep track of our peer connections, indexed by peer_id (aka socket.io id) */
var peer_media_elements = {};
peer_userName_elements = {};
var peer_media_sselements = {}; /* keep track of our <video>/<audio> tags, indexed by peer_id */
/* #### Logu Defined  ##### */
var peerNew_id = null;
var queryLink = null;
var timeLink = null;
var urlDate = null;
var txtQueryLink = null;
// signaling_socket = io(SIGNALING_SERVER);
var file;
var disconnPeerId = null;
var shareScreen = null;
var sessionHeader = null;
var sessionHeaderEmail = null;
var peerStream = null;
signaling_socket = io(SIGNALING_SERVER);
var userName;
var USE_AUDIO = true;
var USE_VIDEO = true;
var DEFAULT_CHANNEL = "some-global-ch-name";
var MUTE_AUDIO_BY_DEFAULT = false;
var sessionURL_fe;
var url = window.location.href;
var stuff = url.split("/");
var id1 = stuff[stuff.length - 2];
var id2 = stuff[stuff.length - 3];
console.log("stuff.length: " + stuff.length);
console.log("id1**: " + id1);
queryLink = id1;
queryTime = stuff[stuff.length - 1];
console.log("id2**: " + id2);

// $.browser.firefox = /firefox/.test(navigator.userAgent.toLowerCase());
// $.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());
// $.browser.safari = /safari/.test(navigator.userAgent.toLowerCase());
// $.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
// console.log("navigator.userAgent: "+navigator.userAgent);
// alert("navigator.userAgent: "+navigator.userAgent);
//  if (navigator.userAgent.search("Chrome") >= 0 || navigator.userAgent.search("Firefox") >= 0 || navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0 || navigator.userAgent.search("Opera") >= 0) {
//    console.log("Your in any one these browser: 1) Chrome, 2) Firefox, 3) Safari, 4) Opera");

  // console.log("localStorage.getItem(careatorEmail )" +localStorage.getItem("careatorEmail")+"localStorage.getItem(sessionPassword): "+localStorage.getItem("sessionPassword"));
  console.log("csigsocket_conf-->");
  if (stuff.length > 5) {
    console.log("1 cond");
    console.log("localStorage.getItem(careatorEmail): " + localStorage.getItem("careatorEmail"));
    console.log("localStorage.getItem(sessionPassword): " + localStorage.getItem("sessionPassword"));
    console.log("localStorage.getItem(careator_remoteEmail): " + localStorage.getItem("careator_remoteEmail"));
    console.log("localStorage.getItem(oneTimePassword): " + localStorage.getItem("oneTimePassword"));
    if (localStorage.getItem("careatorEmail") && localStorage.getItem("sessionPassword") && (localStorage.getItem("videoRights") == 'yes')) {
      console.log("Hoster session check");
      var password = localStorage.getItem("sessionPassword");
      var careatorEmail = localStorage.getItem("careatorEmail");
      var obj = {
        "password": password,
        "careatorEmail": careatorEmail,
        "sessionURL": window.location.href
      };
      console.log("obj: " + JSON.stringify(obj));
      var urlForSessionCheck;
      
      $.ajax({
        url: "https://norecruits.com/careator/pswdCheckForSesstion",
        type: "POST",
        data: JSON.stringify(obj),
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
          console.log("data: " + JSON.stringify(data));
          sessionHeaderEmail = careatorEmail;
          var userNameEmail = localStorage.getItem("careatorEmail");
          var emailIdSplit = userNameEmail.split('@');
          userName = emailIdSplit[0];
          //document.getElementById("videoConferenceUrl").style.display = "block";
          sessionURL_fe = obj.sessionURL;
          console.log("localStorage.getItem('sessionUrlId'): " + localStorage.getItem("sessionUrlId"));
          console.log("window.location.href: " + window.location.href);
          document.getElementById("videoCtrolBar").style.display = "inline";
          console.log("screen.width: " + screen.width);
          if (screen.width <= 768) {
            document.getElementById("screenShareBtn").style.display = 'none';
          }
          if (localStorage.getItem("sessionUrlId") == queryLink) {
            document.getElementById("emailInvitation").style.display = "block";
          } else {
            document.getElementById("emailInvitation").style.display = "none";
          }
          getChatBack();
        },
        error: function (err) {
          console.log("err: " + JSON.stringify(err));
          console.log("err.responseText: " + JSON.stringify(err.responseText));
          console.log("err.responseJSON: " + JSON.stringify(err.responseJSON.message));
          if (err.responseJSON.errorCode == "E0_URLE" || err.responseJSON.errorCode == "E0_alreadyInUse") {

            document.getElementById('notify_msg_content').innerHTML = err.responseJSON.message;
            document.getElementById('resetBtn').style.display = 'none';
            $("#notify_msg_button").trigger("click");
            setTimeout(function () {
              close();
            }, 3000);
          } else if (err.responseJSON.errorCode == "E1_credentialMismatch") {
            document.getElementById('notify_msg_content').innerHTML = err.responseJSON.message;
            document.getElementById('resetBtn').style.display = 'none';
            $("#notify_msg_button").trigger("click");
            userName = "";
            // localStorage.removeItem("careatorEmail");
            // localStorage.removeItem("sessionPassword");
            $("#setName").trigger("click");
          }

        }
      });

    } else if (localStorage.getItem("careator_remoteEmail") && localStorage.getItem("oneTimePassword")) {
      console.log("remote session check");
      var careator_remoteEmail = localStorage.getItem("careator_remoteEmail");
      var careator_remotePswd = localStorage.getItem("oneTimePassword");
      var checkObj = {
        "url": window.location.href,
        "careator_remoteEmail": careator_remoteEmail,
        "careator_remotePswd": careator_remotePswd
      }
           
      $.ajax({
        url: "https://norecruits.com/careator/RemoteJoinCheck",
        type: "POST",
        data: JSON.stringify(checkObj),
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
          console.log("data: " + JSON.stringify(data));
          userName = localStorage.getItem("careator_remoteEmail");
          careator_remoteEmail = true;
          //document.getElementById("videoConferenceUrl").style.display = "none";
          document.getElementById("emailInvitation").style.display = "none";
          document.getElementById("videoCtrolBar").style.display = "inline";
          if (screen.width <= 768) {
            document.getElementById("screenShareBtn").style.display = 'none';
          }
          getChatBack();
        },
        error: function (err) {
          console.log("err: " + JSON.stringify(err));
          console.log("err.responseText: " + JSON.stringify(err.responseText));
          console.log("err.responseJSON: " + JSON.stringify(err.responseJSON.message));
          //document.getElementById("videoConferenceUrl").style.display = "none";
          document.getElementById("emailInvitation").style.display = "none";
          userName = "";
          localStorage.removeItem("careatorEmail");
          localStorage.removeItem("careator_remoteEmail");
          localStorage.removeItem("oneTimePassword");
          $("#setName").trigger("click");
        }
      });
    } else {
      console.log("No user data from session");
      userName = "";
      getChatBack();
      $("#setName").trigger("click");

    }
    console.log("userName: " + userName);
  } else {
    window.location.href = "https://norecruits.com"
  }

  function triggerInvite() {
    console.log("triggerInvite-->");
    $("#enterPswd").trigger("click");
  }

  function triggerforLogin() {
    console.log("triggerforLogin-->");
    $("#notify_msg_show").modal('hide');
    $("#enterEmail").trigger("click");

  }

  function checkPassword() {
    console.log("checkPassword-->");
    var password = document.getElementById("ppswd").value;
    var careatorEmail = localStorage.getItem("careatorEmail");
    var obj = {
      "password": password,
      "careatorEmail": careatorEmail
    };
    console.log("obj: " + JSON.stringify(obj));
    if (password != "" && careatorEmail != "") {

      $.ajax({
        url: "https://norecruits.com/careator/pswdCheck",
        type: "POST",
        data: JSON.stringify(obj),
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
          $('#myEmailModal').modal('hide');
          console.log("data: " + JSON.stringify(data));
          localStorage.setItem("userName", data.data.name);
          localStorage.setItem("empId", data.data.empId);
          localStorage.setItem("email", data.data.email);
          localStorage.setItem("userId", data.data._id);
          localStorage.setItem("sessionPassword", password);
          localStorage.setItem("sessionRandomId", data.data.sessionRandomId);
          localStorage.setItem("sessionEnc", data.sessionData);
          userName = localStorage.getItem("userName");
          if (data.data.videoRights == 'yes') {
            localStorage.setItem("videoRights", 'yes');
            //document.getElementById("videoConfStart").style.display = "inline";
            $("#buttonpage").css({

            });
          }
          if (data.data.chatRights == 'yes') {
            localStorage.setItem("chatRights", 'yes');
            //document.getElementById("chatConfStart").style.display = "inline";
          }
          if (data.data.chatStatus) {
            localStorage.setItem("chatStatus", data.data.chatStatus);
          }
          if (data.data.restrictedTo) {
            console.log("data.data.restrictedTo: " + JSON.stringify(data.data.restrictedTo));
            var restrictedTo = data.data.restrictedTo;
            var restrictedArray = [];
            for (var x = 0; x < restrictedTo.length; x++) {
              restrictedArray.push(restrictedTo[x].userId);
            }

            console.log("restrictedArray: " + restrictedArray);
            localStorage.setItem("restrictedTo", restrictedArray);
          }
          if (data.data.profilePicPath) {
            localStorage.setItem("profilePicPath", data.data.profilePicPath);
          }
          var userNameEmail = localStorage.getItem("careatorEmail");
          var emailIdSplit = userNameEmail.split('@');
          //userName = emailIdSplit[0];
          console.log("userName: " + userName);
          //document.getElementById("videoConferenceUrl").style.display = "block";
          // $('#myPasswordModal').modal('hide');
          window.location.href = "https://norecruits.com/careatorApp/#!/dashboard/profile";
        },
        error: function (err) {
          console.log("err: " + JSON.stringify(err));
          console.log("err.responseText: " + JSON.stringify(err.responseText));
          console.log("err.responseJSON: " + JSON.stringify(err.responseJSON.message));
          document.getElementById("credentialErroe").innerHTML = err.responseJSON.message;
          document.getElementById("credentialErroe").style.display = 'inline';
          setTimeout(function () {
            $('#credentialErroe').fadeOut('fast');
          }, 3000);


          // document.getElementById("videoConferenceUrl").style.display = "none";
          localStorage.removeItem("careatorEmail");
          userName = "";
        }
      });
    } else {
      console.log("password trigger again-->");
      console.log("Password empty");

      // $("#enterPswd").trigger("click");
    }
    console.log("<--checkPassword");
  }

  function chatNavigation() {
    console.log("chatNavigation-->");
    window.location.href = "https://norecruits.com/careatorApp/#!/dashboard/chat";
  }

  /* ##### Start: Email Invite  ##### */
  function emailInviteSend() {
    console.log("emailInvite-->");
    var email = document.getElementById("emailInvite").value;
    var URL = document.getElementById("linkToShare").innerHTML;
    console.log("email: " + email);
    console.log("URL: " + URL);
    var obj = {
      sessionHost: localStorage.getItem("careatorEmail"),
      email: email,
      url: URL
    };
    console.log("obj: " + JSON.stringify("obj"));

    $.ajax({
      url: "https://norecruits.com/careator/emailInvite",
      //  url: "http://localhost:5000/vc/login4VC",
      type: "POST",
      data: JSON.stringify(obj),
      contentType: "application/json",
      dataType: "json",
      success: function (data) {
        var userData = {
          email: email,
          url: URL
        };
        console.log("data: " + JSON.stringify(data));
        document.getElementById("info").innerHTML = data.message;
        document.getElementById("info").style.display = 'inline';
        setTimeout(function () {
          $('#info').fadeOut('fast');
        }, 1000);
        setTimeout(function () {
          $('#invitePeople').modal('hide');
        }, 2000);
        // document.getElementById("info").innerHTML = data.message;
      },
      error: function (err) {
        console.log("err: " + JSON.stringify(err));
        console.log("err.responseText: " + JSON.stringify(err.responseText));
        console.log("err.responseJSON: " + JSON.stringify(err.responseJSON.message));
        // alert(err.responseJSON.message);
        $("#alertButton").trigger("click");
        document.getElementById('alertcontent').innerHTML = err.responseJSON.message;
      }
    });

    console.log("<--emailInvite");
  }
  /* ##### End: Email Invite  ##### */


  var ICE_SERVERS = [{
    url: "stun:stun.l.google.com:19302"
  },
  {
    url: "stun:s3.xirsys.com"
  },
  {
    url: "turn:s3.xirsys.com:80?transport=udp",
    credential: sesionEnc,
    username: "79ea5156-3e67-11e8-9a2e-41c3c9d814b5"

  }, {
    url: "turn:s3.xirsys.com:3478?transport=udp",
    credential: sesionEnc,
    username: "79ea5156-3e67-11e8-9a2e-41c3c9d814b5"

  }, {
    url: "turn:s3.xirsys.com:80?transport=tcp",
    credential: sesionEnc,
    username: "79ea5156-3e67-11e8-9a2e-41c3c9d814b5"

  }, {
    url: "turn:s3.xirsys.com:3478?transport=tcp",
    credential: sesionEnc,
    username: "79ea5156-3e67-11e8-9a2e-41c3c9d814b5"

  }, {
    url: "turns:s3.xirsys.com:443?transport=tcp",
    credential: sesionEnc,
    username: "79ea5156-3e67-11e8-9a2e-41c3c9d814b5"

  }, {
    url: "turns:s3.xirsys.com:5349?transport=tcp",
    credential: sesionEnc,
    username: "79ea5156-3e67-11e8-9a2e-41c3c9d814b5"
  }
  ];


  /* ##### Start: disconnectSessionReply from server(index.js)   ##### */
  signaling_socket.on("disconnectSessionReply", function (data) {
    console.log("disconnectSessionReply from server-->");
    if (queryLink == data.deleteSessionId && peerNew_id == data.owner) {
      console.log("Ready for redirect-->");
      // localStorage.setItem("redirctRequired", true);
      //alert("Sorry your link is not alive");
      document.getElementById("sessionDisconn_alert").style.display = 'inline';
      document.getElementById("sessionDisconn_alert").innerHTML = 'Your conference got disconnect, you no longer can use this session';

      setTimeout(function () {
        $('#sessionDisconn_alert').fadeOut('fast');
      }, 3000);
      setTimeout(function () {
        close();
      }, 5000);
      // close();
      //window.location.href = "https://norecruits.com";
    } else if (queryLink == data.deleteSessionId && peerNew_id != data.owner) {
      console.log("remote notification that host disconnect the session-->");
      document.getElementById("sessionDisconn_alert").style.display = 'inline';
      document.getElementById("sessionDisconn_alert").innerHTML = 'Your host disconnect the session, you no longer can use this session';

      setTimeout(function () {
        $('#sessionDisconn_alert').fadeOut('fast');
      }, 3000);
      setTimeout(function () {
        close();
      }, 4000);
      // localStorage.setItem("redirctRequired", true);
      // $("#homeLink").trigger("click");
      // window.location.href = "https://norecruits.com";
    }
  })
  /* ##### End: disconnectSessionReply from server(index.js)   ##### */
  function disconnecSession() {
    console.log("disconnecSession-->");
    console.log("sessionHeader: " + sessionHeader);
    console.log("peerNew_id: " + peerNew_id);

    if (localStorage.getItem("sessionUrlId") == queryLink && localStorage.getItem("careatorEmail")) {
      console.log("start to disconnect the session");
      localStorage.removeItem("sessionUrlId");
      signaling_socket.emit("disconnectSession", {
        deleteSessionId: queryLink,
        queryTime: queryTime,
        owner: peerNew_id,
        userId: localStorage.getItem("userId")
      });

      // window.location.href = "https://norecruits.com";
    } else {
      if (localStorage.getItem("careatorEmail")) {
        signaling_socket.emit("disconnectNotification", {
          "email": localStorage.getItem("careatorEmail"),
          "sessionURL": window.location.href
        })
      } else {
        signaling_socket.emit("disconnectNotification", {
          "email": localStorage.getItem("careator_remoteEmail"),
          "sessionURL": window.location.href
        })
      }
      //window.location.href = "https://norecruits.com";
    }
    // userName = null;
    console.log("-->disconnecSession");
  }

  function doRedirect() {
    console.log("doRedirect function -->");
    window.location.href = "https://norecruits.com"
  }
  signaling_socket.on("doRedirect", function (config) {
    console.log("doRedirect-->");

    doRedirect();
  })

  // function startSession(id, date) {
  //   console.log("startSession-->");
  //   urlDate = date;
  //   var url = "https://norecruits.com/careator/" + id + "/" + date;

  //   var obj = {
  //     "email": localStorage.getItem('careatorEmail'),
  //     "url": url
  //   }
  //   console.log("obj: " + JSON.stringify(obj));
  //   $.ajax({
  //     url: "https://norecruits.com/careator/setCollection",
  //     type: "POST",
  //     data: JSON.stringify(obj),
  //     contentType: "application/json",
  //     dataType: "json",
  //     success: function (data) {
  //       console.log("data: " + JSON.stringify(data));
  //       localStorage.setItem("sessionUrlId", id);
  //       window.location.href = "https://norecruits.com/careator/" + id + "/" + date;
  //     },
  //     error: function (err) {
  //       console.log("err: " + JSON.stringify(err));
  //       console.log("err.responseText: " + JSON.stringify(err.responseText));
  //       console.log("err.responseJSON: " + JSON.stringify(err.responseJSON.message));
  //     }
  //   });
  // }

  /* ### Note:Start Whenever page refresh get the chathistory respective to url  ### */
  function getChatBack() {
    console.log("addChatWindow-->");

    var obj = {
      "url": url
    }
    console.log("obj: " + JSON.stringify(obj));
    $.ajax({
      url: "https://norecruits.com/chatHistory/getChatByUrl",
      type: "POST",
      data: JSON.stringify(obj),
      contentType: "application/json",
      dataType: "json",
      success: function (data) {
        console.log("data: " + JSON.stringify(data));
        var chatData = data.data[0];
        console.log("chatData: " + JSON.stringify(chatData));
        for (var x = 0; x < chatData.chat.length; x++) {
          document.getElementById('message-container').innerHTML += '<div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">' +
            chatData.chat[x].userName + '</span></div><i class="direct-chat-img" aria-hidden="true"></i><!-- /.direct-chat-img --><div class="content direct-chat-text new_windowAutoLink">' + chatData.chat[x].message + '</div><div class="direct-chat-info clearfix"><span class="direct-chat-timestamp pull-right">' + chatData.chat[x].textTime + '</span></div>'
        }
      },
      error: function (err) {
        console.log("err: " + JSON.stringify(err));
        console.log("err.responseText: " + JSON.stringify(err.responseText));
        console.log("err.responseJSON: " + JSON.stringify(err.responseJSON.message));
      }
    });
  }

  /* ### Note:End Whenever page refresh get the chathistory respective to url  ### */

  signaling_socket.on("connect", function () {
    console.log("signaling_socket connect-->");
    if (disconnPeerId != null) {
      location.reload();
      disconnPeerId = null;
    }
    signaling_socket.on("message", function (config) {
      console.log("signaling_socket message-->");
      //console.log("Unique Peer Id: " + config.peer_id)
      //queryLink = config.queryId;
      peerNew_id = config.peer_id;
      timeLink = config.time;
      console.log("urlDate: " + urlDate + " timeLink: " + timeLink);
      var dt = new Date();
      var dy = dt.getDay().toString();
      var fy = dt.getFullYear().toString();
      var m = dt.getMonth().toString();
      var hr = dt.getHours().toString();
      var date = dy.concat(fy, m, hr);
      urlDate = date;
      console.log("queryLink: " + queryLink);
      console.log("peerNew_id: " + peerNew_id);
      console.log("date: " + date);
      // if (config.queryId == null) {
      //   console.log("query id is null");
      //   //document.getElementById("videoConfStart").setAttribute("onclick", "startSession('" + peerNew_id + "' , '" + date + "')");
      //   document.getElementById("linkToShare").setAttribute("href", "https://norecruits.com/careator_conf/" + peerNew_id + "/" + date);
      //   document.getElementById("linkToShare").innerHTML = "https://norecruits.com/careator_conf/" + peerNew_id + "/" + date;
      // } 
      // else {
      // console.log("query id nt null");
      console.log("config.isQueryIdAuthorized: " + config.isQueryIdAuthorized);
      if (config.isQueryIdAuthorized == 'yes') {
        document.getElementById("linkToShare").setAttribute("href", sessionURL_fe);
        document.getElementById("linkToShare").innerHTML = sessionURL_fe;
        document.getElementById("screenBtns").style.display = "inline";
        document.getElementById("homeLink").style.display = "inline";
        //document.getElementById("videoConfStart").style.display = "none";
        $("#buttonpage").css({


        });
        document.getElementById("openChat").style.display = "inline";
        document.getElementById("audio_btn").style.display = "inline";
        document.getElementById("video_btn").style.display = "inline";
        document.getElementById("diconnect_btn").style.display = "inline";
        document.getElementById("linkToShare").style.display = "block";
        console.log("userName: " + userName);
        if (userName != undefined && userName != "") {
          console.log("userName with localmedia setup call: " + userName);
          setup_local_media(function () {
            join__channel(DEFAULT_CHANNEL, {
              "whatever-you--here": "stuff"
            });
          });
        }
        document.getElementById("setNameId").addEventListener("click", function () {
          console.log("setup_local_media calling**");
          console.log("setName-->");
          var careator_remoteEmail = document.getElementById("remote_userName").value;
          var careator_remotePswd = document.getElementById("remote_password").value;
          var checkObj = {
            "url": window.location.href,
            "careator_remoteEmail": careator_remoteEmail,
            "careator_remotePswd": careator_remotePswd
          }
          $.ajax({
            url: "https://norecruits.com/careator/RemoteJoinCheck",
            type: "POST",
            data: JSON.stringify(checkObj),
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
              console.log("data: " + JSON.stringify(data));
              localStorage.removeItem("careatorEmail");
              localStorage.setItem("careator_remoteEmail", careator_remoteEmail);
              localStorage.setItem("sessionEnc", data.sessionData);
              var emailIdSplit = careator_remoteEmail.split('@');
              console.log("2 cond: emailIdSplit: " + JSON.stringify(emailIdSplit));
              userName = emailIdSplit[0];
              careator_remoteEmail = true;
              //document.getElementById("videoConferenceUrl").style.display = "none";
              document.getElementById("emailInvitation").style.display = "none";
              document.getElementById("videoCtrolBar").style.display = "inline";
              localStorage.setItem("oneTimePassword", careator_remotePswd);
              $('#remoteJoin').modal('hide');
              setup_local_media(function () {
                join__channel(DEFAULT_CHANNEL, {
                  "whatever-here": "stuff"
                });
              });
            },
            error: function (err) {
              console.log("err: " + JSON.stringify(err));
              console.log("err.responseText: " + JSON.stringify(err.responseText));
              console.log("err.responseJSON: " + JSON.stringify(err.responseJSON.message));
              //document.getElementById("videoConferenceUrl").style.display = "none";
              document.getElementById("emailInvitation").style.display = "none";
              userName = "";
              if (err.responseJSON.errorCode == "E0_URLE" || err.responseJSON.errorCode == "E0_alreadyInUse" || err.responseJSON.errorCode == "E1_credentialMismatch") {
                $('#remoteJoin').modal('hide');
                document.getElementById('notify_msg_content').innerHTML = err.responseJSON.message;
                document.getElementById('resetBtn').style.display = 'none';
                $("#notify_msg_button").trigger("click");
                setTimeout(function () {
                  close();
                }, 3000);
              }

            }
          });

        });
      } else {
        document.getElementById("setNameId").addEventListener("click", function () {
          console.log("setup_local_media calling**");
          console.log("setName-->");
          var careator_remoteEmail = document.getElementById("remote_userName").value;
          var careator_remotePswd = document.getElementById("remote_password").value;
          var checkObj = {
            "url": window.location.href,
            "careator_remoteEmail": careator_remoteEmail,
            "careator_remotePswd": careator_remotePswd
          }
          $.ajax({
            url: "https://norecruits.com/careator/RemoteJoinCheck",
            type: "POST",
            data: JSON.stringify(checkObj),
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
              console.log("data: " + JSON.stringify(data));
              localStorage.removeItem("careatorEmail");
              localStorage.setItem("careator_remoteEmail", careator_remoteEmail);
              localStorage.setItem("sessionEnc", data.sessionData);
              var emailIdSplit = careator_remoteEmail.split('@');
              console.log("2 cond: emailIdSplit: " + JSON.stringify(emailIdSplit));
              userName = emailIdSplit[0];
              careator_remoteEmail = true;
              //document.getElementById("videoConferenceUrl").style.display = "none";
              document.getElementById("emailInvitation").style.display = "none";
              document.getElementById("videoCtrolBar").style.display = "inline";
              if (screen.width <= 768) {
                document.getElementById("screenShareBtn").style.display = 'none';
              }

              localStorage.setItem("oneTimePassword", careator_remotePswd);
              $('#remoteJoin').modal('hide');
              setup_local_media(function () {
                join__channel(DEFAULT_CHANNEL, {
                  "whatever-here": "stuff"
                });
              });
            },
            error: function (err) {
              console.log("err: " + JSON.stringify(err));
              console.log("err.responseText: " + JSON.stringify(err.responseText));
              console.log("err.responseJSON: " + JSON.stringify(err.responseJSON.message));
              // document.getElementById("videoConferenceUrl").style.display = "none";
              document.getElementById("emailInvitation").style.display = "none";
              userName = "";
              if (err.responseJSON.errorCode == "E0_URLE" || err.responseJSON.errorCode == "E0_alreadyInUse" || err.responseJSON.errorCode == "E1_credentialMismatch") {

                $('#remoteJoin').modal('hide');
                document.getElementById('notify_msg_content').innerHTML = err.responseJSON.message;
                document.getElementById('resetBtn').style.display = 'none';
                $("#notify_msg_button").trigger("click");
                setTimeout(function () {
                  close();
                }, 3000);
              }
            }
          });

        });
        // $("#alertConfirmationButton").trigger("click");

        // setTimeout(function () {
        //   window.close();
        // }, 3000);
      }
      // }

      console.log("<--signaling_socket message");
    });
    console.log("<--signaling_socket connect");
  });

  signaling_socket.on("disconnect", function () {
    console.log("signaling_socket.on disconnect-->");
    disconnPeerId = peerNew_id;
    // document.getElementById(peerNew_id).remove();
    /* Tear down all of our peer connections and remove all the
     * media divs when we disconnect */

    for (peer_id in peer_media_elements) {
      peer_media_elements[peer_id].remove();
      peer_userName_elements[peer_id].remove();

      // peer_media_sselements[peer_id].remove();
    }
    for (peer_id in peers) {
      peers[peer_id].close();
    }

    peers = {};
    peer_media_elements = {};
    peer_userName_elements = {};

    // peer_media_sselements = {};
    console.log("<--signaling_socket.on disconnect");
  });

  function join__channel(channel, userdata) {
    console.log("join__channel-->");

    if (localStorage.getItem("careatorEmail")) {
      // signaling_socket.emit("disconnectNotification", {  })
      signaling_socket.emit("join", {
        "channel": channel,
        "userdata": userdata,
        "owner": peerNew_id,
        "queryLink": queryLink,
        "timeLink": timeLink,
        "userName": userName,
        "email": localStorage.getItem("careatorEmail"),
        "sessionURL": window.location.href
      });
    } else {
      signaling_socket.emit("join", {
        "channel": channel,
        "userdata": userdata,
        "owner": peerNew_id,
        "queryLink": queryLink,
        "timeLink": timeLink,
        "userName": userName,
        "email": localStorage.getItem("careator_remoteEmail"),
        "sessionURL": window.location.href
      });
    }



    console.log("<--join__channel");
  }

  function part__channel(channel) {
    console.log("part__channel-->");
    signaling_socket.emit("part", channel);
    console.log("<--part__channel");
  }

  /**
   * When we join a group, our signaling server will send out 'addPeer' events to each pair
   * of users in the group (creating a fully-connected graph of users, ie if there are 6 people
   * in the channel you will connect directly to the other 5, so there will be a total of 15
   * connections in the network).
   */
  signaling_socket.on("addPeer", function (config) {
    console.log("addPeer-->");
    console.log("addPeer 1: Signaling server said to add peer:", config);
    console.log("config: " + JSON.stringify(config));
    console.log("queryLink: " + queryLink);
    if (config.queryId == queryLink) {
      // console.log('Signaling server said to add peer:', JSON.stringify(config));
      var peer_id = config.peer_id;
      sessionHeader = config.sessionHeaderId;
      console.log("sessionHeader: " + sessionHeader);
      // console.log("addPeer 1.1: peers: " + JSON.stringify(peers));
      // console.log("addPeer 1.2: peer_id: " + peer_id);
      // console.log("addPeer : config.parentPeer: " + config.parentPeer);

      if (peer_id in peers) {
        /* This could happen if the user joins multiple channels where the other peer is also in. */
        console.log("addPeer 1.3: Already connected to peer ", peer_id);
        // return;
      }
      var peer_connection = new RTCPeerConnection({
        iceServers: ICE_SERVERS
      }, {
          optional: [{
            DtlsSrtpKeyAgreement: true
          }]
        }
        /* this will no longer be needed by chrome
         * eventually (supposedly), but is necessary 
         * for now to get firefox to talk to chrome */
      );
      console.log("peer_connection: " + peer_connection);
      // peer_connection.oniceconnectionstatechange = function (event) {
      //     console.log("#####peer_connection.oniceconnectionstatechange-->#####: " + peer_connection.oniceconnectionstatechange);
      //     console.log("event", event);
      //     var currentState = event.currentTarget.iceConnectionState;
      //     if (currentState == 'failed') {
      //         join_chat_channel(DEFAULT_CHANNEL, { 'whatever-you-want-here': 'stuff' });
      //     }
      // }
      peers[peer_id] = peer_connection;

      peer_connection.onicecandidate = function (event) {
        console.log("onicecandidate-->");
        if (event.candidate) {
          console.log("started to call server relayICECandidate--><--");
          signaling_socket.emit("relayICECandidate", {
            peer_id: peer_id,
            queryLink: queryLink,
            ice_candidate: {
              sdpMLineIndex: event.candidate.sdpMLineIndex,
              candidate: event.candidate.candidate
            }
          });
        }
        console.log("<--onicecandidate");
      };
      console.log("shareScreen != 'true'");

      peer_connection.onaddstream = function (event) {
        console.log("onaddstream-->");

        var existing = document.getElementById(peer_id + "remoteContainer");
        if (existing) {
          existing.parentNode.removeChild(existing);
        }
        var remote_media = USE_VIDEO ? $("<video>") : $();
        console.log("remote_media: " + remote_media);
        remote_media.attr("autoplay", "autoplay");
        remote_media.attr("id", peer_id + "Remote");
        if (MUTE_AUDIO_BY_DEFAULT) {
          remote_media.prop("muted", true);
        }
        remote_media.attr("name", config.userName);
        console.log("onaddstream: peer_id: " + peer_id);
        peer_media_elements[peer_id] = remote_media;
        remote_media.attr("id", peer_id + "Remote");
        $("#portfolio-wrapper").append(
          '<div id="' + peer_id + 'remoteContainer" class="portfolio-items col-xs-4 col-sm-4 col-md-4 col-lg-3" ><div id="' +
          peer_id + 'remoteVideoElement"></div><div class="details"><button id="' +
          peer_id + 'fullscreenbtn2" class="btn fa fa-expand" style="float:left;  margin-top: 10px; margin-left: 10px;margin-right: 10px;"></button><h4>' +
          config.userName + '</h4><i style="display:none; float:right;color: #555555e3; margin-top: -25px; margin-right: 10px;" id="closeThisConn' +
          peer_id + '" class="fa fa-window-close cancelColrChange" aria-hidden="true" id="closeThisConn' +
          peer_id + '" owner=' + peer_id + " name=" + config.userName + "></i> </div></div>");
        $("#" + peer_id + "remoteVideoElement").append(remote_media);
        peer_userName_elements[peer_id] = document.getElementById("" + peer_id + "remoteContainer");
        $("#" + peer_id + "Remote").on('loadstart', function (event) {
          $(this).addClass('background');
          $(this).attr("poster", "/img/loading.gif");
        });

        $("#" + peer_id + "Remote").on('canplay', function (event) {
          $(this).removeClass('background');
          $(this).removeAttr("poster");
        });
        // if (peerNew_id == sessionHeader) {
        if (localStorage.getItem("sessionUrlId") == queryLink && localStorage.getItem("careatorEmail")) {
          document.getElementById("closeThisConn" + peer_id).style.display =
            "inline";

          document.getElementById("closeThisConn" + peer_id).addEventListener("click", function () {
            var removableId = document
              .getElementById("closeThisConn" + peer_id)
              .getAttribute("owner");
            var removableName = document.getElementById("closeThisConn" + peer_id).getAttribute("name");
            signaling_socket.emit("closeThisConn", {
              removableId: removableId,
              removableName: removableName,
              controllerId: peerNew_id,
              queryLink: queryLink,
              timeLink: timeLink
            });
          });
        }

        var fullscreenbtn;
        vid = document.getElementById("videoElem");

        fullscreenbtn = document.getElementById("fullscreenbtn");
        fullscreenbtn.addEventListener("click", toggleFullScreen, false);

        function toggleFullScreen() {
          console.log();
          if (vid.requestFullScreen) {
            vid.requestFullScreen();
          } else if (vid.webkitRequestFullScreen) {
            vid.webkitRequestFullScreen();
          } else if (vid.mozRequestFullScreen) {
            vid.mozRequestFullScreen();
          }
        }

        $("#" + peer_id + "fullscreenbtn2").click(function () {
          console.log("sushil screen test");
          console.log("remove id videoElem111");
          $('html, body').css('overflow', 'hidden');
          $("#btnrestore").css({
            "display": "inline"
          })

          $("#videoElem111").removeClass(
            "portfolio-items col-xs-4 col-sm-4 col-md-4 col-lg-3"
          );
          $("#" + peer_id + "remoteContainer").removeClass(
            "portfolio-items col-xs-4 col-sm-4 col-md-4 col-lg-3"
          );

          $("#" + peer_id + "remoteVideoElement").addClass("fullscr");

          $("#portfolio .portfolio-items").css({
            "position": "absolute"
          })

          $("#" + peer_id + "Remote").css({
            height: "82vh"
          });

          $("video").css({
            border: "none"
          });
          $("#videoElem").css({
            height: "auto",
            width: "20%"
          });

          $("#videosAttach").css({
            "z-index": "4",
            "position": "fixed",
            "right": "35px",
            "bottom": "30px"
          }

          );
          // document.getElementById("someid").style.display = "none";
          // document.getElementById("btnrestore").style.display = "inline";
        });
        $("#btnrestore").click(function () {
          $("#" + peer_id + "remoteVideoElement").removeClass("fullscr");
          $('html, body').css('overflow-x', 'hidden');

          $("video").css({
            border: "5px solid white"
          });

          console.log("add id videoElem111");
          $("#videoElem111").addClass(
            "portfolio-items col-xs-4 col-sm-4 col-md-4 col-lg-3"
          );

          $("#" + peer_id + "remoteContainer").addClass(
            "portfolio-items col-xs-4 col-sm-4 col-md-4 col-lg-3"
          );
          $("#btnrestore").css({
            "display": "none"
          })

          $("#portfolio .portfolio-items").css({
            "position": "relative"
          })

          $("#" + peer_id + "Remote").css({
            height: ""
          });
          $
          $("#videoElem").css({
            height: "",
            width: ""
          });

          $("#videosAttach").css({
            "z-index": "",
            "position": "",
            "right": "",
            "bottom": ""
          })
        });
        // var fullscreenbtn2;
        // vid2 = document.getElementById(peer_id + "Remote");
        // fullscreenbtn2 = document.getElementById("fullscreenbtn2");
        // fullscreenbtn2.addEventListener("click", toggleFullScreen2, false);
        // function toggleFullScreen2() {
        //     if (vid2.requestFullScreen) {
        //         vid2.requestFullScreen();
        //     }
        //     else if (vid2.webkitRequestFullScreen) {
        //         vid2.webkitRequestFullScreen();
        //     }

        //     else if (vid2.mozRequestFullScreen) {
        //         vid2.mozRequestFullScreen();
        //     }

        // }
        var fullscreenbtn;
        vid3 = document.getElementById("screenShareElem");

        fullscreenbtn = document.getElementById("fullscreenbtn");
        fullscreenbtn.addEventListener("click", toggleFullScreen3, false);

        function toggleFullScreen3() {
          if (vid3.requestFullScreen) {
            vid3.requestFullScreen();
          } else if (vid3.webkitRequestFullScreen) {
            vid3.webkitRequestFullScreen();
          } else if (vid3.mozRequestFullScreen) {
            vid3.mozRequestFullScreen();
          }
        }

        // $('#videosAttach').append(remote_media);
        // var parentElement = document.getElementById('videosAttach');

        // var label = document.getElementById(peer_id + "RemoteUserName");
        // console.log(label);
        // if (label == null) {
        //     var label = document.createElement("Label");
        //     label.setAttribute("id", peer_id + "RemoteUserName");
        //     label.innerHTML = document.getElementById(peer_id + "Remote").getAttribute("name");
        //     parentElement.insertBefore(label, parentElement.children[2]);
        // }
        // else {
        //     label.innerHTML = document.getElementById(peer_id + "Remote").getAttribute("name");
        // }

        // peer_userName_elements[peer_id] = label;

        // var br = document.createElement("br");

        // parentElement.insertBefore(br,parentElement.children[2]);
        // $('#videosAttach').append(label);
        peerStream = event.stream;

        attachMediaStream(remote_media[0], event.stream);
        // attachMediaStream(remoteScreen_media[0], event.stream);
        console.log("<--X is NUll");
        console.log("<--onaddstream");
      };
      if (local_media_stream) {

        $("#screenShareBtn").css({
          "display": "inline"
        })

        document.getElementById("screenShareStop").style.display = "none";
        document.getElementById("video_btn").style.display = "inline";
        console.log("peer_connection.addStream(local_media_stream)-->");
        console.log("local_media_stream: " + local_media_stream);
        peer_connection.addStream(local_media_stream);
      }

      if (local_media_shareStream) {
        console.log("peer_connection.addStream(local_media_shareStream);-->");
        document.getElementById("screenShareBtn").style.display = "none";
        document.getElementById("screenShareStop").style.display = "inline";
        document.getElementById("video_btn").style.display = "none";

        peer_connection.addStream(local_media_shareStream);
      }

      /* Only one side of the peer connection should create the
       * offer, the signaling server picks one to be the offerer. 
       * The other user will get a 'sessionDescription' event and will
       * create an offer, then send back an answer 'sessionDescription' to us
       */
      if (config.should_create_offer) {
        console.log("Create offer-->");
        // console.log("creating offer from peer id: " + config.owner);
        // console.log("config: " + JSON.stringify(config));
        peer_connection.createOffer(
          function (local_description) {
            console.log("local_description-->");
            console.log("Local offer description is: ", local_description);
            peer_connection.setLocalDescription(
              local_description,
              function () {
                // console.log("local_description: " + JSON.stringify(local_description));
                signaling_socket.emit("relaySessionDescription", {
                  peer_id: peer_id,
                  session_description: local_description,
                  from: "addpeer",
                  owner: config.owner,
                  queryLink: queryLink,
                  timeLink: timeLink
                });
                console.log("Offer setLocalDescription succeeded");
              },
              function () {
                $("#alertButton").trigger("click");
                document.getElementById('alertcontent').innerHTML = "Offer setLocalDescription failed";
                // alert("Offer setLocalDescription failed!");
              }
            );
            console.log("<--local_description");
          },
          function (error) {
            console.log("Error sending offer: ", error);
          }, {
            iceRestart: true
          }
        );
        console.log("<--Create offer");
      }

      console.log("<--addPeer");
    } else {
      console.log("Sorry: Your queryId and query link totally different");
    }
  });

  /**
   * Peers exchange session descriptions which contains information
   * about their audio / video settings and that sort of stuff. First
   * the 'offerer' sends a description to the 'answerer' (with type
   * "offer"), then the answerer sends one back (with type "answer").
   */
  signaling_socket.on("sessionDescription", function (config) {
    console.log("sessionDescription-->");
    console.log("SD 1: Remote description received: ", config);
    console.log("config.peer_id: " + config.peer_id);
    var peer_id = config.peer_id;
    var peer = peers[peer_id];
    var remote_description = config.session_description;
    console.log("config.session_description: " + config.session_description);

    var desc = new RTCSessionDescription(remote_description);
    if (queryLink == config.queryId) {
      txtQueryLink = config.queryId;
      // document.getElementById('textChat').style.display = 'block';
      var stuff = peer.setRemoteDescription(
        desc,
        function () {
          console.log("setRemoteDescription succeeded");
          if (remote_description.type == "offer") {
            console.log("Creating answer");
            console.log("++++config.queryId: " + config.queryId);
            // console.log("++++config.peerIdForAuth: "+config.peerIdForAuth);

            peer.createAnswer(function (local_description) {
              console.log("Answer description is: ", local_description);
              console.log("local_description: " + local_description);
              peer.setLocalDescription(local_description, function () {
                console.log("**************Your Query Id from server and query link in the browser ");
                console.log("config.queryId: " + config.queryId);
                console.log("queryLink: " + queryLink);
                if (config.queryId == queryLink) {
                  signaling_socket.emit("relaySessionDescription", {
                    peer_id: peer_id,
                    session_description: local_description,
                    from: "sessionDescription",
                    owner: config.owner,
                    queryLink: queryLink,
                    timeLink: timeLink
                  });
                } else {
                  console.log("**************Your Query Id from server and query link in the browser link are different");
                  console.log("config.queryId: " + config.queryId);
                  console.log("queryLink: " + queryLink);
                }
                console.log("Answer setLocalDescription succeeded");
              },
                function () {
                  console.log("Answer setLocalDescription failed!");
                }
              );


            },
              function (error) {
                console.log("Error creating answer: ", error);
                console.log(peer);
              }
            );
          }
        },
        function (error) {
          console.log("setRemoteDescription error: ", error);
        }
      );
    } else {
      console.log("setRemoteDescription: sorry");
      console.log("queryLink: " + queryLink);
      console.log("config.queryId: " + config.queryId);
    }
    console.log("Description Object: ", desc);
    console.log("<--sessionDescription");
  });

  /**
   * The offerer will send a number of ICE Candidate blobs to the answerer so they
   * can begin trying to find the best path to one another on the net.
   */
  signaling_socket.on("iceCandidate", function (config) {
    console.log("iceCandidate-->");
    // console.log("iceCandidate: " + JSON.stringify(config));
    if (config.queryId == queryLink) {
      var peer = peers[config.peer_id];
      var ice_candidate = config.ice_candidate;
      console.log("ice_candidate: " + ice_candidate);
      peer.addIceCandidate(new RTCIceCandidate(ice_candidate));
      console.log("<--iceCandidate");
    } else {
      console.log("********************sorry we have diferent querId and querLink");
    }

  });

  /**
   * When a user leaves a channel (or is disconnected from the
   * signaling server) everyone will recieve a 'removePeer' message
   * telling them to trash the media channels they have open for those
   * that peer. If it was this client that left a channel, they'll also
   * receive the removePeers. If this client was disconnected, they
   * wont receive removePeers, but rather the
   * signaling_socket.on('disconnect') code will kick in and tear down
   * all the peer sessions.
   */
  signaling_socket.on("removePeer", function (config) {
    console.log("Signaling server said to remove peer:", config);
    var peer_id = config.peer_id;
    if (peer_id in peer_media_elements) {
      peer_media_elements[peer_id].remove();
      peer_userName_elements[peer_id].remove();
      // peer_media_sselements[peer_id].remove();
    }
    if (peer_id in peers) {
      peers[peer_id].close();
    }

    delete peers[peer_id];
    delete peer_media_elements[config.peer_id];
    //alert("Sorry your link is not alive");
    //close();
    //peer_userName_elements[peer_id].remove();
    // delete peer_media_sselements[config.peer_id];
  });


  /* Note: When video hoster want to remove perticular peer this functionality will work */
  signaling_socket.on("authorizedForClose", function (config) {
    console.log("authorizedForClose-->");

    if (queryLink == config.queryId) {
      console.log("queryLink,config.queryId are equal so to remove");

      var peer_id = config.removableId;
      if (peer_id in peer_media_elements) {
        peer_media_elements[peer_id].remove();
        peer_userName_elements[peer_id].remove();
        // peer_media_sselements[peer_id].remove();
      }
      if (peer_id in peers) {
        peers[peer_id].close();
      }

      delete peers[peer_id];
      delete peer_media_elements[config.peer_id];
      // peer_userName_elements[peer_id].remove();
    }
    console.log("config.removableId: " + config.removableId);
    console.log("peerNew_id: " + peerNew_id);
    if (config.removableId == peerNew_id) {
      console.log("Removable alert should start");

      // alert("Session creater removed you from conference");
      $("#alertButton").trigger("click");
      document.getElementById('alertcontent').innerHTML = "Session creater removed you from conference";
      window.location.href = "https://norecruits.com";
    }

    // delete peer_media_sselements[config.peer_id];
    console.log("<--authorizedForClose");
  });


  //     console.log("<--init");

  //     // <!--------video Controller-------->
  // }

  /***********************/
  /** Local media stuff **/
  /***********************/
  function setup_local_media(callback, errorback) {
    console.log("setup_local_media-->");

    if (local_media_stream != null) {
      /* ie, if we've already been initialized */
      if (callback) callback();
      return;
    }
    /* Ask user for permission to use the computers microphone and/or camera, 
     * attach it to an <audio> or <video> tag if they give us access. */
    console.log("Requesting access to local audio / video inputs");

    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    attachMediaStream = function (video, stream) {
      console.log("attachMediaStream-->");
      video.srcObject = stream;
      console.log("<--attachMediaStream");
    };
    $("#buttonpage").css({
      "min-height": "100vh"
    });
    navigator.getUserMedia({
      audio: USE_AUDIO,
      video: USE_VIDEO
    },
      function (stream) {
        /* user accepted access to a/v */
        console.log("Access granted to audio/video");
        console.log("stream: " + stream);
        console.log("stream: " + JSON.stringify(stream));

        local_media_stream = stream;
        var local_media = USE_VIDEO ? $("<video>") : $();
        local_media.prop("muted", true); /* always mute ourselves by default */
        local_media.attr("id", "videoElem");
        local_media.attr("autoplay", "true");
        // local_media.attr(
        //   "style",
        //   "border:1px solid skyblue;display:inline !important"
        // );

        $("#portfolio-wrapper").append(
          '<div id="videoElem111" class="portfolio-items col-xs-4 col-sm-4 col-md-4 col-lg-3"><div id="videosAttach"></div><div class="details"><button id="fullscreenbtn" class="btn fa fa-expand" style="float:left; margin-top: 10px; margin-left: 10px; margin-right: 10px;"></button><h4>' +
          userName +
          "</h4> </div></div>"
        );
        $("#videosAttach").append(local_media);
        /* ### Start: Loader Start and Stop ### */
        $('#videoElem').on('loadstart', function (event) {
          $(this).addClass('background');
          $(this).attr("poster", "/img/loading.gif");
        });
        $('#videoElem').on('canplay', function (event) {
          $(this).removeClass('background');
          $(this).removeAttr("poster");
        });
        /* ### End: Loader Start and Stop ### */

        /* ### Start: Video maximize and minimize ### */
        document.getElementById("videoElem").addEventListener("click", function () {
          console.log("screem size change request-->");
          var videoElem = document.getElementById("videoElem");
          var isFullScreen =
            videoElem.requestFullscreen ||
            videoElem.mozRequestFullScreen ||
            videoElem.webkitRequestFullscreen;
          console.log("isFullScreen: " + isFullScreen);
          if (isFullScreen) {
            console.log("SMall Screen");
            if (videoElem.requestFullscreen) {
              videoElem.requestFullscreen();
            } else if (videoElem.mozRequestFullScreen) {
              videoElem.mozRequestFullScreen();
            } else if (videoElem.webkitRequestFullscreen) {
              videoElem.webkitRequestFullscreen();
            }
          } else {
            console.log("Big Screen");
            if (videoElem.exitFullscreen) document.exitFullscreen();
            else if (videoElem.webkitExitFullscreen)
              videoElem.webkitExitFullscreen();
            else if (videoElem.mozCancelFullScreen)
              videoElem.mozCancelFullScreen();
            else if (videoElem.msExitFullscreen) videoElem.msExitFullscreen();
          }
        });
        /* ### End: Video maximize and minimize ### */

        /* ### Start: This for audio mute and unmute before SCREEN SHARE ### */
        document.getElementById("audio_btn").addEventListener("click", function () {
          console.log("audio_btn-->");
          console.log(
            "stream.getAudioTracks()[0].enabled: " +
            stream.getAudioTracks()[0].enabled
          );
          stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0]
            .enabled;
          var michrophoneVal = stream.getAudioTracks()[0].enabled;

          if (michrophoneVal) {
            document.getElementById("audioMute_btn").style.display = "inline";
            document.getElementById("audioUnmute_btn").style.display = "none";
          } else {
            document.getElementById("audioMute_btn").style.display = "none";
            document.getElementById("audioUnmute_btn").style.display = "inline";
          }
          console.log("stream.getAudioTracks()[0].enabled: " + stream.getAudioTracks()[0].enabled);
          console.log("<--audio_btn");
        });
        /* ### End: This for audio mute and unmute before SCREEN SHARE ### */

        /* ### Start: This for Video OFF and ON before SCREEN SHARE ### */
        document.getElementById("video_btn").addEventListener("click", function () {
          console.log("video_btn-->");
          console.log("stream.getVideoTracks()[0].enabled : " + stream.getVideoTracks()[0].enabled);
          stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0]
            .enabled;
          var videoVal = stream.getVideoTracks()[0].enabled;

          if (videoVal) {
            document.getElementById("videoMute_btn").style.display = "inline";
            document.getElementById("videoUnmute_btn").style.display = "none";
          } else {
            document.getElementById("videoMute_btn").style.display = "none";
            document.getElementById("videoUnmute_btn").style.display = "inline";
          }
          console.log("stream.getVideoTracks()[0].enabled: " + stream.getVideoTracks()[0].enabled);
          console.log("<--video_btn");
        });
        /* ### End: This for Video OFF and ON before SCREEN SHARE ### */

        attachMediaStream(local_media[0], stream);

        if (callback) callback();
      },
      function () {
        /* user denied access to a/v */
        console.log("Access denied for audio/video");
        // alert("You chose not to provide access to the camera/microphone, demo will not work.");
        $("#alertButton").trigger("click");
        document.getElementById('alertcontent').innerHTML = "You choose not to provide access to the camera/microphone, Video will not work";

        if (errorback) errorback();
      }
    );

    document.getElementById("screenShareBtn").addEventListener("click", function () {
      console.log("screenShare-->");
      getScreenId(function (error, sourceId, screen_constraints) {
        navigator.getUserMedia(screen_constraints, function (stream) {
          navigator.getUserMedia({
            audio: true
          }, function (audioStream) {
            stream.addTrack(audioStream.getAudioTracks()[0]);
            // shareScreen = peerNew_id;
            var local_media = document.getElementById("videoElem");
            stopVideo(local_media);

            function stopVideo(local_media) {
              let stream = videoElem.srcObject;
              let tracks = stream.getTracks();
              tracks.forEach(function (track) {
                track.stop();
              });
              videoElem.srcObject = null;
              delete this;
              $(this).remove();
              local_media_stream = null;
            }

            $("#videosAttach").empty();
            //local_media_stream = stream;
            local_media_shareStream = stream;
            var local_mediaScreenShare = USE_VIDEO ? $("<video>") : $("<audio>");
            local_mediaScreenShare.prop("muted", true); /* always mute ourselves by default */
            local_mediaScreenShare.attr("id", "screenShareElem");
            local_mediaScreenShare.attr("autoplay", "true");
            local_mediaScreenShare.attr("style", "border:1px solid skyblue");
            $("#videosAttach").append(local_mediaScreenShare);



            /* ### Start: This for audio mute and unmute before SCREEN SHARE ### */
            document.getElementById("audio_btn").addEventListener("click", function () {
              console.log("audio_btn-->");
              console.log(
                "stream.getAudioTracks()[0].enabled: " +
                stream.getAudioTracks()[0].enabled
              );
              stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0]
                .enabled;
              var michrophoneVal = stream.getAudioTracks()[0].enabled;

              if (michrophoneVal) {
                document.getElementById("audioMute_btn").style.display = "inline";
                document.getElementById("audioUnmute_btn").style.display = "none";
              } else {
                document.getElementById("audioMute_btn").style.display = "none";
                document.getElementById("audioUnmute_btn").style.display = "inline";
              }
              console.log("stream.getAudioTracks()[0].enabled: " + stream.getAudioTracks()[0].enabled);
              console.log("<--audio_btn");
            });
            /* ### End: This for audio mute and unmute before SCREEN SHARE ### */

            /* ### Start: Loader Start and Stop ### */
            $("#screenShareElem").on('loadstart', function (event) {
              $(this).addClass('background');
              $(this).attr("poster", "/img/loading.gif");
            });
            $("#screenShareElem").on('canplay', function (event) {
              $(this).removeClass('background');
              $(this).removeAttr("poster");
            });
            /* ### End: Loader Start and Stop ### */

            attachMediaStream(local_mediaScreenShare[0], stream);

            /* ##### Start Stop Sharing ##### */
            var btn = document.getElementById("screenShareStop");

            btn.onclick = function stopVideo(local_mediaScreenShare) {
              let stream = screenShareElem.srcObject;
              let tracks = stream.getTracks();

              tracks.forEach(function (track) {
                track.stop();
              });

              screenShareElem.srcObject = null;
              var existing = document.getElementById("screenShareElem");
              if (existing) {
                existing.parentNode.removeChild(existing);
              }
              $("#videosAttach").empty();

              /* ###### Start: Local media after stop screen share  ###### */
              navigator.getUserMedia({
                audio: USE_AUDIO,
                video: USE_VIDEO
              }, function (stream) {
                /* user accepted access to a/v */
                console.log("Access granted to audio/video");
                console.log("stream: " + stream);
                console.log("stream: " + JSON.stringify(stream));
                local_media_shareStream = null;
                local_media_stream = stream;
                // local_media_shareStream = stream;
                var local_media = USE_VIDEO ? $("<video>") : $();
                /* always mute ourselves by default */
                local_media.prop("muted", true);
                local_media.attr("id", "videoElem");
                local_media.attr("autoplay", true);
                local_media.attr("style", "border:1px solid skyblue");
                $("#videosAttach").append(local_media);

                /* ### Start: Loader Start and Stop ### */
                $("#videoElem").on('loadstart', function (event) {
                  $(this).addClass('background');
                  $(this).attr("poster", "/img/loading.gif");
                });
                $("#videoElem").on('canplay', function (event) {
                  $(this).removeClass('background');
                  $(this).removeAttr("poster");
                });
                /* ### End: Loader Start and Stop ### */

                /* ### Start: This for audio mute and unmute after SCREEN SHARE ### */
                document.getElementById("audio_btn").addEventListener("click", function () {
                  console.log("audio_btn from stop screen local start-->");
                  console.log(
                    "stream.getAudioTracks()[0].enabled: " +
                    stream.getAudioTracks()[0].enabled
                  );
                  stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0]
                    .enabled;
                  var michrophoneVal = stream.getAudioTracks()[0].enabled;

                  if (michrophoneVal) {
                    document.getElementById("audioMute_btn").style.display = "inline";
                    document.getElementById("audioUnmute_btn").style.display = "none";
                  } else {
                    document.getElementById("audioMute_btn").style.display = "none";
                    document.getElementById("audioUnmute_btn").style.display = "inline";
                  }
                  console.log("stream.getAudioTracks()[0].enabled: " + stream.getAudioTracks()[0].enabled);
                  console.log("<--audio_btn from stop screen local start");
                });
                /* ### End: This for audio mute and unmute after SCREEN SHARE ### */
                /* ### Start: This for video ON and OFF after SCREEN SHARE ### */
                document.getElementById("video_btn").addEventListener("click", function () {
                  console.log("video_btn from stop screen local start-->");
                  console.log("stream.getVideoTracks()[0].enabled : " + stream.getVideoTracks()[0].enabled);
                  stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0]
                    .enabled;
                  var videoVal = stream.getVideoTracks()[0].enabled;

                  if (videoVal) {
                    document.getElementById("videoMute_btn").style.display = "inline";
                    document.getElementById("videoUnmute_btn").style.display = "none";
                  } else {
                    document.getElementById("videoMute_btn").style.display = "none";
                    document.getElementById("videoUnmute_btn").style.display = "inline";
                  }
                  console.log("stream.getVideoTracks()[0].enabled: " + stream.getVideoTracks()[0].enabled);
                  console.log("<--video_btn from stop screen local start-");
                });
                /* ### End: This for video ON and OFF after SCREEN SHARE ### */

                attachMediaStream(local_media[0], stream);

                if (callback) callback();
              },
                function () {
                  /* user denied access to a/v */
                  console.log("Access denied for audio/video");
                  $("#alertButton").trigger("click");
                  document.getElementById('alertcontent').innerHTML = "You chose not to provide access to the camera/microphone, Video will not work";
                  // alert(
                  //   "You chose not to provide access to the camera/microphone, Video will not work."
                  // );
                  if (errorback) errorback();
                }
              );
              /* ###### End: Local media after stop screen share  ###### */
            };
            /* ##### End Stop Sharing ##### */

            if (callback) callback();
          },
            function (error) {
              console.error(error);
              if (errorback) errorback();
            }
          );
        },
          function (error) {
            var msg =
              "You Must Need to Install  Screen Share Extention, Click ok to install";
            var newLine = "\r\n";
            msg += newLine;
            msg +=
              "Note:Please Refresh the browser After Installing Extention ";
            if (window.confirm(msg)) {
              console.log("new tab opening");
              window.open(
                "https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk?utm_source=chrome-app-launcher-info-dialog", '_blank'
              );
            }
            //    alert("You Must Need to Install This Screen Share Extention https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk?utm_source=chrome-app-launcher-info-dialog ");
            console.error(error);
            if (errorback) errorback();
          }
        );
      });
    });

    console.log("<--setup_local_media");
  }

  signaling_socket.on("stateChangedToClient", function (data) {
    console.log("newstateChangedToClientTextMsg-->");
    console.log("data.userId: " + data.userId);
    console.log("peerNew_id: " + peerNew_id);
    if (data.userId == peerNew_id) {
      window.location.reload(true);
    }
    console.log("<--newstateChangedToClientTextMsg");
  });

  function scrollDown() {
    console.log("scrollDown-->");
    $("#popupMsg").animate({
      scrollTop: $("#popupMsg").prop("scrollHeight")
    },
      500
    );
    console.log("<--scrollDown");
  }

  // getScreenId.js
  // <script src="https://cdn.WebRTC-Experiment.com/getScreenId.js"></script>

  (function () {
    window.getScreenId = function (callback) {
      // for Firefox:
      // sourceId == 'firefox'
      // screen_constraints = {...}
      if (!!navigator.mozGetUserMedia) {
        callback(null, "firefox", {
          video: {
            mozMediaSource: "window",
            mediaSource: "window"
          }
        });
        return;
      }

      window.addEventListener("message", onIFrameCallback);

      function onIFrameCallback(event) {
        if (!event.data) return;

        if (event.data.chromeMediaSourceId) {
          if (event.data.chromeMediaSourceId === "PermissionDeniedError") {
            callback("permission-denied");
          } else {
            callback(
              null,
              event.data.chromeMediaSourceId,
              getScreenConstraints(null, event.data.chromeMediaSourceId)
            );
          }

          // this event listener is no more needed
          window.removeEventListener("message", onIFrameCallback);
        }

        if (event.data.chromeExtensionStatus) {
          callback(
            event.data.chromeExtensionStatus,
            null,
            getScreenConstraints(event.data.chromeExtensionStatus)
          );

          // this event listener is no more needed
          window.removeEventListener("message", onIFrameCallback);
        }
      }

      setTimeout(postGetSourceIdMessage, 100);
    };

    function getScreenConstraints(error, sourceId) {
      var screen_constraints = {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: error ? "screen" : "desktop",
            maxWidth: window.screen.width > 1920 ? window.screen.width : 1920,
            maxHeight: window.screen.height > 1080 ? window.screen.height : 1080
          },
          optional: []
        }
      };

      if (sourceId) {
        screen_constraints.video.mandatory.chromeMediaSourceId = sourceId;
      }

      return screen_constraints;
    }

    function postGetSourceIdMessage() {
      if (!iframe) {
        loadIFrame(postGetSourceIdMessage);
        return;
      }

      if (!iframe.isLoaded) {
        setTimeout(postGetSourceIdMessage, 100);
        return;
      }

      iframe.contentWindow.postMessage({
        captureSourceId: true
      },
        "*"
      );
    }

    var iframe;

    // this function is used in RTCMultiConnection v3
    window.getScreenConstraints = function (callback) {
      loadIFrame(function () {
        getScreenId(function (error, sourceId, screen_constraints) {
          if (!screen_constraints) {
            screen_constraints = {
              video: true
            };
          }

          callback(error, screen_constraints.video);
        });
      });
    };

    function loadIFrame(loadCallback) {
      if (iframe) {
        loadCallback();
        return;
      }

      iframe = document.createElement("iframe");
      iframe.onload = function () {
        iframe.isLoaded = true;

        loadCallback();
      };
      iframe.src = "https://www.webrtc-experiment.com/getSourceId/"; // https://wwww.yourdomain.com/getScreenId.html
      iframe.style.display = "none";
      (document.body || document.documentElement).appendChild(iframe);
    }

    window.getChromeExtensionStatus = function (callback) {
      // for Firefox:
      if (!!navigator.mozGetUserMedia) {
        callback("installed-enabled");
        return;
      }

      window.addEventListener("message", onIFrameCallback);

      function onIFrameCallback(event) {
        if (!event.data) return;

        if (event.data.chromeExtensionStatus) {
          callback(event.data.chromeExtensionStatus);

          // this event listener is no more needed
          window.removeEventListener("message", onIFrameCallback);
        }
      }

      setTimeout(postGetChromeExtensionStatusMessage, 100);
    };

    function postGetChromeExtensionStatusMessage() {
      if (!iframe) {
        loadIFrame(postGetChromeExtensionStatusMessage);
        return;
      }

      if (!iframe.isLoaded) {
        setTimeout(postGetChromeExtensionStatusMessage, 100);
        return;
      }

      iframe.contentWindow.postMessage({
        getChromeExtensionStatus: true
      },
        "*"
      );
    }
  })();
  // Header fixed and Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $(".back-to-top").fadeIn("slow");
      $("#header").addClass("header-fixed");
    } else {
      $(".back-to-top").fadeOut("slow");
      $("#header").removeClass("header-fixed");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({
      scrollTop: 0
    }, 1500, "easeInOutExpo");
    return false;
  });
  ///////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////
  signaling_socket.on('comm_logoutNotifyToUserById', function (data) {
    console.log("***comm_logoutNotifyToUserById-->: " + JSON.stringify(data));
    console.log("localStorage.getItem(careatorEmail): " + localStorage.getItem("careatorEmail"));
    console.log(" localStorage.getItem(sessionUrlId): " + localStorage.getItem("sessionUrlId"));
    console.log(" url: " + url);
    if (data.email == localStorage.getItem("careatorEmail") || data.email == localStorage.getItem("careator_remoteEmail")) {
      console.log("Start to remove the session");
      // localStorage.removeItem("email");
      // localStorage.removeItem("userName");
      // localStorage.removeItem("empId");
      // localStorage.removeItem("userId");
      // localStorage.removeItem("restrictedTo");
      // localStorage.removeItem("chatStatus");
      // localStorage.removeItem("profilePicPath");
      // if (localStorage.getItem("chatRights")) {
      //   localStorage.removeItem("chatRights");
      // }
      // if (localStorage.getItem("videoRights")) {
      //   localStorage.removeItem("videoRights");
      // }
      // if (localStorage.getItem("sessionUrlId") == queryLink && localStorage.getItem("careatorEmail")) {
      //   console.log("start to disconnect the session");
      //   localStorage.removeItem("careatorEmail");
      //   localStorage.removeItem("sessionUrlId");
      //   localStorage.removeItem("careator_remoteEmail");
      //   localStorage.removeItem("sessionPassword")
      // } else {
      //   localStorage.removeItem("careatorEmail");
      //   localStorage.removeItem("sessionUrlId");
      //   localStorage.removeItem("careator_remoteEmail");
      //   localStorage.removeItem("oneTimePassword");
      //   console.log("You are not session creater so you cant delete session");
      // }

      disconnecSession();
      //window.location.href = "https://norecruits.com";
    }
    if (data.sessionURL == url) {
      console.log("Start to remove the session based on sessionURL");
      localStorage.removeItem("sessionUrlId");
      // signaling_socket.emit("disconnectSession", {
      //   deleteSessionId: queryLink,
      //   owner: peerNew_id
      // });
      close();

    }

    // if(localStorage.getItem("careatorEmail")==null || localStorage.getItem("careator_remoteEmail")==null){
    //   disconnecSession();
    // }

  })
  // var widthSize = window.matchMedia('(max-width: 500px)').matches;
  // console.log("widthSize: "+widthSize); 
  // if (widthSize) {
  //   console.log("<<<<<<<screenShareBtn icon hide>>>>>>>");
  //   $("#screenShareBtn").css({
  //     "display": "none"
  //   })
  // }
  // else{

  // }


// }
// else {
//   console.log("Your in none of these browser: 1) Chrome, 2) Firefox, 3) Safari, 4) Opera");
//   alert("Please open this link in chrome/firefox/safari/opera");
// }
