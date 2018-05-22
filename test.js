/** CONFIG **/
console.log("Signaling Socket.js");
var SIGNALING_SERVER = "https://vc4all.in";
//var SIGNALING_SERVER = "http://localhost:5000";
//var SIGNALING_SERVER = "https://svcapp.herokuapp.com";
// var SIGNALING_SERVER = "https://logchat.herokuapp.com";
var userName = null;
var USE_AUDIO = true;
var USE_VIDEO = true;
var DEFAULT_CHANNEL = 'some-global-ch-name';
var MUTE_AUDIO_BY_DEFAULT = false;


var videoReaderRecord = new FileReader();

if (localStorage.getItem("userData")) {
    console.log("User Name from session: " + localStorage.getItem("userData"));
    var userData = JSON.stringify(localStorage.getItem("userData"));
    userName = localStorage.getItem("userName");
    console.log("userData: " + userData);
    console.log("userName: " + userName);
    document.getElementById("appLogin").style.display = 'none';
    document.getElementById("appLogout").style.display = 'block';
    document.getElementById("videoConferenceUrl").style.display = 'block';
    document.getElementById("scheduleMeeting").style.display = 'block';
    document.getElementById("videoConferenceLinkExtention").style.display = 'block';
    init();

}
else {

    var url = window.location.href;
    var stuff = url.split('/');
    var id1 = stuff[stuff.length - 2];
    var id2 = stuff[stuff.length - 3];
    console.log("stuff.length: "+stuff.length);
    console.log("id1**: "+id1);
    console.log("id2**: "+id2);
    if(stuff.length>5){
        if (localStorage.getItem("userName")) {
            console.log("User Name from session: " + localStorage.getItem("userName"));
            userName = localStorage.getItem("userName");
            init();
    
        }
        else {
            console.log("No user data from session");
            $('#setName').trigger('click');
        }

    }


   
}

function saveName() {
    console.log("setName-->");

    userName = document.getElementById('userName').value;
    pswd = document.getElementById('P_pswd').value;
    var obj = {
        "pswd": pswd,
        "url": window.location.href
    }

    $.ajax({
        url: "https://vc4all.in/vc/parentCredential",
        //url: "http://localhost:5000/vc/login4VC",
        type: "POST",
        data: JSON.stringify(obj),
        contentType: "application/json",
        dataType: 'json',
        success: function (data) {
            // callback(data);

            var userData = {
                "userName": userName,
            }


            console.log("data: " + JSON.stringify(data));
            if (data.message == 'Login Successfully') {
                console.log("login authorized");
                localStorage.setItem("userData", userData);
                localStorage.setItem("userName", userName);
                init();

            }
            else if (data.message == 'Password is not matching') {

                console.log("Password is not matching");
                alert("Password is not matching");
                $('#setName').trigger('click');

            }
            else if ('URL is not authorized') {
                console.log("URL is not authorized");
                alert("URL is not authorized");
                window.location.href = "https://vc4all.in";

            }

        }

    })


    console.log("<--setName");

}


function logVC() {
    console.log("logVC from signalingSocket.js");
    console.log("email: " + document.getElementById("crdEmail").value);
    var email = document.getElementById("crdEmail").value;
    var Password = document.getElementById('crdPswd').value;
    console.log("email: " + email);
    var obj = {
        "email": email,
        "password": Password
    };
    console.log("obj: " + JSON.stringify(obj));
    // var obj = {"data":"test"}

    console.log("logVC");



    $.ajax({
        url: "https://vc4all.in/vc/login4VC",
        //url: "http://localhost:5000/vc/login4VC",
        type: "POST",
        data: JSON.stringify(obj),
        contentType: "application/json",
        dataType: 'json',
        success: function (data) {
            // callback(data);

            console.log("data: " + JSON.stringify(data));
            if (data.message == 'Profile Inactive') {
                alert("Your Profile is inactive, inform your system admin to verify it");
            }
            else if (data.message == 'Login Successfully') {
                alert("Logged in Successfull");
                sessionSet(data);
                document.getElementById("appLogin").style.display = 'none';
                document.getElementById("appLogout").style.display = 'block';
                document.getElementById("videoConferenceUrl").style.display = 'block';
                document.getElementById("scheduleMeeting").style.display = 'block';
                document.getElementById("videoConferenceLinkExtention").style.display = 'block';
                init();
            }
            else if (data.message == 'Password is wrong') {
                alert("Password is wrong");
            }
            else if (data.errorCode == 'No Match') {
                alert("There is no match for this EMail id from student database ");
            }

            if(data.loginType=='admin'){
                window.location.href="https://vc4all.in/mainPage#!/userAuth";
            }
        }

    })

}

function sessionSet(data) {
    if (typeof (Storage) !== "undefined") {
        // Store
        var userData = {
            "userName": data.data.userName,
            "status": data.data.status,
            "email": data.data.email,
            "loginType": data.loginType
        }
        localStorage.setItem("userData", userData);
        localStorage.setItem("userName", data.data.userName);
        localStorage.setItem("status", data.data.status);
        localStorage.setItem("email", data.data.email);
        localStorage.setItem("loginType", data.loginType);
        localStorage.setItem("id", data.data._id);
        // Retrieve
        var info = localStorage.getItem("userData");
        // alert("info: " + info);
        userName = info.userName;
        // document.getElementById("result").innerHTML = localStorage.getItem("lastname");
    } else {
        alert("Sorry, your browser does not support Web Storage...");

    }
}

function vcLogout() {
    console.log("vcLogout");
    window.location = "https://vc4all.in/client";
    localStorage.removeItem("userData");
    localStorage.removeItem("userName");
    localStorage.removeItem("status");
    localStorage.removeItem("email");
    document.getElementById("appLogin").style.display = 'block';
    document.getElementById("appLogout").style.display = 'none';
    document.getElementById("videoConferenceUrl").style.display = 'none';
    document.getElementById("scheduleMeeting").style.display = 'none';
    document.getElementById("videoConferenceLinkExtention").style.display = 'none';
}

function regVc() {
    console.log("regVc");
    var un = document.getElementById("regVC_un").value;
    var emId = document.getElementById("regVC_emailId").value;
    var pswd = document.getElementById("regVC_pswd").value;

    var obj = {
        "userName": un,
        "email": emId,
        "password": pswd
    };
    $.ajax({
        url: "https://vc4all.in/vc/register4VC",
        //url: "http://localhost:5000/vc/register4VC",
        type: "POST",
        data: JSON.stringify(obj),
        contentType: "application/json",
        dataType: 'json',
        success: function (data) {
            // callback(data);

            console.log("data: " + JSON.stringify(data));
            if (data.message == 'Failed to Register' || data.message == 'empty value found') {
                alert("Failed to register try again");
            }
            else if (data.message == 'Registeration Successfull') {
                alert("Registeration Successfull");


            }


        }

    })


}

// var MicGainController = function(){function a(a){this.gain=1;var b=this.context=new AudioContext;this.microphone=b.createMediaStreamSource(a),this.gainFilter=b.createGain(),this.destination=b.createMediaStreamDestination(),this.originalStream=a,this.outputStream=this.destination.stream,this.microphone.connect(this.gainFilter),this.gainFilter.connect(this.destination)}return a.prototype.setGain=function(a){this.gainFilter.gain.value=a,this.gain=a},a.prototype.getGain=function(){return this.gain},a.prototype.off=function(){return this.setGain(0)},a.prototype.on=function(){this.setGain(1)},a};
var gainControllerVar, microphoneStream;

/** You should probably use a different stun server doing commercial stuff **/
/** Also see: https://gist.github.com/zziuni/3741933 **/
var ICE_SERVERS = [
    { url: "stun:stun.l.google.com:19302" }
];

var signaling_socket = null;   /* our socket.io connection to our webserver */
var local_media_stream = null; /* our own microphone / webcam */
var local_media_shareStream = null;
var peers = {};                /* keep track of our peer connections, indexed by peer_id (aka socket.io id) */
var peer_media_elements = {};
peer_userName_elements = {};
var peer_media_sselements = {};  /* keep track of our <video>/<audio> tags, indexed by peer_id */
/* #### Logu Defined  ##### */
var peerNew_id = null;
var queryLink = null;
var timeLink = null;
var txtQueryLink = null;

signaling_socket = io(SIGNALING_SERVER);
var file;
var disconnPeerId = null;
var shareScreen = null;
var sessionHeader = null;
var peerStream = null;



// function setNameBtn() {
//     console.log("setName-->");

//     userName = document.getElementById('userName').value;
//     /* ie, if we've already been initialized */
//     return userName;
//     //signaling_socket.emit('userNameDetail', { 'userId': peerNew_id, 'queryLink': queryLink, 'userName': userName });
//     console.log("<--setName");

// }

// function schedMeet() {
//     // window.location = "https://logchat.herokuapp.com/schedMeet";
//     window.location = "https://vc4all.in/schedMeet";

// }

/* ### Start login Submit   ### */
// function crdcheck() {
//     console.log("crdcheck-->");
//     var uname = document.getElementById('crname').value;
//     var upass = document.getElementById('crpass').value;
//     if (uname == 'admin' && upass == 'admin123') {
//         console.log("Password Matched");
//         document.getElementById('videoConfStart').enabled = true;
//     }
//     else {
//         console.log("Password Not Matched");
//         document.getElementById('videoConfStart').disabled = true;
//         // window.location = "https://logchat.herokuapp.com/client";
//         window.location = "http://localhost:8080";

//     }

// }
/* ### End login Submit   ### */

/* ### Start Register Button Click  ### */
function register() {
    console.log("register-->");
    $('#registerVcBtn').trigger('click');


}
/* ### End Register Button Click ### */


function disconnecSession() {
    console.log("disconnecSession-->");
    console.log("sessionHeader: " + sessionHeader);
    console.log("peerNew_id: " + peerNew_id);
    if (sessionHeader == peerNew_id) {
        console.log("start to disconnect the session");
        signaling_socket.emit('disconnectSession', { 'deleteSessionId': queryLink, 'owner': peerNew_id });
    }
    else {
        console.log("You are not session creater so you cant delete session");
    }

    console.log("-->disconnecSession");
}



function init() {




    console.log("init-->");

    signaling_socket = io(SIGNALING_SERVER);


    // $('#setNameId').trigger('click');

    // document.getElementById("screenShareBtn").addEventListener("click", function () {

    signaling_socket.on('connect', function () {
        console.log("signaling_socket connect-->");
        // console.log("1.1:peers: " + JSON.stringify(peers));
        // console.log("1.1:Connected to signaling server");
        if (disconnPeerId != null) {
            location.reload();
            disconnPeerId = null;
        }

        signaling_socket.on('message', function (config) {
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




            if (config.queryId == null) {
                console.log("query id is null");

                // $('#crdbuttn').trigger('click');
                console.log("message: config.peer_id: " + config.peer_id);
                document.getElementById('videoConferenceUrl').setAttribute('href', "https://vc4all.in/client/" + peerNew_id + "/" + date);
                // document.getElementById('linkToShare').innerHTML += "https://vc4all.in/client/" + peerNew_id + "/" + date;
                // document.getElementById('linkToShare').setAttribute('href', "https://vc4all.in/client/" + peerNew_id + "/" + date);

                // }
                // else {
                //     console.log("query id nt null");
                //     document.getElementById('linkToShare').innerHTML += "https://svcapp.herokuapp.com/client/" + config.queryId;
                //     document.getElementById('linkToShare').setAttribute('href', "https://svcapp.herokuapp.com/client/" + config.queryId);


                //

                // document.getElementById('linkToShare').innerHTML += "https://logchat.herokuapp.com/client/" + peerNew_id;
                // document.getElementById('videoConferenceUrl').setAttribute('href', "https://logchat.herokuapp.com/client/" + peerNew_id);
                // document.getElementById('linkToShare').setAttribute('href', "https://logchat.herokuapp.com/client/" + peerNew_id);
                // document.getElementById('linkToShare').innerHTML += "http://localhost:8080/client/" + peerNew_id;
                // document.getElementById('videoConferenceUrl').setAttribute('href', "http://localhost:8080/client/" + peerNew_id);
                // document.getElementById('linkToShare').setAttribute('href', "http://localhost:8080/client/" + peerNew_id);



            }
            else {
                console.log("query id nt null");
                // document.getElementById('linkToShare').innerHTML += "https://vc4all.in/client" + config.queryId + "/" + config.time;
                // document.getElementById('linkToShare').setAttribute('href', "https://vc4all.in/client/" + config.queryId + "/" + config.time);





                // }
                // else {
                //     console.log("query id nt null");
                // document.getElementById('linkToShare').innerHTML += "http://localhost:8080/client/" + config.queryId;
                // document.getElementById('linkToShare').setAttribute('href', "http://localhost:8080/client/" + config.queryId);



                // document.getElementById('feedback').style.display = 'inline';
                // document.getElementById('fdb').style.display = 'inline';
                // document.getElementById('usercontectdtl').style.display = 'inline';

                document.getElementById('screenBtns').style.display = 'inline';
                document.getElementById('videoConfStart').style.display = 'none';
                document.getElementById('openChat').style.display = 'inline';

                document.getElementById('audio_btn').style.display = 'inline';
                document.getElementById('diconnect_btn').style.display = 'inline';
                document.getElementById('videoConferenceLinkExtention').style.display = 'inline';

                console.log("bretrigger");
                /* ##### Start trigger click for setName automatically  ##### */
                // $('#setName').trigger('click');
                /* ##### End trigger click for setName automatically  ##### */

                console.log("Start CallBack");



                // $('#myModal').modal('hide');
                setup_local_media(function () {
                    //     /* once the user has given us access to their
                    //      * microphone/camcorder, join the channel and start peering up */


                    join__channel(DEFAULT_CHANNEL, { 'whatever-you--here': 'stuff' });

                })










            }

            console.log("<--signaling_socket message");

        })


        console.log("<--signaling_socket connect");


    });





    signaling_socket.on('disconnect', function () {
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
        peer_userName_elements = {}
        // peer_media_sselements = {};
        console.log("<--signaling_socket.on disconnect");
    });
    function join__channel(channel, userdata) {
        console.log("join__channel-->");
        // console.log("channel: " + channel);
        // console.log("userdata: " + JSON.stringify(userdata));
        // document.p.innerHTML = channel;
        // document.getElementById("demo").innerHTML = channel;

        signaling_socket.emit('join', { "channel": channel, "userdata": userdata, 'owner': peerNew_id, 'queryLink': queryLink, 'timeLink': timeLink, 'userName': userName });

        console.log("<--join__channel");
    }
    function part__channel(channel) {
        console.log("part__channel-->");
        signaling_socket.emit('part', channel);
        console.log("<--part__channel");
    }




    /** 
    * When we join a group, our signaling server will send out 'addPeer' events to each pair
    * of users in the group (creating a fully-connected graph of users, ie if there are 6 people
    * in the channel you will connect directly to the other 5, so there will be a total of 15 
    * connections in the network). 
    */
    signaling_socket.on('addPeer', function (config) {
        console.log("addPeer-->");
        console.log('addPeer 1: Signaling server said to add peer:', config);
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
        var peer_connection = new RTCPeerConnection(
            { "iceServers": ICE_SERVERS },
            { "optional": [{ "DtlsSrtpKeyAgreement": true }] } /* this will no longer be needed by chrome
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
            console.log("onicecandidate-->")
            if (event.candidate) {

                console.log("started to call server relayICECandidate--><--")
                signaling_socket.emit('relayICECandidate', {
                    'peer_id': peer_id,
                    'ice_candidate': {
                        'sdpMLineIndex': event.candidate.sdpMLineIndex,
                        'candidate': event.candidate.candidate
                    }
                });
            }
            console.log("<--onicecandidate")
        }
        console.log("shareScreen != 'true'");

        peer_connection.onaddstream = function (event) {
            console.log("onaddstream-->")


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
            remote_media.attr("controls", "");

            remote_media.attr("name", config.userName);
            console.log("onaddstream: peer_id: " + peer_id);
            peer_media_elements[peer_id] = remote_media;


            remote_media.attr("id", peer_id + "Remote");
            $('#portfolio-wrapper').append('<div id="' + peer_id + 'remoteContainer" class="col-xs-12 col-sm-6 col-md-4 col-lg-3 portfolio-items" ><div id="' + peer_id + 'remoteVideoElement"></div><div class="details"><button id="fullscreenbtn2" class="btn fa fa-expand" style="float:left;  margin-top: 10px; margin-left: 10px;"></button><h4>' + config.userName + '</h4><i style="display:none; float:right;color: #555555e3; margin-top: -15px; margin-right: 10px;" id="closeThisConn' + peer_id + '" class="fa fa-window-close cancelColrChange" aria-hidden="true" id="closeThisConn' + peer_id + '" owner=' + peer_id + ' name=' + config.userName + '></i><span>All is well</span></div></div>');
            $('#' + peer_id + 'remoteVideoElement').append(remote_media);

            peer_userName_elements[peer_id] = document.getElementById('' + peer_id + 'remoteContainer');

            if (peerNew_id == sessionHeader) {
                document.getElementById("closeThisConn" + peer_id).style.display = 'inline';

                document.getElementById("closeThisConn" + peer_id).addEventListener("click", function () {
                    var removableId = document.getElementById("closeThisConn" + peer_id).getAttribute('owner');
                    var removableName = document.getElementById("closeThisConn" + peer_id).getAttribute('name');

                    signaling_socket.emit('closeThisConn', { "removableId": removableId, "removableName": removableName, "controllerId": peerNew_id, "queryLink": queryLink, 'timeLink': timeLink });
                })
            }


            var fullscreenbtn;
            vid = document.getElementById("videoElem");


            fullscreenbtn = document.getElementById("fullscreenbtn");
            fullscreenbtn.addEventListener("click", toggleFullScreen, false);
            function toggleFullScreen() {
                if (vid.requestFullScreen) {
                    vid.requestFullScreen();
                }
                else if (vid.webkitRequestFullScreen) {
                    vid.webkitRequestFullScreen();
                }

                else if (vid.mozRequestFullScreen) {
                    vid.mozRequestFullScreen();
                }

            }
            var fullscreenbtn2;
            vid2 = document.getElementById(peer_id + "Remote");


            fullscreenbtn2 = document.getElementById("fullscreenbtn2");
            fullscreenbtn2.addEventListener("click", toggleFullScreen2, false);
            function toggleFullScreen2() {
                if (vid2.requestFullScreen) {
                    vid2.requestFullScreen();
                }
                else if (vid2.webkitRequestFullScreen) {
                    vid2.webkitRequestFullScreen();
                }

                else if (vid2.mozRequestFullScreen) {
                    vid2.mozRequestFullScreen();
                }

            }
            var fullscreenbtn;
            vid3 = document.getElementById("screenShareElem");


            fullscreenbtn = document.getElementById("fullscreenbtn");
            fullscreenbtn.addEventListener("click", toggleFullScreen3, false);
            function toggleFullScreen3() {
                if (vid3.requestFullScreen) {
                    vid3.requestFullScreen();
                }
                else if (vid3.webkitRequestFullScreen) {
                    vid3.webkitRequestFullScreen();
                }

                else if (vid3.mozRequestFullScreen) {
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
        }


        if (local_media_stream) {
            document.getElementById('screenShareBtn').style.display = 'inline';
            document.getElementById('screenShareStop').style.display = 'none';
            console.log("peer_connection.addStream(local_media_stream)-->");
            console.log("local_media_stream: " + local_media_stream);
            peer_connection.addStream(local_media_stream);
        }


        if (local_media_shareStream) {
            console.log("peer_connection.addStream(local_media_shareStream);-->");
            document.getElementById('screenShareBtn').style.display = 'none';
            document.getElementById('screenShareStop').style.display = 'inline';
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
                    peer_connection.setLocalDescription(local_description,
                        function () {
                            // console.log("local_description: " + JSON.stringify(local_description));
                            signaling_socket.emit('relaySessionDescription',
                                { 'peer_id': peer_id, 'session_description': local_description, 'from': "addpeer", 'owner': config.owner, 'queryLink': queryLink, 'timeLink': timeLink });
                            console.log("Offer setLocalDescription succeeded");
                        },
                        function () { alert("Offer setLocalDescription failed!"); }
                    );
                    console.log("<--local_description");
                },
                function (error) {
                    console.log("Error sending offer: ", error);
                }, { iceRestart: true });
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
    signaling_socket.on('sessionDescription', function (config) {
        console.log("sessionDescription-->");
        console.log('SD 1: Remote description received: ', config);
        console.log("config.peer_id: " + config.peer_id);
        var peer_id = config.peer_id;
        var peer = peers[peer_id];
        var remote_description = config.session_description;
        console.log("config.session_description: " + config.session_description);

        var desc = new RTCSessionDescription(remote_description);
        if (queryLink == config.queryId) {
            txtQueryLink = config.queryId;
            // document.getElementById('textChat').style.display = 'block';
            var stuff = peer.setRemoteDescription(desc,
                function () {
                    console.log("setRemoteDescription succeeded");
                    if (remote_description.type == "offer") {
                        console.log("Creating answer");
                        console.log("++++config.queryId: " + config.queryId);
                        // console.log("++++config.peerIdForAuth: "+config.peerIdForAuth);



                        peer.createAnswer(
                            function (local_description) {
                                console.log("Answer description is: ", local_description);
                                console.log("local_description: " + local_description);
                                peer.setLocalDescription(local_description,
                                    function () {
                                        signaling_socket.emit('relaySessionDescription',
                                            { 'peer_id': peer_id, 'session_description': local_description, 'from': "sessionDescription", 'owner': config.owner, 'queryLink': queryLink, 'timeLink': timeLink });
                                        console.log("Answer setLocalDescription succeeded");
                                    },
                                    function () { console.log("Answer setLocalDescription failed!"); }
                                );
                            },
                            function (error) {
                                console.log("Error creating answer: ", error);
                                console.log(peer);
                            });




                    }

                },
                function (error) {
                    console.log("setRemoteDescription error: ", error);
                }
            );
        }
        else {
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
    signaling_socket.on('iceCandidate', function (config) {
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
    signaling_socket.on('removePeer', function (config) {
        console.log('Signaling server said to remove peer:', config);
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
    signaling_socket.on('authorizedForClose', function (config) {
        console.log('authorizedForClose-->');

        if (queryLink == config.queryId) {
            console.log('queryLink,config.queryId are equal so to remove');

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
            window.location.href = "https://vc4all.in";
        }

        // delete peer_media_sselements[config.peer_id];
        console.log('<--authorizedForClose');
    });





    console.log("<--init");

    // <!--------video Controller-------->



}

function appendFile_record(URI) {
    console.log("appendFile_record-->");
    console.log("URI: " + URI);
    // console.log("type: " + type);


    var xhrReq = new XMLHttpRequest();
    xhrReq.open("GET", "/htmlTemplate/videoRecord.html", true);
    xhrReq.onreadystatechange = function () {
        if (xhrReq.readyState === 4) {
            if (xhrReq.status === 0) {
                document.getElementById('recordedVideos').innerHTML += '<video width="320" height="240" controls src="' + URI + '"></video>';
            }
        }
    }
    xhrReq.send(null);

    document.getElementById('downloadVideo').innerHTML = '<a href="/htmlTemplate/videoRecord.html" download="videoRecord" target="_blank">Download Conference</a>';



    // document.getElementById('downloadVideo').innerHTML = '<a width="320" height="240" href=' + URI + ' target="_blank" download=' + URI + '><source src="' + URI + '">Download Here</a>';
    // console.log(" document.getElementById('downloadVideo').innerHTML: "+ document.getElementById('downloadVideo').innerHTML);

    console.log("<--appendFile_record");
}


/***********************/
/** Local media stuff **/
/***********************/
function setup_local_media(callback, errorback) {

    console.log("setup_local_media-->");





    if (local_media_stream != null) {  /* ie, if we've already been initialized */
        if (callback) callback();
        return;
    }
    /* Ask user for permission to use the computers microphone and/or camera, 
     * attach it to an <audio> or <video> tag if they give us access. */
    console.log("Requesting access to local audio / video inputs");


    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    attachMediaStream = function (element, stream) {
        console.log("attachMediaStream-->");
        // console.log('DEPRECATED, attachMediaStream  will soon be removed.');
        element.srcObject = stream;
        console.log("<--attachMediaStream");
    };



    navigator.getUserMedia({ "audio": USE_AUDIO, "video": USE_VIDEO },
        function (stream) { /* user accepted access to a/v */
            console.log("Access granted to audio/video");
            console.log("stream: " + stream);
            console.log("stream: " + JSON.stringify(stream));



            local_media_stream = stream;
            // local_media_shareStream = stream;
            var local_media = USE_VIDEO ? $("<video>") : $();
            local_media.attr("autoplay", "autoplay");
            local_media.attr("muted", "true"); /* always mute ourselves by default */
            // local_media.attr("controls", "");
            local_media.attr("id", "videoElem");
            local_media.attr("style", "border:1px solid skyblue;display:inline !important");


            // $('#videosAttach').before("<div class=" + "col-lg-3 col-md-6 portfolio-items" + ">");
            // $('#videosAttach').after("<div class=" + "details" + "><h4>App 1</h4><span>Alored dono par</span></div></div>");
            $('#portfolio-wrapper').append('<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 portfolio-items"><div id="videosAttach"></div><div class="details"><button id="fullscreenbtn" class="btn fa fa-expand" style="float:left; margin-top: 10px; margin-left: 10px;"></button><h4>' + userName + '</h4><span>All is well</span></div></div>');
            $('#videosAttach').append(local_media);


            // /* =============Start==================== */
            // $('#record').append('<div><label id="percentage">0%</label><progress id="progress-bar" value=0></progress><br /></div><hr /><div><button id="btn-start-recording">Start Recording</button><button id="btn-stop-recording" disabled="">Stop Recording</button></div>');
            // var btnStartRecording = document.querySelector('#btn-start-recording');
            // var btnStopRecording = document.querySelector('#btn-stop-recording');
            // var videoElement = document.getElementById('videoElem');
            // var progressBar = document.querySelector('#progress-bar');
            // var percentage = document.querySelector('#percentage');

            // var recorder;
            // var peerRecord;

            // reusable helpers

            // this function submits recorded blob to nodejs server
            function postFiles() {
                console.log("postFiles-->");
                var blob = recorder.getBlob();

                // getting unique identifier for the file name
                var fileName = generateRandomString() + '.webm';

                var file = new File([blob], fileName, {
                    type: 'video/webm'
                });

                videoElement.src = '';
                videoElement.poster = '/ajax-loader.gif';

                // console.log("url: " + url);
                // console.log("data: " + data);
                // file = data;

                // if (file.size > MAX_UPLOAD_SIZE * 1000 * 1000) {
                //     alert('Sorry, we can only accept files up to ' + MAX_UPLOAD_SIZE + ' MB');
                // }
                if (file.type.substring(0, 5) === 'video') {

                    console.log("Video");
                    // uplaod video  
                    videoReaderRecord.readAsDataURL(file);
                }
                xhr('/uploadFile', file, function (responseText) {
                    console.log("/uploadFile-->");
                    var fileURL = JSON.parse(responseText).fileURL;

                    console.info('fileURL', fileURL);
                    videoElement.src = fileURL;
                    videoElement.play();
                    videoElement.muted = false;
                    videoElement.controls = true;

                    document.querySelector('#footer-h2').innerHTML = '<a href="' + videoElement.src + '">' + videoElement.src + '</a>';
                    console.log("<--/uploadFile");
                });

                if (mediaStream) mediaStream.stop();
                console.log("<--postFiles");
            }
            videoReaderRecord.onload = function (e) {
                console.log("videoReaderRecord.onload-->");
                var targetResult = e.target.result;

                // scrollDown();
                // 
                // share video
                appendFile_record(targetResult);
                console.log("<--videoReaderRecord.onload");
            };

            // XHR2/FormData
            function xhr(url, data, callback) {
                console.log("xhr-->");
                console.log("url: " + url);
                console.log("data: " + data);
                file = data;

                if (file.size > MAX_UPLOAD_SIZE * 1000 * 1000) {
                    alert('Sorry, we can only accept files up to ' + MAX_UPLOAD_SIZE + ' MB');
                }
                if (file.type.substring(0, 5) === 'video') {

                    console.log("Video");
                    // uplaod video  
                    videoReader.readAsDataURL(file);
                }

                var request = new XMLHttpRequest();
                console.log("request: " + request);
                request.onreadystatechange = function () {
                    if (request.readyState == 4 && request.status == 200) {
                        callback(request.responseText);
                    }
                };

                request.upload.onprogress = function (event) {
                    progressBar.max = event.total;
                    progressBar.value = event.loaded;
                    progressBar.innerHTML = 'Upload Progress ' + Math.round(event.loaded / event.total * 100) + "%";
                };

                request.upload.onload = function () {
                    percentage.style.display = 'none';
                    progressBar.style.display = 'none';
                };
                request.open('POST', url);

                var formData = new FormData();
                formData.append('file', data);
                request.send(formData);
                console.log("<--xhr");
            }

            // generating random string
            function generateRandomString() {
                if (window.crypto) {
                    var a = window.crypto.getRandomValues(new Uint32Array(3)),
                        token = '';
                    for (var i = 0, l = a.length; i < l; i++) token += a[i].toString(36);
                    return token;
                } else {
                    return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
                }
            }

            var mediaStream = null;
            // reusable getUserMedia
            function captureUserMedia(success_callback) {
                var session = {
                    audio: true,
                    video: true
                };

                navigator.getUserMedia(session, success_callback, function (error) {
                    alert('Unable to capture your camera. Please check console logs.');
                    console.error(error);
                });
            }

            // UI events handling
            // document.getElementById("btn-start-recording").addEventListener("click", function () {
            //     // btnStartRecording.onclick = function () {
            //     console.log("btnStartRecording-->");
            //     btnStartRecording.disabled = true;

            //     captureUserMedia(function (stream) {
            //         mediaStream = stream;

            //         videoElement.src = window.URL.createObjectURL(stream);
            //         videoElement.play();
            //         videoElement.muted = true;
            //         videoElement.controls = false;

            //         recorder = RecordRTC(stream, {
            //             type: 'video'
            //         });


            //         recorder.startRecording();

            //         // enable stop-recording button
            //         btnStopRecording.disabled = false;
            //     });

            //     if (peerStream != null) {
            //         peerRecord = RecordRTC(stream, {
            //             type: 'video'
            //         });
            //         peerRecord.startRecording();
            //     }

            //     console.log("<--btnStartRecording");
            // });


            // document.getElementById("btn-stop-recording").addEventListener("click", function () {
            //     // btnStopRecording.onclick = function () {
            //     btnStartRecording.disabled = false;
            //     btnStopRecording.disabled = true;

            //     recorder.stopRecording(postFiles);

            //     if (peerStream != null) {
            //         peerRecord.stopRecording(postFiles)
            //     }
            // });

            // window.onbeforeunload = function () {
            //     startRecording.disabled = false;
            // };

            /* ================End================= */






            document.getElementById("videoElem").addEventListener("click", function () {
                var videoElem = document.getElementById('videoElem');

                var isFullScreen = videoElem.requestFullscreen || videoElem.mozRequestFullScreen || videoElem.webkitRequestFullscreen;
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

                }
                else {
                    console.log("Big Screen");
                    if (videoElem.exitFullscreen)
                        document.exitFullscreen();
                    else if (videoElem.webkitExitFullscreen)
                        videoElem.webkitExitFullscreen();
                    else if (videoElem.mozCancelFullScreen)
                        videoElem.mozCancelFullScreen();
                    else if (videoElem.msExitFullscreen)
                        videoElem.msExitFullscreen();
                }




            })
            document.getElementById("audio_btn").addEventListener("click", function () {
                console.log("audio_btn-->");
                console.log("stream.getAudioTracks()[0].enabled: " + stream.getAudioTracks()[0].enabled);
                stream.getAudioTracks()[0].enabled = !(stream.getAudioTracks()[0].enabled);
                var michrophoneVal = stream.getAudioTracks()[0].enabled;


                if (michrophoneVal) {

                    document.getElementById("audioMute_btn").style.display = 'inline';
                    document.getElementById("audioUnmute_btn").style.display = 'none';
                }
                else {
                    document.getElementById("audioMute_btn").style.display = 'none';
                    document.getElementById("audioUnmute_btn").style.display = 'inline';
                }

                console.log("stream.getAudioTracks()[0].enabled: " + stream.getAudioTracks()[0].enabled);
                console.log("<--audio_btn");
            })



            attachMediaStream(local_media[0], stream);






            if (callback) callback();
        },
        function () { /* user denied access to a/v */
            console.log("Access denied for audio/video");
            alert("You chose not to provide access to the camera/microphone, demo will not work.");
            if (errorback) errorback();
        });




    document.getElementById("screenShareBtn").addEventListener("click", function () {

        console.log("screenShare-->");


        getScreenId(function (error, sourceId, screen_constraints) {
            // error    == null || 'permission-denied' || 'not-installed' || 'installed-disabled' || 'not-chrome'
            // sourceId == null || 'string' || 'firefox'


            // screen_constraints.audio = true;
            navigator.getUserMedia(screen_constraints, function (stream) {

                navigator.getUserMedia({ audio: true }, function (audioStream) {
                    stream.addTrack(audioStream.getAudioTracks()[0]);




                    // shareScreen = peerNew_id;
                    var local_media = document.getElementById('videoElem');
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

                    };

                    $('#videosAttach').empty();

                    //local_media_stream = stream;
                    local_media_shareStream = stream;
                    var local_mediaScreenShare = USE_VIDEO ? $("<video>") : $("<audio>");
                    local_mediaScreenShare.attr("autoplay", "autoplay");
                    local_mediaScreenShare.attr("muted", "true"); /* always mute ourselves by default */
                    // local_mediaScreenShare.attr("controls", "");
                    local_mediaScreenShare.attr("id", "screenShareElem");
                    local_mediaScreenShare.attr("style", "border:1px solid skyblue");

                    //$('#portfolio-wrapper').append('<div id="'+id+'remoteContainer" class="col-lg-3 col-md-6 portfolio-items"><div id="'+id+'remoteVideoElement"></div><div class="details"><h4>'+config.userName+'</h4><span>All is well</span></div></div>');
                    $('#videosAttach').append(local_mediaScreenShare);



                    attachMediaStream(local_mediaScreenShare[0], stream);

                    /* ##### Start Stop Sharing ##### */
                    // var btn = document.createElement("input");
                    var btn = document.getElementById('screenShareStop');



                    btn.onclick = function stopVideo(local_mediaScreenShare) {
                        let stream = screenShareElem.srcObject;
                        let tracks = stream.getTracks();

                        tracks.forEach(function (track) {
                            track.stop();
                        });

                        screenShareElem.srcObject = null;
                        var existing = document.getElementById('screenShareElem');
                        if (existing) {
                            existing.parentNode.removeChild(existing);
                        }
                        $('#videosAttach').empty();
                        /* ######   ###### */
                        navigator.getUserMedia({ "audio": USE_AUDIO, "video": USE_VIDEO },
                            function (stream) { /* user accepted access to a/v */
                                console.log("Access granted to audio/video");
                                console.log("stream: " + stream);
                                console.log("stream: " + JSON.stringify(stream));
                                local_media_shareStream = null;
                                local_media_stream = stream;
                                // local_media_shareStream = stream;
                                var local_media = USE_VIDEO ? $("<video>") : $();
                                local_media.attr("autoplay", "autoplay");
                                local_media.attr("muted", "true"); /* always mute ourselves by default */
                                // local_media.attr("controls", "");
                                local_media.attr("id", "videoElem");
                                local_media.attr("style", "border:1px solid skyblue");
                                $('#videosAttach').append(local_media);

                                attachMediaStream(local_media[0], stream);

                                if (callback) callback();
                            },
                            function () { /* user denied access to a/v */
                                console.log("Access denied for audio/video");
                                alert("You chose not to provide access to the camera/microphone, Video will not work.");
                                if (errorback) errorback();
                            });
                        /* ######   ###### */

                    };






                    /* ##### End Stop Sharing ##### */





                    if (callback) callback();
                    // document.querySelector('video').src = URL.createObjectURL(stream);

                    // share this "MediaStream" object using RTCPeerConnection API
                }, function (error) {
                    console.error(error);
                    if (errorback) errorback();
                });

            }, function (error) {
                var msg = "You Must Need to Install  Screen Share Extention, Click ok to install";
                var newLine = "\r\n"
                msg += newLine;
                msg += "Note:Please Refresh the browser After Installing Extention ";
                if (window.confirm(msg)) {
                    window.open('https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk?utm_source=chrome-app-launcher-info-dialog');
                };
                //    alert("You Must Need to Install This Screen Share Extention https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk?utm_source=chrome-app-launcher-info-dialog ");
                console.error(error);
                if (errorback) errorback();
            });
        });
    })




    console.log("<--setup_local_media");



}


signaling_socket.on('stateChangedToClient', function (data) {

    console.log("newstateChangedToClientTextMsg-->");
    console.log("data.userId: " + data.userId);
    console.log("peerNew_id: " + peerNew_id);
    if (data.userId == peerNew_id) {
        window.location.reload(true);
    }
    console.log("<--newstateChangedToClientTextMsg");
})





function scrollDown() {
    console.log("scrollDown-->");
    $('#popupMsg').animate({ scrollTop: $('#popupMsg').prop("scrollHeight") }, 500);
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
            callback(null, 'firefox', {
                video: {
                    mozMediaSource: 'window',
                    mediaSource: 'window'
                }
            });
            return;
        }

        window.addEventListener('message', onIFrameCallback);

        function onIFrameCallback(event) {
            if (!event.data) return;

            if (event.data.chromeMediaSourceId) {
                if (event.data.chromeMediaSourceId === 'PermissionDeniedError') {
                    callback('permission-denied');
                } else {
                    callback(null, event.data.chromeMediaSourceId, getScreenConstraints(null, event.data.chromeMediaSourceId));
                }

                // this event listener is no more needed
                window.removeEventListener('message', onIFrameCallback);
            }

            if (event.data.chromeExtensionStatus) {
                callback(event.data.chromeExtensionStatus, null, getScreenConstraints(event.data.chromeExtensionStatus));

                // this event listener is no more needed
                window.removeEventListener('message', onIFrameCallback);
            }
        }

        setTimeout(postGetSourceIdMessage, 100);
    };

    function getScreenConstraints(error, sourceId) {
        var screen_constraints = {
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: error ? 'screen' : 'desktop',
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
        }, '*');
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

        iframe = document.createElement('iframe');
        iframe.onload = function () {
            iframe.isLoaded = true;

            loadCallback();
        };
        iframe.src = 'https://www.webrtc-experiment.com/getSourceId/'; // https://wwww.yourdomain.com/getScreenId.html
        iframe.style.display = 'none';
        (document.body || document.documentElement).appendChild(iframe);
    }

    window.getChromeExtensionStatus = function (callback) {
        // for Firefox:
        if (!!navigator.mozGetUserMedia) {
            callback('installed-enabled');
            return;
        }

        window.addEventListener('message', onIFrameCallback);

        function onIFrameCallback(event) {
            if (!event.data) return;

            if (event.data.chromeExtensionStatus) {
                callback(event.data.chromeExtensionStatus);

                // this event listener is no more needed
                window.removeEventListener('message', onIFrameCallback);
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
        }, '*');
    }
})();
// Header fixed and Back to top button
$(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
        $('.back-to-top').fadeIn('slow');
        $('#header').addClass('header-fixed');
    } else {
        $('.back-to-top').fadeOut('slow');
        $('#header').removeClass('header-fixed');
    }
});
$('.back-to-top').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
    return false;
});


io.sockets.on('connection', function (socket) {

    console.log("connection started-->");
    //console.log("connection: socket: " + socket);
    // console.log("userName: "+userName);
    // console.log("connection: socket.channels: " + socket.channels);
    console.log("connection: socket.id: " + socket.id);
    socket.channels = {};
    if (peerTrack.length == 0) {
        //console.log("peerTrack.length: "+peerTrack.length);
        peerTrack[0] = socket.id;
    }
    else {
        peerTrack[peerTrack.length] = socket.id;
    }

    //console.log("peerTrack.length: "+peerTrack.length);
    sockets[socket.id] = socket;

    console.log("[" + socket.id + "] connection accepted");

    /* ##### Start arrang all sockets in single array with key which id we are using in a link   ##### */
    peerTrackForVideo[queryId] = [];
    peerTrackForVideo[queryId].push(socket.id);
    // console.log("peerTrackForVideo."+queryId+": "+peerTrackForVideo.queryId);
    /* ##### End arrang all sockets in single array with key which id we are using in a link   ##### */
    console.log("QueryId: " + queryId);
    socket.emit('message', { 'peer_id': socket.id, 'queryId': queryId, 'time': time, 'userName': userName });

    socket.on('disconnect', function () {

        console.log("[" + socket.id + "] connection disconnected Start");

        for (var channel in socket.channels) {
            console.log("connection: channel: " + channel);
            part(channel);
        }
        console.log("[" + socket.id + "] disconnected");
        delete sockets[socket.id];

    });

    socket.on('disconnectSession', function (data) {
        console.log("disconnectSession-->");
        if (sessionHeaderId == data.owner) {
            for (var channel in socket.channels) {
                console.log("connection: channel: " + channel);
                part(channel);
            }
            console.log("started to delete session");
            console.log("sockets[data.deleteSessionId]: " + sockets[data.deleteSessionId]);
            delete sockets[data.deleteSessionId];
            delete channels[channel][data.deleteSessionId];

            console.log("sockets[data.deleteSessionId]: " + sockets[data.deleteSessionId]);
        }

        console.log("<--disconnectSession");
    })


    socket.on('join', function (config) {

        console.log("Join-->");
        // console.log("config.owner: "+config.owner);
        // console.log("config.queryLink: "+config.queryLink);
        peerWithQueryId[config.owner] = config.queryLink;
        peerWithTimeId[config.owner] = config.timeLink;

        peerWithUserName[config.owner] = config.userName;

        console.log("join 1 :[" + socket.id + "] join ", config);
        var channel = config.channel;
        var userdata = config.userdata;

        for (var key in peerWithQueryId) {
            console.log("key: " + key);

            var value = peerWithQueryId[key];
            var timeValue = peerWithTimeId[key];
            if (value == config.queryLink && timeValue == config.timeLink) {
                sessionHeaderId = key;

                break;
            }
            console.log("value " + value);
            console.log("peerWithQueryId.indexOf(value): " + peerWithQueryId.indexOf(value));
            // do something with "key" and "value" variables

        }
        // console.log("socket.channels: " + JSON.stringify(socket.channels));
        // console.log("channels: " + channels);


        // if (channel in socket.channels) {
        //     console.log("join 1.1 [" + socket.id + "] ERROR: already joined ", channel);
        //     return;
        // }

        if (!(channel in channels)) {
            console.log("join 1.2 [" + socket.id + "] INFO:channel ", channel);
            channels[channel] = {};
        }

        for (id in channels[channel]) {
            // console.log("id " + id);
            // console.log("socket.id " + socket.id);
            // console.log("channels[channel][id] " + channels[channel][id]);
            console.log("start to call client addPeer--><--");

            channels[channel][id].emit('addPeer', { 'peer_id': socket.id, 'should_create_offer': false, 'owner': socket.id, 'queryId': queryId, 'time' : time, 'userName': peerWithUserName[socket.id], 'sessionHeaderId': sessionHeaderId });

            socket.emit('addPeer', { 'peer_id': id, 'should_create_offer': true, 'owner': socket.id, 'queryId': queryId,'time' : time, 'userName': peerWithUserName[id], 'sessionHeaderId': sessionHeaderId });
        }

        channels[channel][socket.id] = socket;
        socket.channels[channel] = channel;

        // console.log("channels[channel][socket.id]: " + channels[channel][socket.id]);
        // console.log("socket.channels[channel] : " + socket.channels[channel]);
        // console.log("channels[channel]: " + channels[channel]);
        console.log("<--Join");
    });

    function part(channel) {
        console.log("[" + socket.id + "] part ");

        if (!(channel in socket.channels)) {
            console.log("[" + socket.id + "] ERROR: not in ", channel);
            return;
        }

        delete socket.channels[channel];
        delete channels[channel][socket.id];

        for (id in channels[channel]) {
            channels[channel][id].emit('removePeer', { 'peer_id': socket.id });
            socket.emit('removePeer', { 'peer_id': id });
        }
    }
    socket.on('part', part);

    socket.on('relayICECandidate', function (config) {
        console.log("relayICECandidate-->")
        var peer_id = config.peer_id;
        // console.log("relayICECandidate 1:config.peer_id: " + config.peer_id);
        var ice_candidate = config.ice_candidate;
        // console.log("[" + socket.id + "] relaying ICE candidate to [" + peer_id + "] ", ice_candidate);

        if (peer_id in sockets) {
            // console.log("relayICECandidate1.1:peer_id " + peer_id);
            sockets[peer_id].emit('iceCandidate', { 'peer_id': socket.id, 'ice_candidate': ice_candidate });
        }
        console.log("<--relayICECandidate")
    });

    socket.on('relaySessionDescription', function (config) {
        var peer_id = config.peer_id;
        console.log("relaySessionDescription-->");
        console.log("relaySessionDescription: " + JSON.stringify(config));
        console.log("config.peer_id: " + config.peer_id);
        var session_description = config.session_description;
        console.log("[" + socket.id + "] **********relaying session description to [" + peer_id + "] ", session_description);


        if (peer_id in sockets) {
            tempId = peer_id;
            console.log("+++++++++++queryId: " + queryId);
            console.log("+++++++=config.owner: " + config.owner);
            console.log("queryId: " + queryId);
            console.log("config.queryLink: " + config.queryLink);
            console.log("peerTrack.indexOf(queryId): " + peerTrack.indexOf(queryId));

            if (peerTrack.indexOf(queryId) >= 0) {
                if (queryId == config.queryLink) {


                    // var x = queryId;
                    // console.log("peerTrackForVideo[x].indexOf(sockets.id): "+peerTrackForVideo[x].indexOf(sockets.id));
                    sockets[peer_id].emit('sessionDescription', { 'peer_id': socket.id, 'session_description': session_description, 'owner': config.owner, 'queryId': config.queryLink, 'time':config.timeLink, 'sendTo': peer_id });
                    // if(peerTrackForVideo[x].indexOf(sockets.id)>=0)
                    //  {
                    //     sockets[peer_id].emit('sessionDescription', { 'peer_id': socket.id, 'session_description': session_description, 'owner':config.owner, });
                    //  }   
                }
                else {
                    console.log("relaySessionDescription: sorry");
                }
            }




        }
        console.log("<--relaySessionDescription");
    });

    /* ##### Start remove PerticularId  ##### */
    socket.on('closeThisConn', function (config) {
        console.log("closeThisConn-->")



        if (queryId == config.queryLink && time == config.timeLink) {
            console.log("queryId and config.queryLink are equal so gonna tell to client");
            io.sockets.emit('authorizedForClose', { "removableId": config.removableId, "removableName": config.removableName, "controllerId": config.peerNew_id, "queryLink": config.queryLink, 'timeLink':config.timeLink, "queryId": queryId });
        }
        console.log("<--closeThisConn")
    });
    /* ##### End remove PerticularId  ##### */

    /* ##### Start Gether text message  #### */
    socket.on('textMsg', function (data) {
        console.log("textMsg-->");
        // console.log("data.userId "+data.userId);
        // console.log("data.message: "+data.message);
        // console.log("data.queryLink: "+data.queryLink);
        // //Send message to everyone
        console.log("peerWithQueryId[data.userId]: " + peerWithQueryId[data.userId]);


        if (peerWithQueryId[data.userId] == data.queryLink && peerWithTimeId[data.userId] == data.timeLink) {
            io.sockets.emit('newTextMsg', { 'message': data.message, 'userId': data.userId, 'queryId': peerWithQueryId[data.userId],'time':peerWithTimeId[data.userId], 'userName': data.userName });
            // io.sockets.emit('userDetail', {'userId': data.userId,'userName': data.userName });
        }
        else {
            console.log("textMsg: sorry ");
            console.log("queryId: " + queryId);
            console.log("data.queryLink: " + data.queryLink);
        }
        console.log("<--textMsg");

    })
    /* ##### End Gether text message  #### */
    var information = null;

    /* ##### Start Gether Emails #### */
    socket.on('emailCapture', function (data) {

        console.log("emailCapture-->");
        console.log("data.userId " + data.userId);
        console.log("data.email: " + data.email);
        console.log("data.url: " + data.url);
        // console.log("data.queryLink: "+data.queryLink);
        // //Send message to everyone
        // console.log("peerWithQueryId[data.userId]: "+peerWithQueryId[data.userId]);
        if (data.email) {
            var mailOptions = {
                from: 'logeswari.careator@gmail.com',
                to: data.email,
                subject: 'Video Conference URL',
                text: 'Hi, Click This url to join video conference' + data.url
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("error while sending email: " + error);
                    information = error;
                } else {
                    console.log('Email sent: ' + info.response);
                    information = "email sent successfully";
                    console.log("information : " + information);
                }
                console.log("information : " + information);
                io.sockets.emit('emailSendInfo', { 'email': data.email, 'userId': data.userId, 'info': information });
            });


        }
        else {
            console.log("empty email");
        }


        console.log("<--emailCapture");

    })
    /* ##### End Gether Emails  #### */

    /* #### Start File Sharing  ##### */
    socket.on('file', function (data) {
        console.log("file-->");
        console.log("peerWithQueryId[data.userId]: " + peerWithQueryId[data.userId]);
        console.log("data.queryLink: " + data.queryLink);
        console.log("data.type: " + data.type);
        if (peerWithQueryId[data.userId] == data.queryLink && peerWithTimeId[data.userId] == data.timeLink) {

            io.sockets.emit('file', { 'userId': data.peerNew_id, 'queryId': data.queryLink, 'time':data.timeLink, 'userName': data.userName, 'dataURI': data.dataURI, 'type': data.type });
        }
        else{
            console.log("Sorry from server from file socket");
        }
        // var to = user.peers;

        // for(var i=0; i < to.length; i++){
        // dir[to[i]].socket.emit('file', dataURI,type, user.username);

        // }
        console.log("<--file");
    });
    /* #### End File Sharing  ##### */

    socket.on('stateChanged', function (data) {
        console.log("stateChanged-->");


        if (peerWithQueryId[data.userId] == data.queryLink && peerWithTimeId[data.userId] == data.timeLink) {

            sockets[data.peerNew_id].emit('stateChangedToClient', { 'userId': data.userId, 'queryId': data.queryLink, 'time': data.timeLink });
        }
        console.log("<--stateChanged");
    })


    console.log("<--connection Ended");
});