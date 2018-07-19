
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
                        careatorMaster.find({ "email": careatorEmail }).toArray(function (err, careatorMasterFind) {
                            if (err) {
                                responseData = {
                                    status: false,
                                    message: "This email is not in DB",
                                    data: err
                                };
                                res.status(400).send(responseData);
                            }
                            else {
                                console.log("careatorMasterFind: " + JSON.stringify(careatorMasterFind));
                                if (careatorMasterFind.length > 0) {
                                    responseData = {
                                        status: true,
                                        message: "Login Successfully",
                                        data: careatorMasterFind[0]
                                    };
                                    res.status(200).send(responseData);
                                }
                            }
                        })

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
                "password": password,
                "invite": []
            }
            careatorEmp.find({ "email": email }).toArray(function (err, findData) {
                if (findData.length > 0) {
                    careatorEmp.update({ "email": email }, { $set: { "password": password, "invite": [] } }, function (err, data) {
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