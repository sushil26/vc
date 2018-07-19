var db = require('../dbConfig.js').getDb();


var quickMessage = db.collection('quickMessage');
//var student = require("./schemas/student.js");
var general = require('../general.js');
var ObjectId = require('mongodb').ObjectID;
var bodyParser = require('body-parser');
//var io = req.app.get('socketio');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: "godaddy",
    auth: {
        user: "info@vc4all.in",
        pass: "ctpl@123"
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports.quickMsgSend = function (req, res) {
    console.log("quickMsgSend-->");
    var responseData;
    console.log("req.body.userId: " + req.body.userId+" req.body.remoteCalendarId: " + req.body.remoteCalendarId);
    console.log("req.body.senderName: " + req.body.senderName);
    console.log("req.body.senderId: " + req.body.senderId);
    console.log("req.body.reason: " + req.body.reason);
    console.log("req.body.receiverEmail: " + req.body.receiverEmail);
    if (general.emptyCheck(req.body.senderName) && general.emptyCheck(req.body.senderId) && general.emptyCheck(req.body.reason) && general.emptyCheck(req.body.receiverEmail)) {
        var password = 'abc';
        var userData = {
            "userId": req.body.userId,
            "senderLoginType": req.body.senderLoginType,
            "title": req.body.title,
            "reason": req.body.reason,
            "studUserId": req.body.studUserId,
            "senderName": req.body.senderName,
            "senderId": req.body.senderId,
            "senderMN": req.body.senderMN,
            "receiverEmail": req.body.receiverEmail,
            "date": req.body.date,
            "primColor": req.body.primColor,
            "receiverName": req.body.receiverName,
            "receiverId": req.body.receiverId,
            "receiverMN": req.body.receiverMN,
            "remoteCalendarId": req.body.remoteCalendarId,
            "student_cs": req.body.student_cs,
            "student_id": req.body.student_id,
            "student_Name": req.body.student_Name,
            "messageType": "single",
            "notificationNeed": "yes",
            "password": password
        }
        console.log("userData: " + JSON.stringify(userData));

        quickMessage.insertOne(userData, function (err, data) {
            console.log("data: " + JSON.stringify(data));
            if (err) {
                responseData = {
                    "status": false,
                    "message": "Failed to Register",
                    "data": data
                }
                res.status(400).send(responseData);
            }
            else {
                var io = req.app.get('socketio');
                io.emit('quickMsg_updated',{"id":req.body.userId, "remoteId":req.body.remoteCalendarId});
                var mailOptions = {
                    from: "info@vc4all.in",
                    to: req.body.receiverEmail,
                    subject: "Regarding School Meeting",
                    html: "<table style='border:10px solid gainsboro;'><thead style='background-image: linear-gradient(to bottom, #00BCD4 0%, #00bcd40f 100%);'><tr><th><h2>Greetings from VC4ALL</h2></th></tr></thead><tfoot style=background:#00bcd4;color:white;><tr><td style=padding:15px;><p><p>Regards</p><b>Careator Technologies Pvt. Ltd</b></p></td></tr></tfoot><tbody><tr><td><b>Dear Parents,</b></td></tr><tr><td><p>Please note, you have to attend meeting regarding <b>" + req.body.reason + " </b>please open the below link at sharp " + req.body.startAt + " to " + req.body.endAt + "</p><p style=background:gainsboro;>Here your link and password for meeting <a href=" + req.body.url + ">" + req.body.url + "</a> and Password: " + password + "</p></td></tr></tbody></table>"
                    // html: "<html><head><p><b>Dear Parents, </b></p><p>Please note, you have to attend meeting regarding <b>" + req.body.reason + " </b>please open the below link at sharp " + req.body.startAt + " to " + req.body.endAt + "</p><p style=background:gainsboro;>Here your link and password for meeting <a href=" + req.body.url + ">" + req.body.url + "</a> and Password: " + password + "</p><p>Regards</p><p><b>Careator Technologies Pvt. Ltd</b></p></head><body></body></html>"
                };
                console.log("mailOptions: " + JSON.stringify(mailOptions));
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        responseData = {
                            "status": true,
                            "errorCode": 200,
                            "message": "Registeration Successfull and Failed to send mail",
                            "data": userData
                        }
                        res.status(200).send(responseData);
                    } else {
                        console.log('Email sent: ' + info.response);
                        responseData = {
                            "status": true,
                            "errorCode": 200,
                            "message": "Registeration Successfull and sent mail",

                            "data": userData
                        }
                        res.status(200).send(responseData);
                    }

                });
            }
        })
    }
    else {
        console.log("Epty value found");
        responseData = {
            "status": false,
            "message": "empty value found",
            "data": userData
        }
        res.status(400).send(responseData);
    }
}
module.exports.quickMsgNotificationOff = function (req, res) {
    console.log("quickMsgNotificationOff-->");
    var responseData;
    console.log("req.body.id: " + req.body.id);
    if (general.emptyCheck(req.body.id)) {
        var obj = {
            "notificationNeed": "no"
        }
        var queryId = {
            "_id": ObjectId(req.body.id)
        }
        console.log("queryId: " + JSON.stringify(queryId));
        console.log("obj: " + JSON.stringify(obj));
        quickMessage.update(queryId, { $set: obj },function (err, data) {
            console.log("data: " + JSON.stringify(data));
            if (err) {
                responseData = {
                    status: false,
                    message: "Failed to get Data",
                    data: data
                };
                res.status(400).send(responseData);
            } else {
                responseData = {
                    status: true,
                    message: "Successfully Updated",
                    data: data
                };
                res.status(200).send(responseData);
            }
        })
    }
    else {
        console.log("Epty value found");
        responseData = {
            "status": false,
            "message": "empty value found",
            "data": userData
        }
        res.status(400).send(responseData);
    }
    console.log("<--quickMsgNotificationOff");
}
module.exports.quickMsgGet = function (req, res) {
    console.log("getEvent-->");
    var responseData;
    console.log("req.params.id: " + req.params.id);

    if (general.emptyCheck(req.params.id)) {
        quickMessage.find({ $or: [{ "userId": req.params.id }, { "remoteCalendarId": req.params.id }] }).sort({ "$natural": -1 }).toArray(function (err, listOfevents) {
            // console.log("listOfevents: " + JSON.stringify(listOfevents))
            if (err) {

                responseData = {
                    "status": false,
                    "message": "Failed to get Data",
                    "data": data
                }
                res.status(400).send(responseData);
            }
            else {
                responseData = {
                    "status": true,
                    "message": "Registeration Successfull",
                    "data": listOfevents
                }
                res.status(200).send(responseData);
            }
        })
    }
    else {
        console.log("Epty value found");
        responseData = {
            "status": false,
            "message": "there is no userId to find",

        }
        res.status(400).send(responseData);
    }

}

module.exports.quickMsgGetForStud = function (req, res) {
    console.log("quickMsgGetForStud-->");
    var responseData;
    console.log("req.params.id: " + req.params.id);
    console.log("req.params.clas: " + req.params.clas);
    console.log("req.params.section: " + req.params.section);
    var cs = [{ "class": req.params.clas, "section": req.params.section }];
    if (general.emptyCheck(req.params.id) && general.emptyCheck(req.params.clas) && general.emptyCheck(req.params.section)) {
        quickMessage.find({ $or: [{ "userId": req.params.id }, { "remoteCalendarId": req.params.id }, { "student_cs": cs }] }).sort({ "$natural": -1 }).toArray(function (err, listOfevents) {
            // console.log("listOfevents: " + JSON.stringify(listOfevents))
            if (err) {
                responseData = {
                    "status": false,
                    "message": "Failed to get Data",
                    "data": data
                }
                res.status(400).send(responseData);
            }
            else {
                responseData = {
                    "status": true,
                    "message": "Registeration Successfull",
                    "data": listOfevents
                }
                res.status(200).send(responseData);
            }
        })
    }
    else {
        console.log("Epty value found");
        responseData = {
            "status": false,
            "message": "there is no userId to find",
        }
        res.status(400).send(responseData);
    }
}

module.exports.getQuickMsgById = function (req, res) {
    console.log("EventGetById-->");
    var responseData;

    console.log("req.params.id: " + req.params.id);

    if (general.emptyCheck(req.params.id)) {
        var id = {
            "_id": ObjectId(req.params.id)
        }
        quickMessage.find(id).toArray(function (err, data) {
            console.log("data: " + JSON.stringify(data));

            if (err) {
                responseData = {
                    status: false,
                    message: "Failed to get Data",
                    data: data
                };
                res.status(400).send(responseData);
            } else {
                responseData = {
                    status: true,
                    message: "get data successfully",
                    data: data
                };

                res.status(200).send(responseData);
            }
        })
    }
    else {
        console.log("Epty value found");
        responseData = {
            status: false,
            message: "there is no userId to find"
        };
        res.status(400).send(responseData);
    }


    console.log("<--EventGetById");
}

module.exports.bulkEmail_quickMsg = function (req, res) {
    console.log("bulkEmail_quickMsg-->");
    var responseData;

    console.log("quickMsgSend-->");
    var responseData;
    console.log("req.body.senderName: " + req.body.senderName);
    console.log("req.body.senderId: " + req.body.senderId);
    console.log("req.body.reason: " + req.body.reason);
    if (general.emptyCheck(req.body.senderName) && general.emptyCheck(req.body.senderId) && general.emptyCheck(req.body.reason)) {
        var userData = {
            "userId": req.body.userId,
            "senderLoginType": req.body.senderLoginType,
            "title": req.body.title,
            "reason": req.body.reason,
            "senderName": req.body.senderName,
            "senderId": req.body.senderId,
            "senderMN": req.body.senderMN,
            "receiverEmail": req.body.receiverEmail,
            "date": req.body.date,
            "primColor": req.body.primColor,
            "messageType": req.body.messageType,
            "student_cs": req.body.cs,
            "schoolName": req.body.schoolName
        }
        console.log("userData: " + JSON.stringify(userData));
        var receiverEmail = req.body.receiverEmail;
        quickMessage.insertOne(userData, function (err, data) {
            console.log("data: " + JSON.stringify(data));
            if (err) {
                responseData = {
                    "status": false,
                    "message": "Failed to Register",
                    "data": data
                }
                res.status(400).send(responseData);
            }
            else {

                receiverEmail.forEach(function (to, i, array) {
                    var mailOptions = {
                        from: "info@vc4all.in",
                        to: to,
                        subject: "Regarding School Meeting",
                        html: "<table style='border:10px solid gainsboro;'><thead style='background-image: linear-gradient(to bottom, #00BCD4 0%, #00bcd40f 100%);'><tr><th><h2>Greetings from VC4ALL</h2></th></tr></thead><tfoot style=background:#00bcd4;color:white;><tr><td style=padding:15px;><p><p>Regards</p><b>Careator Technologies Pvt. Ltd</b></p></td></tr></tfoot><tbody><tr><td><b>Dear Parents,</b></td></tr><tr><td><p>Please note, this is a quick message regarding <b>" + req.body.reason + " </b></p><p style=background:gainsboro;></p></td></tr></tbody></table>"
                        // html: "<html><head><p><b>Dear Parents, </b></p><p>Please note, you have to attend meeting regarding <b>" + req.body.reason + " </b>please open the below link at sharp " + req.body.startAt + " to " + req.body.endAt + "</p><p style=background:gainsboro;>Here your link and password for meeting <a href=" + req.body.url + ">" + req.body.url + "</a> and Password: " + password + "</p><p>Regards</p><p><b>Careator Technologies Pvt. Ltd</b></p></head><body></body></html>"
                    };
                    console.log("mailOptions: " + JSON.stringify(mailOptions));
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                            responseData = {
                                "status": true,
                                "errorCode": 200,
                                "message": "Registeration Successfull and Failed to send mail",
                                "data": userData
                            }
                            res.status(200).send(responseData);
                        } else {
                            console.log('Email sent: ' + info.response);
                            responseData = {
                                "status": true,
                                "errorCode": 200,
                                "message": "Registeration Successfull and sent mail",

                                "data": userData
                            }
                            res.status(200).send(responseData);
                        }

                    });
                })
            }
        })
    }
    else {
        console.log("Epty value found");
        responseData = {
            "status": false,
            "message": "empty value found",
            "data": userData
        }
        res.status(400).send(responseData);
    }

}



