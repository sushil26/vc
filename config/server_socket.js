module.exports = function (io, queryId) {

    var userName = null;

    /*************************/
    /*** INTERESTING STUFF ***/
    /*************************/

    var channels = {};
    var sockets = {};
    var peerTrack = [];
    var peerWithQueryId = []; /* PeerId with Query Id: peer-id is a index, value is a query id  */
    var peerWithUserName = []; /* PeerId with UserName: peer-id is a index, Value is a UserName  */
    var peerTrackForVideo = { 'link': [] }; /* This variable for getting socket.id's with perticular Link*/
    var tempId = null;
    var sessionHeaderId = null;
    /**
     * Users will connect to the signaling server, after which they'll issue a "join"
     * to join a particular channel. The signaling server keeps track of all sockets
     * who are in a channel, and on join will send out 'addPeer' events to each pair
     * of users in a channel. When clients receive the 'addPeer' even they'll begin
     * setting up an RTCPeerConnection with one another. During this process they'll
     * need to relay ICECandidate information to one another, as well as SessionDescription
     * information. After all of that happens, they'll finally be able to complete
     * the peer connection and will be streaming audio/video between eachother.
     */

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
        socket.emit('message', { 'peer_id': socket.id, 'queryId': queryId, 'userName': userName });

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
            queryId = config.queryLink;

            peerWithUserName[config.owner] = config.userName;

            console.log("join 1 :[" + socket.id + "] join ", config);
            var channel = config.channel;
            var userdata = config.userdata;

            for (var key in peerWithQueryId) {
                console.log("key: " + key);

                var value = peerWithQueryId[key];
                if (value == config.queryLink) {
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

                channels[channel][id].emit('addPeer', { 'peer_id': socket.id, 'should_create_offer': false, 'owner': socket.id, 'queryId': queryId, 'userName': peerWithUserName[socket.id], 'sessionHeaderId': sessionHeaderId });

                socket.emit('addPeer', { 'peer_id': id, 'should_create_offer': true, 'owner': socket.id, 'queryId': queryId, 'userName': peerWithUserName[id], 'sessionHeaderId': sessionHeaderId });
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
                        sockets[peer_id].emit('sessionDescription', { 'peer_id': socket.id, 'session_description': session_description, 'owner': config.owner, 'queryId': config.queryLink, 'sendTo': peer_id });
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



            if (queryId == config.queryLink) {
                console.log("queryId and config.queryLink are equal so gonna tell to client");
                io.sockets.emit('authorizedForClose', { "removableId": config.removableId, "removableName": config.removableName, "controllerId": config.peerNew_id, "queryLink": config.queryLink, "queryId": queryId });
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


            if (peerWithQueryId[data.userId] == data.queryLink) {
                io.sockets.emit('newTextMsg', { 'message': data.message, 'userId': data.userId, 'queryId': peerWithQueryId[data.userId], 'userName': data.userName });
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
            if (peerWithQueryId[data.userId] == data.queryLink) {

                io.sockets.emit('file', { 'userId': data.peerNew_id, 'queryId': data.queryLink, 'userName': data.userName, 'dataURI': data.dataURI, 'type': data.type });
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


            if (peerWithQueryId[data.userId] == data.queryLink) {

                sockets[data.peerNew_id].emit('stateChangedToClient', { 'userId': data.userId, 'queryId': data.queryLink });
            }
            console.log("<--stateChanged");
        })


        console.log("<--connection Ended");
    });


}