/** CONFIG **/
//var SIGNALING_SERVER = "http://localhost:8080";
var SIGNALING_SERVER = "https://svcapp.herokuapp.com";
//var SIGNALING_SERVER = "https://logchat.herokuapp.com";
var USE_AUDIO = true;
var USE_VIDEO = true;
var DEFAULT_CHANNEL = 'some-global-ch-name';
var MUTE_AUDIO_BY_DEFAULT = false;
/** You should probably use a different stun server doing commercial stuff **/
/** Also see: https://gist.github.com/zziuni/3741933 **/
var ICE_SERVERS = [
    { url: "stun:stun.l.google.com:19302" }, { url: "turn:turn.anyfirewall.com:443?transport=tcp", credential: "webrtc", username: "webrtc" }
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
var txtQueryLink = null;
var userName = null;
signaling_socket = io();
var file;
var disconnPeerId = null;
var shareScreen = null;
var sessionHeader = null;
function setNameBtn() {
    console.log("setName-->");

    userName = document.getElementById('userName').value;
    /* ie, if we've already been initialized */
    return userName;
    //signaling_socket.emit('userNameDetail', { 'userId': peerNew_id, 'queryLink': queryLink, 'userName': userName });
    console.log("<--setName");

}


function crdcheck() {
    console.log("crdcheck-->");
    var uname = document.getElementById('crname').value;
    var upass = document.getElementById('crpass').value;
    if (uname == 'admin' && upass == 'admin123') {
        console.log("Password Matched");
        document.getElementById('videoConfStart').enabled = true;
    }
    else {
        console.log("Password Not Matched");
        document.getElementById('videoConfStart').disabled = true;
        window.location = "https://svcapp.herokuapp.com/client";

    }

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
            console.log("queryLink: " + queryLink);
            console.log("peerNew_id: " + peerNew_id);
            if (config.queryId == null) {
                console.log("query id is null");
                $('#crdbuttn').trigger('click');
                console.log("message: config.peer_id: " + config.peer_id);
                document.getElementById('linkToShare').innerHTML += "https://svcapp.herokuapp.com/client/" + peerNew_id;
                document.getElementById('videoConferenceUrl').setAttribute('href', "https://svcapp.herokuapp.com/client/" + peerNew_id);
                document.getElementById('linkToShare').setAttribute('href', "https://svcapp.herokuapp.com/client/" + peerNew_id);

            }
            else {
                console.log("query id nt null");
                document.getElementById('linkToShare').innerHTML += "https://svcapp.herokuapp.com/client/" + config.queryId;
                document.getElementById('linkToShare').setAttribute('href', "https://svcapp.herokuapp.com/client/" + config.queryId);
                //     document.getElementById('linkToShare').innerHTML += "https://logchat.herokuapp.com/client/" + peerNew_id;
                //     document.getElementById('videoConferenceUrl').setAttribute('href', "https://logchat.herokuapp.com/client/" + peerNew_id);
                //     document.getElementById('linkToShare').setAttribute('href', "https://logchat.herokuapp.com/client/" + peerNew_id);

                // }
                // else {
                //     console.log("query id nt null");
                //     document.getElementById('linkToShare').innerHTML += "https://logchat.herokuapp.com/client/" + config.queryId;
                //     document.getElementById('linkToShare').setAttribute('href', "https://logchat.herokuapp.com/client/" + config.queryId);


                //     document.getElementById('linkToShare').innerHTML += "http://localhost:8080/client/" + peerNew_id;
                //     document.getElementById('videoConferenceUrl').setAttribute('href', "http://localhost:8080/client/" + peerNew_id);
                //     document.getElementById('linkToShare').setAttribute('href', "http://localhost:8080/client//client/" + peerNew_id);

                // }
                // else {
                //     console.log("query id nt null");
                //     document.getElementById('linkToShare').innerHTML += "http://localhost:8080/client/" + config.queryId;
                //     document.getElementById('linkToShare').setAttribute('href', "http://localhost:8080/client/" + config.queryId);



                // document.getElementById('btn-start-recording').style.display = 'inline';
                document.getElementById('feedback').style.display = 'inline';
                document.getElementById('fdb').style.display = 'inline';
                document.getElementById('usercontectdtl').style.display = 'inline';

                document.getElementById('screenBtns').style.display = 'inline';
                document.getElementById('videoConfStart').style.display = 'none';
                document.getElementById('openChat').style.display = 'inline';

                document.getElementById('audio_btn').style.display = 'inline';
                document.getElementById('diconnect_btn').style.display = 'inline';
                document.getElementById('videoConferenceLinkExtention').style.display = 'inline';

                console.log("bretrigger");
                /* ##### Start trigger click for setName automatically  ##### */
                $('#setName').trigger('click');
                /* ##### End trigger click for setName automatically  ##### */

                console.log("Start CallBack");

                document.getElementById("setNameId").addEventListener("click", function () {
                    userName = document.getElementById('userName').value;
                    var userNameCapitalStart = userName.charAt(0).toUpperCase() + userName.slice(1);
                    console.log("userNameCapitalStart: " + userNameCapitalStart);
                    userName = userNameCapitalStart;

                    if (userName) {
                        $('#myModal').modal('hide');
                        setup_local_media(function () {
                            /* once the user has given us access to their
                             * microphone/camcorder, join the channel and start peering up */


                            join__channel(DEFAULT_CHANNEL, { 'whatever-you-want-here': 'stuff' });

                        })
                    }
                    else {
                        console.log("User Name is Empty");
                    }

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

        signaling_socket.emit('join', { "channel": channel, "userdata": userdata, 'owner': peerNew_id, 'queryLink': queryLink, 'userName': userName });

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
            // remote_media.attr("controls", "");

            remote_media.attr("name", config.userName);
            console.log("onaddstream: peer_id: " + peer_id);
            peer_media_elements[peer_id] = remote_media;


            remote_media.attr("id", peer_id + "Remote");
            $('#portfolio-wrapper').append('<div id="' + peer_id + 'remoteContainer" class="portfolio-items col-xs-12 col-sm-6 col-md-4 col-lg-3" ><div id="' + peer_id + 'remoteVideoElement"></div><div class="details"><button id="' + peer_id + 'fullscreenbtn2" class="btn fa fa-expand" style="float:left;  margin-top: 10px; margin-left: 10px;"></button><h4>' + config.userName + '</h4><i style="display:none; float:right;color: #555555e3; margin-top: -15px; margin-right: 10px;" id="closeThisConn' + peer_id + '" class="fa fa-window-close cancelColrChange" aria-hidden="true" id="closeThisConn' + peer_id + '" owner=' + peer_id + ' name=' + config.userName + '></i><span>All is well</span></div></div>');
            $('#' + peer_id + 'remoteVideoElement').append(remote_media);

            peer_userName_elements[peer_id] = document.getElementById('' + peer_id + 'remoteContainer');

            if (peerNew_id == sessionHeader) {
                document.getElementById("closeThisConn" + peer_id).style.display = 'inline';

                document.getElementById("closeThisConn" + peer_id).addEventListener("click", function () {
                    var removableId = document.getElementById("closeThisConn" + peer_id).getAttribute('owner');
                    var removableName = document.getElementById("closeThisConn" + peer_id).getAttribute('name');

                    signaling_socket.emit('closeThisConn', { "removableId": removableId, "removableName": removableName, "controllerId": peerNew_id, "queryLink": queryLink });
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
            // var fullscreenbtn2;
            // vid2 = document.getElementById(peer_id + "Remote");

            // $("#" + peer_id + "Remote").click(function () {
                $("#" + peer_id + "fullscreenbtn2").click(function () {
                console.log("sushil screen test");
                $("#" + peer_id + "remoteVideoElement").addClass("fullscr");
                $("#" + peer_id + "remoteContainer").removeClass("portfolio-items col-xs-12 col-sm-6 col-md-4 col-lg-3");
                $("#" + peer_id + "Remote").css({"height":"100vh"});

                $("#videoElem").css({ "position": "absolute","top": "5%","left": "5%","z-index": "2","background": "none","border": "none","height": "auto","width": "20%"});
                $("#videoElem111").removeClass("portfolio-items col-xs-12 col-sm-6 col-md-4 col-lg-3");
                $("header").remove();
                document.getElementById('btnrestore').style.display = 'inline';
              
        

            }
            )
            // $("#fullscreenbtn2").click(function () {
            //     console.log("sushil screen test");
            //     $("#" + peer_id + "Remote").addClass("fullscr");
            //     $(".portfolio-items col-xs-12 col-sm-6 col-md-4 col-lg-3").removeClass("portfolio-items");


            // }
            // )


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
                                { 'peer_id': peer_id, 'session_description': local_description, 'from': "addpeer", 'owner': config.owner, 'queryLink': queryLink });
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
                                            { 'peer_id': peer_id, 'session_description': local_description, 'from': "sessionDescription", 'owner': config.owner, 'queryLink': queryLink });
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
        peer_userName_elements[peer_id].remove();
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
            window.location.href = "https://svcapp.herokuapp.com";
        }

        // delete peer_media_sselements[config.peer_id];
        console.log('<--authorizedForClose');
    });





    console.log("<--init");

    // <!--------video Controller-------->



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
            $('#portfolio-wrapper').append('<div id="videoElem111" class="portfolio-items col-xs-12 col-sm-6 col-md-4 col-lg-3"><div id="videosAttach"></div><div class="details"><button id="fullscreenbtn" class="btn fa fa-expand" style="float:left; margin-top: 10px; margin-left: 10px;"></button><h4>' + userName + '</h4><span>All is well</span></div></div>');
            $('#videosAttach').append(local_media);
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