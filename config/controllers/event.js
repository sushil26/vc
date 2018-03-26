var db = require('../dbConfig.js').getDb();
var event = db.collection('event');
var general = require('../general.js');
var ObjectId = require('mongodb').ObjectID;

var bodyParser = require('body-parser');

var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'logeswari.careator@gmail.com',
        pass: 'iloveindia'
    }
});
module.exports.eventSend = function (req, res) {
    console.log("eventSend-->");
    var responseData;
    if (general.emptyCheck(req.body.studName) && general.emptyCheck(req.body.studId) && general.emptyCheck(req.body.reason) && general.emptyCheck(req.body.email)) {
        var password = 'abc';
        var userData = {
            "reason": req.body.reason,
            "studName": req.body.studName,
            "studId": req.body.studId,
            "email": req.body.email,
            "start": req.body.start,
            "end": req.body.end,
            "startAt": req.body.startAt,
            "endAt": req.body.endAt,
            "primColor": req.body.primColor,
            "url": req.body.url,
            "password": 'password'

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


                var mailOptions = {
                    from: "logeswari.careator@gmail.com",
                    to: req.body.email,
                    subject: "Regarding School Meeting",
                    html: "<html><head><p><b>Dear Parents, </b></p><p>Please note, you have to attend meeting regarding <b>" + req.body.reason + " </b>please open the below link at sharp " + req.body.start + " to +" + req.body.endAt + " +</p><p>Here your link and password for meeting " + req.body.url + " Password: " + password + "</p><p>Regards</p><p><b>Careator Technologies Pvt. Ltd</b></p></head><body></body></html>"
                };
                console.log("mailOptions: " + JSON.stringify(mailOptions));

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        responseData = {
                            "status": true,
                            "errorCode": 200,
                            "message": "Registeration Successfull and Failed to send mail",
                            "data": data
                        }
                        res.status(200).send(responseData);


                    } else {
                        console.log('Email sent: ' + info.response);
                        responseData = {
                            "status": true,
                            "errorCode": 200,
                            "message": "Registeration Successfull and sent mail",

                            "data": data
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

module.exports.eventGet = function (req, res) {
    console.log("getEvent-->");
    var responseData;
    event.find().toArray(function (err, listOfevents) {
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
        
        event.find({'url':req.body.url}).toArray(function (err, data) {
            if (data.length > 0) {
                if (data[0].password == req.body.pswd) {
                    console.log("Successfully Logged in");
                    responseData = {
                        "status": true,
                        "message": "Login Successfully",
                        "data": data[0]
                    }
                    res.status(200).send(responseData);
                }
                else{
                    console.log("Password is not matching");
                    responseData = {
                        "status": true,
                        "message": "Password is not matching",
                        "data": data[0]
                    }
                    res.status(200).send(responseData);

                }
            }
            else{
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