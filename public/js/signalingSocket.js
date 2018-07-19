// var encUrl = localStorage.getItem("encUrl");
// var encPswd = localStorage.getItem("encPswd");
// var decryptedUrl = CryptoJS.AES.decrypt(encUrl, "url");
// var decryptedPswd = CryptoJS.AES.decrypt(encPswd, "pswd");
// console.log("decryptedUrl: "+decryptedUrl.toString(CryptoJS.enc.Utf8));
// console.log("decryptedPswd: "+decryptedPswd.toString(CryptoJS.enc.Utf8));

// ];
var recordedURL; /* recoreurl storage variable */
var sesionEnc = localStorage.getItem("sessionEnc");
console.log("sesionEnc: " + sesionEnc);


/** CONFIG **/
console.log("Signaling Socket.js");
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
var txtQueryLink = null;

// signaling_socket = io(SIGNALING_SERVER);
var file;
var disconnPeerId = null;
var shareScreen = null;
var sessionHeader = null;
var peerStream = null;

signaling_socket = io(SIGNALING_SERVER);

var userName;
var USE_AUDIO = true;
var USE_VIDEO = true;
var DEFAULT_CHANNEL = "some-global-ch-name";
var MUTE_AUDIO_BY_DEFAULT = false;
var loginType = "admin";
if (localStorage.getItem("userData")) {
  console.log("User Name from session: " + localStorage.getItem("userData"));
  var userData = JSON.stringify(localStorage.getItem("userData"));
  userName = localStorage.getItem("userName");
  loginType = localStorage.getItem("loginType");

  console.log("userData: " + userData);
  console.log("userName: " + userName);
  console.log("loginType: " + loginType);
  if (loginType == "teacher" || loginType == "admin") {
    document.getElementById("userAuth").style.display = "none";
    // document.getElementById("appLogin").style.display = 'none';
    // document.getElementById("appReg").style.display = 'none';
    //document.getElementById("appLogout").style.display = "block";
    // document.getElementById("LoginUrl").style.display = "none";
    document.getElementById("videoConferenceUrl").style.display = "block";
    // document.getElementById("scheduleMeeting").style.display = "block";
    document.getElementById("videoConferenceLinkExtention").style.display =
      "block";
  } else if (loginType == "studParent") {
    document.getElementById("userAuth").style.display = "none";
    // document.getElementById("appLogin").style.display = 'none';
    // document.getElementById("appReg").style.display = 'none';
    //document.getElementById("appLogout").style.display = "none";
    // document.getElementById("LoginUrl").style.display = "none";
    document.getElementById("videoConferenceUrl").style.display = "none";
    // document.getElementById("scheduleMeeting").style.display = "block";
    document.getElementById("videoConferenceLinkExtention").style.display =
      "block";
  }
  if (loginType == "admin") {
    document.getElementById("userAuth").style.display = "block";
  }
} else {
  var url = window.location.href;
  var stuff = url.split("/");
  var id1 = stuff[stuff.length - 2];
  var id2 = stuff[stuff.length - 3];
  console.log("stuff.length: " + stuff.length);
  console.log("id1**: " + id1);
  console.log("id2**: " + id2);
  if (stuff.length > 5) {
    if (localStorage.getItem("userName")) {
      console.log(
        "User Name from session: " + localStorage.getItem("userName")
      );
      userName = localStorage.getItem("userName");
      // startVideoAction();
      document.getElementById("userAuth").style.display = "none";

      // document.getElementById("LoginUrl").style.display = "none";
      document.getElementById("videoConferenceUrl").style.display = "none";
      // document.getElementById("scheduleMeeting").style.display = "none";
      document.getElementById("videoConferenceLinkExtention").style.display =
        "block";
    } else {
      console.log("No user data from session");
      $("#setName").trigger("click");
      //    userName="logu";
      //     init();
    }
  }
}

function saveName() {
  console.log("setName-->");

  userName = document.getElementById("userName").value;
  pswd = document.getElementById("ppswd").value;
  var obj = {
    pswd: pswd,
    url: window.location.href
  };

  $.ajax({
    url: "https://norecruits.com/vc/parentCredential",
    //  url: "http://localhost:5000/vc/login4VC",
    type: "POST",
    data: JSON.stringify(obj),
    contentType: "application/json",
    dataType: "json",
    success: function (data) {
      var userData = {
        userName: userName,
        status: "instantActive",
        loginType: "parent"
      };
      console.log("data: " + JSON.stringify(data));
      if (data.message == "Login Successfully") {
        localStorage.setItem("userName", userName);
        localStorage.setItem("status", "instantActive");
        localStorage.setItem("loginType", "parent");
        document.getElementById("userAuth").style.display = "none";
        // document.getElementById("appLogin").style.display = "none";
        // document.getElementById("appReg").style.display = "none";
        //document.getElementById("appLogout").style.display = "none";
        // document.getElementById("LoginUrl").style.display = "none";
        document.getElementById("videoConferenceUrl").style.display = "none";
        // document.getElementById("scheduleMeeting").style.display = "none";
        document.getElementById("videoConferenceLinkExtention").style.display =
          "block";
      } else {
        console.log("Wrong credential");
        localStorage.setItem("userName", userName);
        localStorage.setItem("status", "instantActive");
        localStorage.setItem("loginType", "parent");
        document.getElementById("userAuth").style.display = "none";
        // document.getElementById("appLogin").style.display = "none";
        // document.getElementById("appReg").style.display = "none";
        //document.getElementById("appLogout").style.display = "none";
        // document.getElementById("LoginUrl").style.display = "none";
        document.getElementById("videoConferenceUrl").style.display = "none";
        // document.getElementById("scheduleMeeting").style.display = "none";
        document.getElementById("videoConferenceLinkExtention").style.display =
          "block";
        // $('#setName').trigger('click');
      }
    }
  });
  console.log("<--setName");
}

function emailInvite() {
  console.log("emailInvite-->");
  var email = document.getElementById("emailInvite").value;
  var URL = document.getElementById("linkToShare").innerHTML;
  console.log("email: " + email);
  console.log("URL: " + URL);
  var obj = {
    email: email,
    url: URL
  };
  $.ajax({
    url: "https://norecruits.com/vc/emailInvite",
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
    }
  });

  console.log("<--emailInvite");
}

/** You should probably use a different stun server doing commercial stuff **/
/** Also see: https://gist.github.com/zziuni/3741933 **/
// var ICE_SERVERS = [
//   { url: "stun:stun.l.google.com:19302" },
//   { url: "stun:s2.xirsys.com" },
//   {
//     url: "turn:s2.xirsys.com:80?transport=udp",
//     credential: "3ed63738-3ca0-11e8-bcf4-9ad4e61d3f22",
//     username: "3ed635ee-3ca0-11e8-a530-2288b20e5a3b"
//   },
//   {
//     url: "turn:s2.xirsys.com:3478?transport=udp",
//     credential: "3ed63738-3ca0-11e8-bcf4-9ad4e61d3f22",
//     username: "3ed635ee-3ca0-11e8-a530-2288b20e5a3b"
//   }, {
//     url: "turn:s2.xirsys.com:80?transport=tcp",
//     credential: "3ed63738-3ca0-11e8-bcf4-9ad4e61d3f22",
//     username: "3ed635ee-3ca0-11e8-a530-2288b20e5a3b"
//   }


// for(var x=0;x<sesionEnc.length;x++){
//   console.log("")
//   ICE_SERVERS[x]=sesionEnc[x];
// }
// var ICE_SERVERS = JSON.stringify(sesionEnc).slice();
// var ICE_SERVERS =sesionEnc.slice();
// console.log("ICE_SERVERS: "+JSON.stringify(ICE_SERVERS));

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

function disconnecSession() {
  console.log("disconnecSession-->");
  console.log("sessionHeader: " + sessionHeader);
  console.log("peerNew_id: " + peerNew_id);
  /* ### Start: Stop Local media stream ### */
  // var videoElem = document.getElementById('videoElem');
  // let stream = videoElem.srcObject;
  // let tracks = stream.getTracks();
  // tracks.forEach(function (track) {
  //   track.stop();
  // });
  // videoElem.srcObject = null;
  /* ### End: Stop Local media stream ### */
  localStorage.removeItem("careatorEmail");
  localStorage.removeItem("careatorFriendName");
  userName = null;
  console.log("streamArray.length: " + streamArray.length);
  if (sessionHeader == peerNew_id) {
    console.log("start to disconnect the session");
    signaling_socket.emit("disconnectSession", {
      deleteSessionId: queryLink,
      owner: peerNew_id
    });
  } else {
    console.log("You are not session creater so you cant delete session");
  }
  // if (streamArray.length >= 1) {
  //   console.log("stop rec");
  //   $('#stop-recording').trigger("click");
  // }

  console.log("-->disconnecSession");
}

function momVC() {
  console.log("momVC-->");
  var mom = document.getElementById("momtext").value;
  console.log("mom:" + mom);
  var eventId = localStorage.getItem("eventId");
  if (localStorage.getItem("teacherLoginId")) {
    var teacherLoginId = localStorage.getItem("teacherLoginId");
    console.log("teacherLoginId: " + teacherLoginId);
    var url = "https://norecruits.com/vc/updateEventMOM/" + eventId;
    var obj = {
      "mom": mom,
      "momCreatedBy": "teacher"
    };

    $.ajax({
      url: url,
      type: "POST",
      data: JSON.stringify(obj),
      contentType: "application/json",
      dataType: "json",
      success: function (data) {
        console.log("data: " + JSON.stringify(data));
        console.log("data.status: " + data.status);
        if (data.status) {
          //window.location.href = data.data.url;
        } else {
          alert("refresh your page and try again");
        }

      }
    });
  } else if (localStorage.getItem("studLoginId")) {
    var studLoginId = localStorage.getItem("studLoginId");
    console.log("studLoginId: " + studLoginId);
    var url = "https://norecruits.com/updateEventMOM/" + eventId;
    var obj = {
      "mom": mom,
      "momCreatedBy": "parent"
    };
    $.ajax({
      url: url,
      type: "POST",
      data: JSON.stringify(obj),
      contentType: "application/json",
      dataType: "json",
      success: function (data) {
        console.log("data: " + JSON.stringify(data));
        console.log("data.status: " + data.status);
        if (data.status) {
          //window.location.href = data.data.url;
        } else {
          alert("refresh your page and try again");
        }

      }
    });
  }
  disconnecSession();

  console.log("<--momVC");
}



function startSession(id, date) {
  console.log("startSession-->");
  var url = "https://norecruits.com/client/" + id + "/" + date;
  var obj = {
    "url": url
  };
  $.ajax({
    url: "https://norecruits.com/vc/sessionCreate",
    //  url: "http://localhost:5000/vc/login4VC",
    type: "POST",
    data: JSON.stringify(obj),
    contentType: "application/json",
    dataType: "json",
    success: function (data) {
      console.log("data: " + JSON.stringify(data));
      console.log("data.status: " + data.status);
      if (data.status) {
        //window.location.href = data.data.url;
      } else {
        alert("refresh your page and try again");
      }
    }
  });
  console.log(",--startSession");
}

// function init() {

//     console.log("init-->");

signaling_socket.on("connect", function () {
  console.log("signaling_socket connect-->");
  // console.log("1.1:peers: " + JSON.stringify(peers));
  // console.log("1.1:Connected to signaling server");

  if (disconnPeerId != null) {
    location.reload();
    disconnPeerId = null;
  }

  signaling_socket.on("message", function (config) {
    console.log("signaling_socket message-->");
    //console.log("Unique Peer Id: " + config.peer_id)
    queryLink = config.queryId;
    peerNew_id = config.peer_id;
    timeLink = config.time;
    var dt = new Date();
    var dy = dt.getDay().toString();
    var fy = dt.getFullYear().toString();
    var m = dt.getMonth().toString();
    var hr = dt.getHours().toString();

    var date = dy.concat(fy, m, hr);

    console.log("queryLink: " + queryLink);
    console.log("peerNew_id: " + peerNew_id);
    console.log("date: " + date);

    if (config.queryId == null) {
      console.log("query id is null");

      // $('#crdbuttn').trigger('click');
      console.log("message: config.peer_id: " + config.peer_id);

      //document.getElementById('videoConferenceUrl').setAttribute('href', "https://norecruits.com/client/" + peerNew_id + "/" + date);
      document.getElementById("videoConferenceUrl").setAttribute("onclick", "startSession('" + peerNew_id + "' , '" + date + "')");
      document.getElementById("linkToShare").setAttribute("href", "https://norecruits.com/client/" + peerNew_id + "/" + date);
      document.getElementById("linkToShare").innerHTML = "https://norecruits.com/client/" + peerNew_id + "/" + date;
    } else {
      console.log("query id nt null");

      document.getElementById("linkToShare").setAttribute("href", "https://norecruits.com/client/" + queryLink + "/" + date);
      document.getElementById("linkToShare").innerHTML = "https://norecruits.com/client/" + queryLink + "/" + date;
      document.getElementById("screenBtns").style.display = "inline";
      document.getElementById("videoConfStart").style.display = "none";
      document.getElementById("openChat").style.display = "inline";

      document.getElementById("audio_btn").style.display = "inline";
      document.getElementById("video_btn").style.display = "inline";
      document.getElementById("diconnect_btn").style.display = "inline";
      document.getElementById("videoConferenceLinkExtention").style.display = "inline";
      var loginType = localStorage.getItem("loginType");
      var userName = localStorage.getItem("userName");
      if (loginType == "teacher" || loginType == "admin") {
        document.getElementById("linkToShare").style.display = "block";
        document.getElementById("emailInvitation").style.display = "inline";
      }

      if (userName != undefined) {
        console.log("userName with localmedia setup call: " + userName);
        setup_local_media(function () {
          join__channel(DEFAULT_CHANNEL, {
            "whatever-you--here": "stuff"
          });
        });
      }

      document.getElementById("setNameId").addEventListener("click", function () {
        console.log("setup_local_media calling**");
        setup_local_media(function () {
          join__channel(DEFAULT_CHANNEL, {
            "whatever-you--here": "stuff"
          });
        });
      });

      document.getElementById("crdsubmit").addEventListener("click", function () {
        console.log("setup_local_media calling**");
        setup_local_media(function () {
          join__channel(DEFAULT_CHANNEL, {
            "whatever-you--here": "stuff"
          });
        });
      });
    }
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

  signaling_socket.emit("join", {
    channel: channel,
    userdata: userdata,
    owner: peerNew_id,
    queryLink: queryLink,
    timeLink: timeLink,
    userName: userName
  });

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
    // remote_media.attr("style", "border:5px solid gray");
    remote_media.attr("id", peer_id + "Remote");
    if (MUTE_AUDIO_BY_DEFAULT) {
      remote_media.attr("muted", "true");
    }
    // remote_media.attr("controls", "");

    remote_media.attr("name", config.userName);
    console.log("onaddstream: peer_id: " + peer_id);
    peer_media_elements[peer_id] = remote_media;

    remote_media.attr("id", peer_id + "Remote");
    // $('#portfolio-wrapper').append('<div id="' + peer_id + 'remoteContainer" class="col-xs-12 col-sm-6 col-md-4 col-lg-3 portfolio-items" ><div id="' + peer_id + 'remoteVideoElement"></div><div class="details"><button id="fullscreenbtn2" class="btn fa fa-expand" style="float:left;  margin-top: 10px; margin-left: 10px;"></button><h4>' + config.userName + '</h4><i style="display:none; float:right;color: #555555e3; margin-top: -15px; margin-right: 10px;" id="closeThisConn' + peer_id + '" class="fa fa-window-close cancelColrChange" aria-hidden="true" id="closeThisConn' + peer_id + '" owner=' + peer_id + ' name=' + config.userName + '></i><span>All is well</span></div></div>');
    // $('#' + peer_id + 'remoteVideoElement').append(remote_media);
    $("#portfolio-wrapper").append(
      '<div id="' +
      peer_id +
      'remoteContainer" class="portfolio-items col-xs-6 col-sm-6 col-md-4 col-lg-3" ><div id="' +
      peer_id +
      'remoteVideoElement"></div><div class="details"><button id="' +
      peer_id +
      'fullscreenbtn2" class="btn fa fa-expand" style="float:left;  margin-top: 10px; margin-left: 10px;"></button><h4>' +
      config.userName +
      '</h4><i style="display:none; float:right;color: #555555e3; margin-top: -15px; margin-right: 10px;" id="closeThisConn' +
      peer_id +
      '" class="fa fa-window-close cancelColrChange" aria-hidden="true" id="closeThisConn' +
      peer_id +
      '" owner=' +
      peer_id +
      " name=" +
      config.userName +
      "></i><span>All is well</span></div></div>"
    );
    $("#" + peer_id + "remoteVideoElement").append(remote_media);

    peer_userName_elements[peer_id] = document.getElementById(
      "" + peer_id + "remoteContainer"
    );

    if (peerNew_id == sessionHeader) {
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
      $("#" + peer_id + "remoteVideoElement").addClass("fullscr");
      $("#" + peer_id + "remoteContainer").removeClass(
        "portfolio-items col-xs-6 col-sm-6 col-md-4 col-lg-3"
      );
      $("#" + peer_id + "Remote").css({
        height: "100vh"
      });
      $
      $("#videoElem").css({
        height: "auto",
        width: "20%"
      });
      $("#videoElem111").removeClass(
        "portfolio-items col-xs-6 col-sm-6 col-md-4 col-lg-3"
      );
      $("#videosAttach").css({
        "z-index": "2",
        "position": "fixed"
      }

      );
      document.getElementById("header").style.display = "none";
      document.getElementById("btnrestore").style.display = "inline";
    });

    $("#btnrestore").click(function () {
      console.log("add id videoElem111");
      $("#" + peer_id + "remoteVideoElement").removeClass("fullscr");
      $("#" + peer_id + "remoteContainer").addClass(
        "portfolio-items col-xs-6 col-sm-6 col-md-4 col-lg-3"
      );
      $("#" + peer_id + "Remote").css({
        height: "auto"
      });
      $("#videosAttach").css({
        "z-index": "",
        "position": ""
      }

      );
      $("#videoElem").css({

        height: "",
        width: ""
      });
      $("#videoElem111").addClass(
        "portfolio-items col-xs-6 col-sm-6 col-md-4 col-lg-3"
      );
      document.getElementById("header").style.display = "inline";
      document.getElementById("btnrestore").style.display = "none";
    });
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
    document.getElementById("screenShareBtn").style.display = "inline";
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
            alert("Offer setLocalDescription failed!");
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
              signaling_socket.emit("relaySessionDescription", {
                peer_id: peer_id,
                session_description: local_description,
                from: "sessionDescription",
                owner: config.owner,
                queryLink: queryLink,
                timeLink: timeLink
              });
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
  var peer = peers[config.peer_id];
  var ice_candidate = config.ice_candidate;
  console.log("ice_candidate: " + ice_candidate);
  peer.addIceCandidate(new RTCIceCandidate(ice_candidate));
  console.log("<--iceCandidate");
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
    alert("Session creater removed you from conference");
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
    streamArray.push(stream);

    if (streamArray.length > 1) { /* ### Note: When more than 1 person join into conference timer will start  ### */
      // $('#start-recording').trigger("click");

      /* ##### Start: /////////// //Timer code///////////////////  #####*/
      var h1 = document.getElementsByTagName('h1')[0],
        start = document.getElementById('start'),
        stop = document.getElementById('stop'),
        clear = document.getElementById('clear'),
        seconds = 0, minutes = 0, hours = 0, t;
      function add() {
        seconds++;
        if (seconds >= 60) {
          seconds = 0;
          minutes++;
          if (minutes >= 60) {
            minutes = 0;
            hours++;
          }
        }
        h1.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
        timer();
      }

      function timer() {
        t = setTimeout(add, 1000);
      }
      timer();
      /* Start button */
      start.onclick = timer;
      /* Stop button */
      stop.onclick = function () {
        clearTimeout(t);
      }
      /* Clear button */
      clear.onclick = function () {
        h1.textContent = "00:00:00";
        seconds = 0;
        minutes = 0;
        hours = 0;
      }
      /* ##### End: /////////// //Timer code///////////////////  #####*/
    }
    console.log("<--attachMediaStream");
  };
  navigator.getUserMedia({ audio: USE_AUDIO, video: USE_VIDEO }, function (stream) {
    /* user accepted access to a/v */
    console.log("Access granted to audio/video");
    console.log("stream: " + stream);
    console.log("stream: " + JSON.stringify(stream));
    local_media_stream = stream;
    var local_media = USE_VIDEO ? $("<video>") : $();
    local_media.prop("muted", true); /* always mute ourselves by default */
    local_media.attr("id", "videoElem");
    local_media.attr("autoplay", "true");
    $("#portfolio-wrapper").append(
      '<div id="videoElem111" class="portfolio-items col-xs-6 col-sm-6 col-md-4 col-lg-3"><div id="videosAttach"></div><div class="details"><button id="fullscreenbtn" class="btn fa fa-expand" style="float:left; margin-top: 10px; margin-left: 10px;"></button><h4>' +
      userName +
      "</h4><span>All is well</span></div></div>"
    );
    $("#videosAttach").append(local_media);
    /* ### Start: Loader Start and Stop ### */
    $('#videoElem').on('loadstart', function (event) {
      $(this).addClass('background');
      $(this).attr("poster", "/img/Preloader_2.gif");
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

      console.log(
        "stream.getAudioTracks()[0].enabled: " +
        stream.getAudioTracks()[0].enabled
      );
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
      alert("You chose not to provide access to the camera/microphone, demo will not work.");
      if (errorback) errorback();
    }
  );

  document.getElementById("screenShareBtn").addEventListener("click", function () {
    console.log("screenShare-->");
    getScreenId(function (error, sourceId, screen_constraints) {
      navigator.getUserMedia(screen_constraints, function (stream) {
        navigator.getUserMedia({ audio: true }, function (audioStream) {
          stream.addTrack(audioStream.getAudioTracks()[0]);
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
          local_media_shareStream = stream;
          var local_mediaScreenShare = USE_VIDEO ?
            $("<video>") :
            $("<audio>");
          local_mediaScreenShare.prop("muted", true); /* always mute ourselves by default */
          local_mediaScreenShare.attr("id", "screenShareElem");
          local_mediaScreenShare.attr("autoplay", true);
          $("#videosAttach").append(local_mediaScreenShare);
          /* ### Start: Loader Start and Stop ### */
          $("#screenShareElem").on('loadstart', function (event) {
            $(this).addClass('background');
            $(this).attr("poster", "/img/Preloader_2.gif");
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
            /* ###### Start: Local media after stop screen share ###### */
            navigator.getUserMedia({ audio: USE_AUDIO, video: USE_VIDEO }, function (stream) {
              /* user accepted access to a/v */
              console.log("Access granted to audio/video");
              console.log("stream: " + stream);
              console.log("stream: " + JSON.stringify(stream));
              local_media_shareStream = null;
              local_media_stream = stream;
              var local_media = USE_VIDEO ? $("<video>") : $();
              local_media.prop("muted", true); /* always mute ourselves by default */
              local_media.attr("id", "videoElem");
              local_media.attr("autoplay", true);
              $("#videosAttach").append(local_media);
              /* ### Start: Loader Start and Stop ### */
              $("#videoElem").on('loadstart', function (event) {
                $(this).addClass('background');
                $(this).attr("poster", "/img/Preloader_2.gif");
              });
              $("#videoElem").on('canplay', function (event) {
                $(this).removeClass('background');
                $(this).removeAttr("poster");
              });
              /* ### End: Loader Start and Stop ### */
              attachMediaStream(local_media[0], stream);
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
              if (callback) callback();
            },
              function () {
                /* user denied access to a/v */
                console.log("Access denied for audio/video");
                alert("You chose not to provide access to the camera/microphone, Video will not work.");
                if (errorback) errorback();
              }
            );
            /* ###### End: Local media after stop screen share ###### */
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
          console.log("extension missing");
          $("#screenShareExtension").trigger("click");
          // var msg = "You Must Need to Install  Screen Share Extention, Click ok to install";
          // var newLine = "\r\n";
          // msg += newLine;
          // msg +=
          //   "Note:Please Refresh the browser After Installing Extention ";
          // if (window.confirm(msg)) {
          //   console.log("clicked on OK");
          //   window.open(
          //     "https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk?utm_source=chrome-app-launcher-info-dialog", "_blank"
          //   );
          // }
          // else {
          //   console.log("clicked on Cancel");
          // }
          // console.error(error);
          // if (errorback) errorback();
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
  $("#popupMsg").animate({scrollTop: $("#popupMsg").prop("scrollHeight")},500);
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


// Record>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
  navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(
    errorCallback);
}

var mediaConstraints = {
  audio: true,
  video: true
};

document.querySelector('#start-recording').onclick = function () {
  document.getElementById('start-recording').style.display = 'none';
  this.disabled = true;
  captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
};

document.querySelector('#stop-recording').onclick = function () {
  console.log("stop-recording-->");
  document.getElementById('stop-recording').style.display = 'none';
  this.disabled = true;
  multiStreamRecorder.stream.stop();
  multiStreamRecorder.stop();
  streamArray = [];
  // var obj = {
  //   "eventId": localStorage.getItem("eventId"),
  //   "base64data": "stop"
  // }
  // $.ajax({
  //   type: 'POST',
  //   url: "https://norecruits.com/record/recordVideo",
  //   data: JSON.stringify(obj),
  //   contentType: "application/json"
  //   //     dataType: "json",
  // }).done(function (data) {
  //   console.log(data);
  // });

  // 
  // document.querySelector('#pause-recording').disabled = true;
  document.querySelector('#start-recording').disabled = true;
  document.querySelector('#start-recording').style.display = 'none';
  // document.querySelector('#add-stream').disabled = true;

};

// document.querySelector('#pause-recording').onclick = function () {
//   this.disabled = true;
//   multiStreamRecorder.pause();
//   document.querySelector('#resume-recording').disabled = false;
// };

// document.querySelector('#resume-recording').onclick = function () {
//   this.disabled = true;
//   multiStreamRecorder.resume();
//   document.querySelector('#pause-recording').disabled = false;
// };

function storeRecordVideo() {
  console.log("storeRecordVideo-->");

  var reader = new FileReader();

  reader.readAsDataURL(recordedURL);
  reader.onloadend = function () {
    console.log("reader.result: " + JSON.stringify(reader.result));
    base64data = reader.result;
    console.log("base64data: " + base64data);
    var eventId = localStorage.getItem("eventId");
    console.log("eventId: " + eventId);
    var obj = {
      "eventId": eventId,
      "base64data": base64data
    }
    console.log("obj: " + JSON.stringify(obj));
    var fd = new FormData();
    //fd.append('fname', 'test.wav');
    fd.append('data', recordedURL);
    $.ajax({
      type: 'POST',
      url: "https://norecruits.com/record/recordVideo",
      data: JSON.stringify(obj),
      contentType: "application/json"
      //     dataType: "json",
    }).done(function (data) {
      console.log(data);
    });
  }
  //var resultedBlob = dataURItoBlob(recordedURL);
  //var resultedBlob = dataURItoBlob(recordedURL);

}

var multiStreamRecorder;
var audioVideoBlobs = {};
var recordingInterval = 0;

function onMediaSuccess(stream) {
  console.log("stream-->");
  var video = document.createElement('video');

  video = mergeProps(video, {
    controls: true,
    muted: false
  });
  video.srcObject = stream;

  video.addEventListener('loadedmetadata', function () {
    console.log("addEventListener('loadedmetadata')-->");
    if (multiStreamRecorder && multiStreamRecorder.stream) return;

    multiStreamRecorder = new MultiStreamRecorder(streamArray);
    multiStreamRecorder.stream = stream;
    multiStreamRecorder.previewStream = function (stream) {
      console.log("previewStream-->");
      video.src = URL.createObjectURL(stream);
      video.play();
    };

    multiStreamRecorder.ondataavailable = function (blob) {
      console.log("ondataavailable-->blob: " + JSON.stringify(blob));
      appendLink(blob);
    };
    var blobLinkTag = 0;

    function appendLink(blob) {
      console.log("appendLink-->");
      blobLinkTag++;
      console.log("blob.data: " + blob.data);
      console.log("blob.type: " + blob.type);
      console.log("blob.size: " + blob.size);
      var a = document.createElement('a');
      a.target = '_blank';
      a.innerHTML = 'Open Recorded ' + (blob.type == 'audio/ogg' ?
        'Audio' : 'Video') + ' No. ' + (index++) + ' (Size: ' +
        bytesToSize(blob.size) + ') Time Length: ' + getTimeLength(
          timeInterval);

      a.href = URL.createObjectURL(blob);
      recordedURL = blob;

      // if(blob.size>=1000-100)
      // {
      //   storeRecordVideo();
      // }

      // console.log("recordedURL: " + JSON.stringify());
      container.appendChild(a);
      container.appendChild(document.createElement('hr'));


      if (blobLinkTag % 2 != 0) {
        storeRecordVideo();
      }

    }

    // var timeInterval = document.querySelector('#time-interval').value;
    // if (timeInterval) timeInterval = parseInt(timeInterval);
    // else timeInterval = 5 * 1000;

    // 30*60*1000 =1800000
    // 40*60*1000
    // 60*60*1000
    //15*60*1000 = 900000
    //10*60*1000 = 600000
    // 3600000
    timeInterval = 600000;

    // get blob after specific time interval
    multiStreamRecorder.start();

    // document.querySelector('#add-stream').disabled = false;
    // document.querySelector('#add-stream').onclick = function () {
    //   if (!multiStreamRecorder || !multiStreamRecorder.stream) return;
    //   multiStreamRecorder.addStream(multiStreamRecorder.stream);
    // };
    document.querySelector('#stop-recording').style.display = 'inline';
    document.querySelector('#stop-recording').disabled = false;
    //document.querySelector('#pause-recording').disabled = false;
  }, false);

  video.play();

  // container.appendChild(video);
  // container.appendChild(document.createElement('hr'));
}

function onMediaError(e) {
  console.error('media error', e);
}

var container = document.getElementById('container');
var index = 1;

// below function via: http://goo.gl/B3ae8c
function bytesToSize(bytes) {
  var k = 1000;
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

// below function via: http://goo.gl/6QNDcI
function getTimeLength(milliseconds) {
  var data = new Date(milliseconds);
  return data.getUTCHours() + " hours, " + data.getUTCMinutes() + " minutes and " +
    data.getUTCSeconds() + " second(s)";
}

window.onbeforeunload = function () {
  document.querySelector('#start-recording').style.display = 'inline';
  document.querySelector('#start-recording').disabled = false;
};