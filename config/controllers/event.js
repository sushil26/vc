var db = require('../dbConfig.js').getDb();
var user = db.collection('user');/* ### Teacher collection  ### */
var event = db.collection('event');
var quickMessage = db.collection('quickMessage');
//var student = require("./schemas/student.js");
var stud = db.collection('students');/* ### student collection  ### */
var general = require('../general.js');
var ObjectId = require('mongodb').ObjectID;

var bodyParser = require('body-parser');


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

// var io = require('socket.io');

module.exports.getToDate = function (req, res) {
    console.log("getToDate-->");
    var date = new Date();
    console.log("***date: " + date);
    var responseData = {
        "status": true,
        "message": "date get successfully",
        "data": { "date": date }
    }
    console.log("responseData: " + JSON.stringify(responseData));
    res.status(200).send(responseData);
    console.log("<--getToDate");
}
module.exports.eventSend = function (req, res) {
    console.log("eventSend-->");
    var responseData;
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
            "start": req.body.start,
            "end": req.body.end,
            "startAt": req.body.startAt,
            "endAt": req.body.endAt,
            "primColor": req.body.primColor,
            "url": req.body.url,
            "receiverName": req.body.receiverName,
            "receiverId": req.body.receiverId,
            "receiverMN": req.body.receiverMN,
            "remoteCalendarId": req.body.remoteCalendarId,
            "student_cs": req.body.student_cs,
            "student_id": req.body.student_id,
            "student_Name": req.body.student_Name,
            "notificationNeed": 'yes',
            "password": password
        }
        console.log("userData: " + JSON.stringify(userData));

        event.insertOne(userData, function (err, data) {
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
                io.emit('eventUpdated', { "id": req.body.remoteCalendarId, "remoteId": req.body.remoteCalendarId }); /* ### Note: Emit message to upcomingEventCtrl.js ### */
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

module.exports.eventNotificationOff = function (req, res) {
    console.log("eventNotificationOff-->");
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
        event.update(queryId, { $set: obj }, function (err, data) {
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
}
module.exports.eventGet = function (req, res) {
    console.log("*getEvent-->");
    var responseData;
    console.log("req.params.id: " + req.params.id);

    if (general.emptyCheck(req.params.id)) {
        event.find({ $or: [{ "userId": req.params.id }, { "remoteCalendarId": req.params.id }] }).sort({ "$natural": -1 }).toArray(function (err, listOfevents) {
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

module.exports.getEventById = function (req, res) {
    console.log("EventGetById-->");
    var responseData;

    console.log("req.params.id: " + req.params.id);

    if (general.emptyCheck(req.params.id)) {
        var id = {
            "_id": ObjectId(req.params.id)
        }
        event.find(id).toArray(function (err, data) {
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

module.exports.updateEventMOM = function (req, res) {
    console.log("updateEventMOM-->");
    var responseData;

    console.log("req.params.eventId: " + req.params.eventId);

    if (general.emptyCheck(req.params.eventId)) {
        var id = {
            "_id": ObjectId(req.params.eventId)
        }
        var updateData;
        if (req.body.momCreatedBy == 'teacher') {
            console.log("req.body.momCreatedBy: " + req.body.momCreatedBy);
            updateData = {
                "teacher_mom": req.body.mom,
            }
        }
        else if (req.body.momCreatedBy == 'parent') {
            updateData = {
                "parent_mom": req.body.mom,
            }
        }
        event.update(id, { $set: updateData }), function (err, data) {
            console.log("data: " + JSON.stringify(data));
            if (err) {
                responseData = {
                    status: false,
                    message: "Failed to Update MoM Data",
                    data: data
                };
                res.status(400).send(responseData);
            } else {
                responseData = {
                    status: true,
                    message: "MoM Updated successfully",
                    data: data
                };
                res.status(200).send(responseData);
            }
        }
    }
    else {
        console.log("Epty value found");
        responseData = {
            status: false,
            message: "there is no eventId to update"
        };
        res.status(400).send(responseData);
    }


    console.log("<--updateEventMOM");
}

module.exports.deleteEvent = function (req, res) {
    console.log("deleteEvent-->");
    if (general.emptyCheck(req.body.id)) {
        var id = {
            "_id": ObjectId(req.body.id)
        }
        event.remove(id, function (err, data) {
            if (err) {
                console.log("Failed to delete  data");
                responseData = {
                    "status": false,
                    "message": "Failed to delete",
                    "data": data
                }
                res.status(400).send(responseData);
            }
            else {
                responseData = {
                    "status": true,
                    "message": "Deleted Sucessfully",
                    "data": data
                }
                res.status(200).send(responseData);
            }
        })


    }
    console.log("<--deleteEvent");

}

module.exports.parentCredential = function (req, res) {
    console.log("parentCredential-->");
    var responseData;
    if (general.emptyCheck(req.body.url) && general.emptyCheck(req.body.pswd)) {

        event.find({ 'url': req.body.url }).toArray(function (err, data) {
            if (data.length > 0) {
                console.log("data[0].password: " + data[0].password);
                console.log("data[0].url: " + data[0].url);
                console.log("req.body.pswd: " + req.body.pswd);
                if (data[0].password == req.body.pswd) {
                    console.log("Successfully Logged in");
                    responseData = {
                        "status": true,
                        "message": "Login Successfully",
                        "data": data[0]
                    }
                    res.status(200).send(responseData);
                }
                else {
                    console.log("Password is not matching");
                    responseData = {
                        "status": true,
                        "message": "Password is not matching",
                        "data": data[0]
                    }
                    res.status(200).send(responseData);

                }
            }
            else {
                responseData = {
                    "status": false,
                    "errorCode": "No Match",
                    "message": "URL is not authorized"
                }
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
    console.log("<--parentCredential");
}

module.exports.getStudListForCS = function (req, res) {
    console.log("getStudListForCS-->");
    //console.log("req.params.: "+JSON.stringify(req.params.cssRef));
    console.log("class: " + req.params.clas + "section: " + req.params.section);
    if (general.emptyCheck(req.params.schoolName) && general.emptyCheck(req.params.clas) && general.emptyCheck(req.params.section)) {
        var obj = {
            "schoolName": req.params.schoolName,
            "cs": [{
                "class": req.params.clas,
                "section": req.params.section
            }]
        };
        console.log("obj: " + JSON.stringify(obj));
        // var id = {
        //     "userId": req.params.id
        // }
        stud.find(obj).toArray(function (err, data) {
            console.log("data: " + JSON.stringify(data));
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
                    "data": data
                }

                console.log("data:" + JSON.stringify(data));

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
    console.log("<--getStudListForCS");

}

module.exports.getTeacherListForCS = function (req, res) {
    console.log("getTeacherListForCS-->");
    //console.log("req.params.css: "+JSON.stringify(req.params.cssRef));
    console.log("class: " + req.params.clas + "section: " + req.params.section);
    if (general.emptyCheck(req.params.schoolName) && general.emptyCheck(req.params.clas) && general.emptyCheck(req.params.section)) {
        console.log("value not empty");
        var clas = req.params.clas;
        var section = req.params.section;
        var schoolName = req.params.schoolName;
        // var id = {
        //     "userId": req.params.id
        // }
        user.find({ "css": { $elemMatch: { "class": clas, "section": section } } }, { "schoolName": schoolName }).toArray(function (err, data) {
            //console.log("getTeacherListForCS data: " + JSON.stringify(data));
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
                    "message": "Data Captured Successfully",
                    "data": data
                }

                console.log("data:" + JSON.stringify(data));

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
    console.log("<--getTeacherListForCS");

}

module.exports.getStudentAttendance = function (req, res) {
    console.log("getStudentAttendance-->");
    if (general.emptyCheck(req.params.id)) {
        stud.find({ "_id": ObjectId(req.params.id) }).toArray(function (err, data) {
            console.log("data: " + JSON.stringify(data));
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
                    "data": data
                }

                console.log("data:" + JSON.stringify(data));

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
    console.log("<--getStudentAttendance");
}

module.exports.eventReSchedule = function (req, res) {
    console.log("eventReSchedule-->");
    console.log("requested updated id: " + req.params.id);
    var responseData;
    var obj = {
        "title": req.body.title,
        "reason": req.body.reason,
        "start": req.body.start,
        "end": req.body.end,
        "startAt": req.body.startAt,
        "endAt": req.body.endAt
    }
    console.log("updating value: " + JSON.stringify(obj));
    var id = {
        "_id": ObjectId(req.params.id)
    }
    //    var id = req.params.id;
    //     console.log("id: " + id);
    // console.log("ObjectId(req.params.id): " +ObjectId(id));

    if (general.emptyCheck(req.params.id)) {
        console.log("No Empty");
        event.update(id, { $set: obj }, { multi: true }, function (err, data) {
            console.log("data: " + JSON.stringify(data));

            if (err) {
                responseData = {
                    status: false,
                    message: "Failed to update",
                    data: data
                };
                res.status(400).send(responseData);
            } else {
                // io.emit('eventUpdated', { "id": req.body.remoteCalendarId, "remoteId": req.body.remoteCalendarId });
                responseData = {
                    status: true,
                    message: "Rescheduled successfully",
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
    console.log("<--eventReSchedule");
}

