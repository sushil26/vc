var express = require('express');
var http = require('http');
var bodyParser = require('body-parser')
var nodemailer = require('nodemailer');
var fileUpload = require('express-fileupload');
var cJSON = require('circular-json');
var ObjectId = require("mongodb").ObjectID;

var multer = require('multer');

var fs = require('fs'),
    url = require('url'),
    path = require('path');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({
    limit: '100mb'
}));
// app.use(bodyParser.json({limit: "1024mb"}));
// app.use(bodyParser.urlencoded({limit: "1024mb", extended: true, parameterLimit:50000}));

//app.use(multer());
app.use(fileUpload());

// module.exports = function (app, config) {
//app.set('view engine','html');
// app.use(session({secret: "Your secret key"}));
//app.use(multer({ dest: './public/schoolLogo'}));
// }
var queryId = null;
var userName = null;
var time = null;
var deletedSocket_ids = [];

var mongoConfig = require('./config/dbConfig.js');

// var chatHistory = db.collection("chatHistory");

var server = app.listen('5000', function () {
    console.log("Listening on port 5000");
});
// var server = app.listen("8080");
var io = require('socket.io').listen(server);
app.set('socketio', io);
var chatHistory;
// server.timeout = 9999999999;
mongoConfig.connectToServer(function (err) {
    console.log("mongo connected -->");
    require('./config/router')(app);
})
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});


app.get("/client", function (req, res) {
    queryId = null;
    console.log("start to render page");
    res.sendFile(__dirname + '/public/client.html');
});

app.get("/client/:id/:time", function (req, res) {
    queryId = req.params.id;
    time = req.params.id;
    console.log("queryId: " + req.params.id);
    console.log("start to render page");
    res.sendFile(__dirname + '/public/client.html');
});

app.get("/clientNew", function (req, res) {
    res.sendFile(__dirname + '/public/client1.html');
});

app.get("/clientNew/:id/:time", function (req, res) {
    res.sendFile(__dirname + '/public/client1.html');
});

app.get("/careator", function (req, res) {
    queryId = null;
    console.log("start to render page");
    res.sendFile(__dirname + '/public/careator.html');
});

app.get("/careator/:id/:time", function (req, res) {
    queryId = req.params.id;
    time = req.params.id;
    console.log("queryId: " + req.params.id + "Time: " + req.params.time);
    console.log("start to render page");
    res.sendFile(__dirname + '/public/careator.html');
});

app.get("/careatorApp", function (req, res) {
    console.log("chatCrtr started to render-->");
    res.sendFile(__dirname + '/public/careatorComm.html');
});

/*************************/
/*** INTERESTING STUFF ***/
/*************************/

var channels = {};
var sockets = {};
var peerTrack = [];
var peerWithQueryId = []; /* PeerId with Query Id: peer-id is a index, value is a query id  */
var peerWithTimeId = [];  /* PeerId with time Id: peer-id is a index, value is a time id  */
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
    console.log("deletedSocket_ids.indexOf(queryId): " + deletedSocket_ids.indexOf(queryId));
    console.log("deletedSocket_ids: " + JSON.stringify(deletedSocket_ids));
    if (deletedSocket_ids.indexOf(queryId) < 0) {
        socket.emit('message', { 'peer_id': socket.id, 'queryId': queryId, 'time': time, 'userName': userName, 'isQueryIdAuthorized': 'yes' });
    }
    else {
        socket.emit('message', { 'peer_id': socket.id, 'queryId': queryId, 'time': time, 'userName': userName, 'isQueryIdAuthorized': 'no' });
    }


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
        io.sockets.emit('disconnectSessionReply', { "deleteSessionId": data.deleteSessionId, "owner": data.owner });
        //if (sessionHeaderId == data.owner) {
        var db = mongoConfig.getDb();
        console.log("db: " + db);
        careatorMaster = db.collection("careatorMaster");
        var queryObj = {
            "_id": ObjectId(data.userId)
        }
        careatorMaster.update(queryObj, { $set: { "isDisconnected": "yes" } }, function (err, data) {
            if (err) {
                console.log("errr: " + JSON.stringify(err));
            }
            else {
                console.log("data: " + JSON.stringify(data));
            }
        })
        deletedSocket_ids.push(data.deleteSessionId);
        console.log("deletedSocket_ids: " + JSON.stringify(deletedSocket_ids));
        var tempSock = sockets[data.deleteSessionId]; /* ### Note using this deleteSessionId we are getting real socket(tempSock)   ### */
        // for (var channel in tempSock.channels) {
        //     console.log("connection: channel: " + channel);
        //     part(channel);
        // }
        console.log("started to delete session");
        console.log("data.deleteSessionId: " + data.deleteSessionId);
        console.log("sockets[data.deleteSessionId]: " + sockets.valueOf(data.deleteSessionId));
        delete sockets[data.deleteSessionId];
        delete peerTrackForVideo[data.deleteSessionId];
        //delete channels[channel][data.deleteSessionId];
        console.log("sockets[data.deleteSessionId]: " + sockets[data.deleteSessionId]);
        console.log("deletedSocket_ids: " + JSON.stringify(deletedSocket_ids));
        console.log("<--disconnectSession");
    })

    socket.on('join', function (config) {

        console.log("Join-->");
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
            channels[channel][id].emit('addPeer', { 'peer_id': socket.id, 'should_create_offer': false, 'owner': socket.id, 'queryId': queryId, 'time': time, 'userName': peerWithUserName[socket.id], 'sessionHeaderId': sessionHeaderId });
            socket.emit('addPeer', { 'peer_id': id, 'should_create_offer': true, 'owner': socket.id, 'queryId': queryId, 'time': time, 'userName': peerWithUserName[id], 'sessionHeaderId': sessionHeaderId });
        }

        channels[channel][socket.id] = socket;
        socket.channels[channel] = channel;
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
        var ice_candidate = config.ice_candidate;
        if (peer_id in sockets) {
            sockets[peer_id].emit('iceCandidate', { 'peer_id': socket.id, 'ice_candidate': ice_candidate });
        }
        console.log("<--relayICECandidate")
    });

    socket.on('relaySessionDescription', function (config) {
        var peer_id = config.peer_id;
        console.log("relaySessionDescription-->");
        //console.log("relaySessionDescription: " + JSON.stringify(config));
        //console.log("config.peer_id: " + config.peer_id);
        var session_description = config.session_description;
        //console.log("[" + socket.id + "] **********relaying session description to [" + peer_id + "] ", session_description);
        if (peer_id in sockets) {
            tempId = peer_id;
            console.log("+++++++++++queryId: " + queryId);
            console.log("+++++++=config.owner: " + config.owner);
            console.log("queryId: " + queryId);
            console.log("config.queryLink: " + config.queryLink);
            console.log("peerTrack.indexOf(queryId): " + peerTrack.indexOf(queryId));
            if (peerTrack.indexOf(queryId) >= 0) {
                if (queryId == config.queryLink) {
                    sockets[peer_id].emit('sessionDescription', { 'peer_id': socket.id, 'session_description': session_description, 'owner': config.owner, 'queryId': config.queryLink, 'time': config.timeLink, 'sendTo': peer_id });
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
            io.sockets.emit('authorizedForClose', { "removableId": config.removableId, "removableName": config.removableName, "controllerId": config.peerNew_id, "queryLink": config.queryLink, 'timeLink': config.timeLink, "queryId": queryId });
        }
        console.log("<--closeThisConn")
    });
    /* ##### End remove PerticularId  ##### */

    /* ##### Start Gether text message  #### */
    socket.on('textMsg', function (data) {
        console.log("textMsg-->");
        var db = mongoConfig.getDb();
        console.log("db: " + db);
        chatHistory = db.collection("chatHistory");
        // //Send message to everyone
        console.log("peerWithQueryId[data.userId]: " + peerWithQueryId[data.userId]);

        if (peerWithQueryId[data.userId] == data.queryLink && peerWithTimeId[data.userId] == data.timeLink) {
            var date = new Date();
            //console.log("timeLink: "+timeLink);
            console.log("peerWithQueryId: " + peerWithQueryId[data.userId]);
            console.log("peerWithQueryId: " + peerWithQueryId[data.userId]);
            var queryObj = {
                "url": "https://vc4all.in/careator/" + peerWithQueryId[data.userId] + "/" + data.urlDate,
            }
            console.log("queryObj: " + JSON.stringify(queryObj));
            var obj = {
                "email": data.email,
                'message': data.message,
                'userName': data.userName,
                'textTime': date
            }
            console.log("obj: " + JSON.stringify(obj));
            console.log("chatHistory: " + chatHistory);
            chatHistory.update(queryObj, { $push: { "chat": obj } }, function (err, data) {
                if (err) {
                    console.log("errr: " + JSON.stringify(err));
                }
                else {
                    console.log("data: " + JSON.stringify(data));
                }
            })
            io.sockets.emit('newTextMsg', { 'message': data.message, 'userId': data.userId, 'queryId': peerWithQueryId[data.userId], 'time': peerWithTimeId[data.userId], 'userName': data.userName });

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

            io.sockets.emit('file', { 'userId': data.peerNew_id, 'queryId': data.queryLink, 'time': data.timeLink, 'userName': data.userName, 'dataURI': data.dataURI, 'type': data.type });
        }
        else {
            console.log("Sorry from server from file socket");
        }
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

    /* ### Start: Get the event view notification from the reciever(upcomingEventCtrl.js) ### */
    socket.on('event_viewDetail_toserver', function (data) {
        console.log("event_viewDetail_toserver-->");
        io.sockets.emit('event_viewDetail_toSender', { "userId": data.userId }) /* ### Note: Send event view notification to event sender(who's user id is matched with this userId) ### */
    })
    /* ### End: Get the event view notification from the reciever ### */

    /* ### Start: Get the quick message view notification from the reciever(incomingMsgCtl.js) ### */
    socket.on('quickMsg_viewDetail_toserver', function (data) {
        console.log("quickMsg_viewDetail_toserver-->");
        io.sockets.emit('quickMsg_viewDetail_toSender', { "userId": data.userId }) /* ### Note: Send quick message view notification to event sender(who's user id is matched with this userId) ### */
    })
    /* ### End: Get the quick message view notification from the reciever ### */

    /* ### Start: Get the logoutNotification from the user(careator_dashboardCtrl.js) ### */
    socket.on('comm_logout', function (data) {
        console.log("comm_logout-->: " + JSON.stringify(data));
        var db = mongoConfig.getDb();
        console.log("db: " + db);
        careatorMaster = db.collection("careatorMaster");
        var queryObj = {
            "_id": ObjectId(data.userId)
        }
        console.log("queryObj: " + JSON.stringify(queryObj));
        console.log("chatHistory: " + chatHistory);
        careatorMaster.update(queryObj, { $set: { "logout": "done","login":"notDone" } }, function (err, updateData) {
            if (err) {
                console.log("errr: " + JSON.stringify(err));
            }
            else {
                console.log("updateData: " + JSON.stringify(updateData));
                io.sockets.emit('comm_logoutNotifyToUserById', { "userId": data.userId, "email": data.email, "sessionURL": data.sessionURL }) /* ### Note: Send quick message view notification to event sender(who's user id is matched with this userId) ### */
            }
        })
        
    })
    /* ### End: Get the logoutNotification from the user(careator_dashboardCtrl.js) ### */

    console.log("<--connection Ended");
});






