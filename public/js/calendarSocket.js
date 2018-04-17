/** CONFIG **/
console.log("Signaling Socket.js from calendar");
var SIGNALING_SERVER = "https://norecruits.com";
//var SIGNALING_SERVER = "http://localhost:5000";
//var SIGNALING_SERVER = "https://svcapp.herokuapp.com";
// var SIGNALING_SERVER = "https://logchat.herokuapp.com";

if (localStorage.getItem("userData")) {
    document.getElementById("appLogin").style.display = 'none';
    document.getElementById("appLogout").style.display = 'block';
    document.getElementById("videoConferenceUrl").style.display = 'block';
    document.getElementById("scheduleMeeting").style.display = 'block';
    document.getElementById("videoConferenceLinkExtention").style.display = 'block';

}



function vcLogout() {
    console.log("vcLogout");
    window.location = "https://norecruits.com/client";
    localStorage.removeItem("userData");
    document.getElementById("appLogin").style.display = 'block';
    document.getElementById("appLogout").style.display = 'none';
    document.getElementById("videoConferenceUrl").style.display = 'none';
    document.getElementById("scheduleMeeting").style.display = 'none';
    document.getElementById("videoConferenceLinkExtention").style.display = 'none';
}






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
var userName = null;
signaling_socket = io(SIGNALING_SERVER);
var file;
var disconnPeerId = null;
var shareScreen = null;
var sessionHeader = null;
var peerStream = null;





function init() {




    console.log("init-->");

    signaling_socket = io(SIGNALING_SERVER);

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

                    document.getElementById('linkToShare').innerHTML += "https://norecruits.com/client/" + peerNew_id;
                    //document.getElementById('videoConferenceUrl').setAttribute('href', "https://norecruits.com/client/" + peerNew_id);
                    document.getElementById('linkToShare').setAttribute('href', "https://norecruits.com/client/" + peerNew_id);


        })
    })
}




                    
