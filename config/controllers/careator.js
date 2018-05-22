var db = require("../dbConfig.js").getDb();
var general = require("../general.js");
var bodyParser = require("body-parser");
var careatorEmp = db.collection("careatorEmp"); /* ### Teacher collection  ### */
var ObjectId = require("mongodb").ObjectID;
var nodemailer = require("nodemailer");
var createdDate = new Date();
var randomstring = require("randomstring");


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
        careatorEmp.find(obj).toArray(function (err, findData) {
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
            careatorEmp.find({ "email": email }).toArray(function (err, findData) {
                if (findData.length > 0) {
                    careatorEmp.update({ "email": email }, { $set: { "password": password } }, function (err, data) {
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
                                subject: 'VC4ALL Credentiall',
                                text: "Your email Id is verified successfully, you can access the link https://norecruits.com/careator by using password: " + password
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
                    careatorEmp.insert(obj, function (err, data) {
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
                                subject: 'VC4ALL Credentiall',
                                text: "Your email Id is verified successfully, you can access the link https://norecruits.com/careator by using password: " + password
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
    console.log("emailInvite-->");
    var mailOptions = {
        from: "info@vc4all.in",
        to: req.body.email,
        subject: "Regarding Instance Meeting",
        html:
            "<html><head><p><b>Dear Parents, </b></p><p>Please note, you have to attend meeting right now, please open the below link.<p>Here your link <a href=" + req.body.url + ">" + req.body.url + "</a> </p><p>Regards</p><p><b>Careator Technologies Pvt. Ltd</b></p></head><body></body></html>"
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