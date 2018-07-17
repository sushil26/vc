var db = require("../dbConfig.js").getDb();
var general = require("../general.js");
var bodyParser = require("body-parser");
var record = db.collection("record"); /* ### Teacher collection  ### */
var ObjectId = require("mongodb").ObjectID;
var nodemailer = require("nodemailer");
var createdDate = new Date();
var randomstring = require("randomstring");
var requireFromUrl = require('require-from-url');
var GridStore = require('mongodb').GridStore;
var streamifier = require('streamifier');
var base64 = require('file-base64');
var event = db.collection('event');
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
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vc');
var conn = mongoose.connection;
var Grid = require('gridfs-stream');
var fs = require('fs');
const path = require('path');
const ABSPATH = path.dirname(process.mainModule.filename); // Absolute path to our app directory
Grid.mongo = mongoose.mongo;

const recordingDirectory = process.cwd() + '/public/Recording/';

// var gfs = Grid(db,mongo);
// var gridfs = require('mongoose-gridfs')({
//     collection: 'attachments',
//     model: 'Attachment',
//     mongooseConnection: db
// });

//obtain a model
//Attachment = gridfs.model;

module.exports.pswdCheck = function (req, res) {
    console.log("pswdCheck-->");
    console.log("req.body.password: " + req.body.password);
    var password = req.body.password;
    var careatorEmail = req.body.careatorEmail;
    if (general.emptyCheck(password) && general.emptyCheck(careatorEmail)) {
        var obj = {
            "email": careatorEmail
        }
        console.log("obj: " + JSON.stringify(obj));
        record.find(obj).toArray(function (err, findData) {
            console.log("findData: " + JSON.stringify(findData));
            if (err) {
                responseData = {
                    status: false,
                    message: "Process failed"
                };
                res.status(400).send(responseData);
            }
            else {
                if (findData.length > 0) {
                    if (findData[0].password == password) {
                        responseData = {
                            status: true,
                            message: "Login Successfully"
                        };
                        res.status(200).send(responseData);
                    }
                    else {
                        responseData = {
                            status: false,
                            message: "Password is wrong"
                        };
                        res.status(400).send(responseData);
                    }
                }
                else {
                    responseData = {
                        status: false,
                        message: "Email ID is not valid"
                    };
                    res.status(400).send(responseData);
                }
            }
        })
    }
    else {
        responseData = {
            status: false,
            message: "Empty value found"
        };
        res.status(400).send(responseData);
    }
    console.log("<--pswdCheck");
}
module.exports.pswdGenerate = function (req, res) {
    console.log("pswdGenerate-->");
    console.log("req.body.careatorEmail: " + req.body.careatorEmail);
    var email = req.body.careatorEmail;
    var emailSplit = email.split('@');
    var password = randomstring.generate(7);
    var responseData;

    if (general.emptyCheck(req.body.careatorEmail)) {
        if (emailSplit[1] == 'careator.com') {
            var obj = {
                "email": email,
                "password": password
            }
            record.find({ "email": email }).toArray(function (err, findData) {
                if (findData.length > 0) {
                    record.update({ "email": email }, { $set: { "password": password } }, function (err, data) {
                        if (err) {
                            responseData = {
                                status: true,
                                errorCode: 200,
                                message: "Process not successful"
                            };
                            res.status(200).send(responseData);
                        }
                        else {
                            var mailOptions = {
                                from: "info@vc4all.in",
                                to: email,
                                subject: 'VC4ALL Credential',
                                html: "<table style='border:10px solid gainsboro;'><thead style='background-image: linear-gradient(to bottom, #00BCD4 0%, #00bcd40f 100%);'><tr><th><h2>Greetings from VC4ALL</h2></th></tr></thead><tfoot style=background:#00bcd4;color:white;><tr><td style=padding:15px;><p><p>Regards</p><b>Careator Technologies Pvt. Ltd</b></p></td></tr></tfoot><tbody><tr><td><b>Dear Careator Employee,</b></td></tr><tr><td>Please note, Your email Id is verified successfully, you can access the below link by using given password.<p style=background:gainsboro;>Password: " + password + "</p></td></tr></tbody></table>"

                                // "<html><body><p><b>Dear Careator Employee, </b></p><p>Please note, Your email Id is verified successfully,  you can access the below link by using given password.<p>Password: "+password+"</p></p><p>Regards</p><p><b>Careator Technologies Pvt. Ltd</b></p></body></html>"

                            };
                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                    responseData = {
                                        status: true,
                                        errorCode: 200,
                                        message: "insert Successfull and Failed to send mail",
                                        data: data
                                    };
                                    res.status(200).send(responseData);
                                } else {
                                    console.log("Email sent: " + info.response);
                                    responseData = {
                                        status: true,
                                        errorCode: 200,
                                        message: "Successfully mail sent",
                                        data: data
                                    };
                                    res.status(200).send(responseData);
                                }
                            });
                        }
                    })

                }
                else {
                    record.insert(obj, function (err, data) {
                        if (err) {
                            responseData = {
                                status: true,
                                errorCode: 200,
                                message: "Process not successful"
                            };
                            res.status(200).send(responseData);
                        }
                        else {
                            var mailOptions = {
                                from: "info@vc4all.in",
                                to: email,
                                subject: 'VC4ALL Credential',
                                html: "<table style='border:10px solid gainsboro;'><thead style='background-image: linear-gradient(to bottom, #00BCD4 0%, #00bcd40f 100%);'><tr><th><h2>Greetings from VC4ALL</h2></th></tr></thead><tfoot style=background:#00bcd4;color:white;><tr><td style=padding:15px;><p><p>Regards</p><b>Careator Technologies Pvt. Ltd</b></p></td></tr></tfoot><tbody><tr><td><b>Dear Careator Employee,</b></td></tr><tr><td>Please note, Your email Id is verified successfully, you can access the below link by using given password.<p style=background:gainsboro;>Password: " + password + "</p></td></tr></tbody></table>"
                            };
                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                    responseData = {
                                        status: true,
                                        errorCode: 200,
                                        message: "insert Successfull and Failed to send mail",
                                        data: data
                                    };
                                    res.status(200).send(responseData);
                                } else {
                                    console.log("Email sent: " + info.response);
                                    responseData = {
                                        status: true,
                                        errorCode: 200,
                                        message: "Successfully mail sent",
                                        data: data
                                    };
                                    res.status(200).send(responseData);
                                }
                            });
                        }
                    })
                }

            })

        }
        else {
            responseData = {
                status: false,
                message: "Email id is not valid"
            };
            res.status(400).send(responseData);
        }
    }
    else {
        responseData = {
            status: false,
            message: "Empty value found"
        };
        res.status(400).send(responseData);
    }
    console.log("<--pswdGenerate");
}
module.exports.emailInvite = function (req, res) {
    console.log("careator email Invite-->");
    var mailOptions = {
        from: "info@vc4all.in",
        to: req.body.email,
        subject: "Regarding Instance Meeting",
        html: "<table style='border:10px solid gainsboro;'><thead style='background-image: linear-gradient(to bottom, #00BCD4 0%, #00bcd40f 100%);'><tr><th><h2>Greetings from VC4ALL</h2></th></tr></thead><tfoot style=background:#00bcd4;color:white;><tr><td style=padding:15px;><p><p>Regards</p><b>Careator Technologies Pvt. Ltd</b></p></td></tr></tfoot><tbody><tr><td><b>Dear Team,</b></td></tr><tr><td> Please note, you have to attend meeting right now, please open the below link.<p style=background:gainsboro;><p>Here your link <a href=" + req.body.url + ">" + req.body.url + "</a></p></td></tr></tbody></table>"

        //html:"<html><head><p><b>Dear Team, </b></p><p>Please note, you have to attend meeting right now, please open the below link.<p>Here your link <a href=" + req.body.url + ">" + req.body.url + "</a> </p><p>Regards</p><p><b>Careator Technologies Pvt. Ltd</b></p></head><body></body></html>"
    };
    console.log("mailOptions: " + JSON.stringify(mailOptions));

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            responseData = {
                status: false,
                message: "Failed to send mail",
            };
            res.status(400).send(responseData);
        } else {
            console.log("Email sent: " + info.response);
            responseData = {
                status: true,
                message: "Successfull sent mail",
            };
            res.status(200).send(responseData);
        }
    });

}
var blobs = [];
module.exports.recordVideo = function (req, res) {
    console.log("recordVideo-->");
    var videoBase64 = req.body.base64data;

    console.log("req.body.eventId: " + req.body.eventId)
    // if (videoBase64 == "stop") {
        console.log("stop started-->");
        console.log("blobs[req.body.eventId]: " + JSON.stringify(blobs[req.body.eventId]));
        var gfs = Grid(conn.db);
        var writeStream = gfs.createWriteStream({
            filename: 'vcRecord.mpg'
        });
        // base64.encode(req.files.data, function (err, base64String) {
        //     console.log(base64String);
        //     var response = fs.createReadStream(base64String).pipe(writeStream);  // returns response which is having all information regarding saved byte string
        //     var lastInsertedFileId = response._store.fileId;  // now you can store it into another document for future use.
        //     console.log(lastInsertedFileId);
        // });
        var getValue = videoBase64;
        var byte_string = videoBase64.substr(23);//The base64 has a imageURL
        //var buffer = new Buffer(byte_string);   //new Buffer(b64string, 'base64');  you can use base64 encoding with creating new buffer string
        var buffer = new Buffer(getValue);   //new Buffer(b64string, 'base64');  you can use base64 encoding with creating new buffer string
        var response = streamifier.createReadStream(buffer).pipe(writeStream);  // returns response which is having all information regarding saved byte string
        var lastInsertedFileId = response._store.fileId;  // now you can store it into another document for future use.
        console.log(lastInsertedFileId);

        writeStream.on('close', function (file) {
            console.log(file.filename + "written to db");
            var responseData;
            console.log("req.body.id: " + req.body.id);
            // if (general.emptyCheck(req.body.id)) {
            var queryId = {
                "_id": ObjectId(req.body.eventId)
            }
            console.log("queryId: " + JSON.stringify(queryId));
            var setData = {
                "vcRecordId": lastInsertedFileId
            }
            console.log("setData: " + JSON.stringify(setData));
            event.update({ "_id": ObjectId(req.body.eventId), 'vcRecordId': { $exists: false } }, { $set: { "vcRecordId": lastInsertedFileId } }, function (err, data) {
                var io = req.app.get('socketio');
                io.emit('eventUpdatedForHistory', {});
                console.log("data: " + JSON.stringify(data));
            })
        })
        responseData = {
            status: true,
            errorCode: 200,
            message: "insert Successfull and Failed to send mail",
        };
        res.status(200).send(responseData);

    //}
    // else {
    //     console.log("blobs.indexOf(req.body.eventId): " + blobs.indexOf(req.body.eventId));
    //     console.log(" videoBase64.substr(23): " + videoBase64);
    //     var byte_string = videoBase64.substr(23);//The base64 has a imageURL
    //     if (blobs.valueOf(req.body.eventId) < 0) {
    //         blobs[req.body.eventId] = byte_string;
    //     }
    //     else {
    //         var str = blobs[req.body.eventId];
    //         blobs[req.body.eventId] = str + byte_string;
    //     }
    //     //blobs[req.body.eventId].concate(videoBase64);


       
    

    console.log("<--recordVideo");
}
module.exports.getRecordVideo = function (req, res) {
    console.log("getRecordVideo-->");

    var gfs = Grid(conn.db);
    var output = '';
    var readStream = gfs.createReadStream({
        "_id": req.params.id // this id was stored in db when inserted a video stream above
    });
    readStream.on("data", function (chunk) {
        output += chunk;
    });

    // base64.decode(output, function (err, output) {
    //     console.log('output');
    //     // dump contents to console when complete

    // });
    readStream.on("end", function () {
        console.log("Final Output");
        responseData = {
            status: true,
            message: "get successful",
            data: output
        };
        res.status(200).send(responseData);
        //console.log(output);

    });




    console.log("<--getRecordVideo");
}

// module.exports.streamGridFile = function (req, res, GridFile) {
//     if (req.headers['range']) {

//         // Range request, partialle stream the file
//         console.log('Range Reuqest');
//         var parts = req.headers['range'].replace(/bytes=/, "").split("-");
//         var partialstart = parts[0];
//         var partialend = parts[1];

//         var start = parseInt(partialstart, 10);
//         var end = partialend ? parseInt(partialend, 10) : GridFile.length - 1;
//         var chunksize = (end - start) + 1;

//         console.log('Range ', start, '-', end);

//         res.writeHead(206, {
//             'Content-Range': 'bytes ' + start + '-' + end + '/' + GridFile.length,
//             'Accept-Ranges': 'bytes',
//             'Content-Length': chunksize,
//             'Content-Type': GridFile.contentType
//         });
//         // Set filepointer
//         GridFile.seek(start, function () {
//             // get GridFile stream
//             var stream = GridFile.stream(true);

//             // write to response
//             stream.on('data', function (buff) {
//                 // count data to abort streaming if range-end is reached
//                 // perhaps theres a better way?
//                 start += buff.length;
//                 if (start >= end) {
//                     // enough data send, abort
//                     GridFile.close();
//                     res.end();
//                 } else {
//                     res.write(buff);
//                 }
//             });
//         });
//     } else {

//         // stream back whole file
//         console.log('No Range Request');
//         res.header('Content-Type', GridFile.contentType);
//         res.header('Content-Length', GridFile.length);
//         var stream = GridFile.stream(true);
//         stream.pipe(res);
//     }

// }

