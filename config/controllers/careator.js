var db = require("../dbConfig.js").getDb();
var general = require("../general.js");
var bodyParser = require("body-parser");
var careatorEmp = db.collection("careatorEmp"); /* ### Teacher collection  ### */
var ObjectId = require("mongodb").ObjectID;
var nodemailer = require("nodemailer");
var createdDate = new Date();
var randomstring = require("randomstring");

var careatorMaster = db.collection("careatorMaster"); /* ### careator employee collection  ### */
var careatorChatGroup = db.collection("careatorChatGroup"); /* ### careatorChatGroup collection  ### */
var careatorChat = db.collection("careatorChat"); /* ### careatorChat collection  ### */
var csv = require('fast-csv');
var careatorMasterArray = [];
var alreadyExist = null; /* ### Note: Marker for user create ### */
var existEmail = null; /* ### Note: Marker for user create ### */
var existEmpId = null; /* ### Note: Marker for user create ### */

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

var chatHistory = db.collection("chatHistory");

module.exports.RemoteJoinCheck = function (req, res) {
    console.log("RemoteJoinCheck-->");
    console.log("req.body.careator_remoteEmail: " + req.body.careator_remoteEmail + " req.body.careator_remotePswd" + req.body.careator_remotePswd);
    console.log("req.body.url: " + req.body.url);
    var password = req.body.careator_remotePswd;
    var remote_careatorEmail = req.body.careator_remoteEmail;
    var url = req.body.url;
    if (general.emptyCheck(password) && general.emptyCheck(remote_careatorEmail)) {
        var obj = {
            "remoteEmailId": remote_careatorEmail,
            "password": password
        }
        console.log("obj: " + JSON.stringify(obj));
        careatorMaster.find({ "sessionURL": url, "invite": { $elemMatch: { "remoteEmailId": remote_careatorEmail, "password": password } } }).toArray(function (err, findData) {
            console.log("findData: " + JSON.stringify(findData));
            console.log("findData.length: " + findData.length);
            if (err) {
                responseData = {
                    status: false,
                    message: "Process failed"
                };
                res.status(400).send(responseData);
            } else {
                if (findData.length > 0) {
                    responseData = {
                        status: true,
                        message: "Login Successfully"
                    };
                    res.status(200).send(responseData);
                } else {
                    responseData = {
                        status: false,
                        message: "Credential Mismatch"
                    };
                    res.status(400).send(responseData);
                }
            }
        })
    } else {
        responseData = {
            status: false,
            message: "Empty value found"
        };
        res.status(400).send(responseData);
    }
}

module.exports.pswdCheck = function (req, res) {
    console.log("pswdCheck-->");
    console.log("req.body.password: " + req.body.password + " req.body.careatorEmail: " + req.body.careatorEmail);
    var password = req.body.password;
    var careatorEmail = req.body.careatorEmail;
    if (general.emptyCheck(password) && general.emptyCheck(careatorEmail)) {
        var obj = {
            "email": careatorEmail
        }
        console.log("obj: " + JSON.stringify(obj));
        careatorMaster.find(obj).toArray(function (err, findData) {
            console.log("findData: " + JSON.stringify(findData));
            if (err) {
                responseData = {
                    status: false,
                    message: "Process failed"
                };
                res.status(400).send(responseData);
            } else {
                if (findData.length > 0) {
                    if (findData[0].password == password) {
                        responseData = {
                            status: true,
                            message: "Login Successfully",
                            data: findData[0]
                        };
                        console.log("responseData: " + JSON.stringify(responseData));
                        res.status(200).send(responseData);
                    } else {
                        responseData = {
                            status: false,
                            message: "Password is wrong"
                        };
                        console.log("responseData: " + JSON.stringify(responseData));
                        res.status(400).send(responseData);
                    }
                } else {
                    responseData = {
                        status: false,
                        message: "Email ID is not valid"
                    };
                    console.log("responseData: " + JSON.stringify(responseData));
                    res.status(400).send(responseData);
                }
            }
        })
    } else {
        responseData = {
            status: false,
            message: "Empty value found"
        };
        console.log("responseData: " + JSON.stringify(responseData));
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
            console.log("obj: " + JSON.stringify(obj));
            careatorMaster.find({ "email": email }).toArray(function (err, findData) {
                console.log("findData: " + JSON.stringify(findData));
                if (findData.length > 0) {
                    careatorMaster.update({ "_id": ObjectId(findData[0]._id), "status": "active" }, { $set: { "password": password, "invite": [] } }, function (err, data) {
                        console.log("data: " + JSON.stringify(data));
                        if (err) {
                            responseData = {
                                status: true,
                                message: "Process not successful"
                            };
                            res.status(200).send(responseData);
                        } else {
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
                                        message: "insert Successfull and Failed to send mail",
                                        data: data
                                    };
                                    res.status(200).send(responseData);
                                } else {
                                    console.log("Email sent: " + info.response);
                                    responseData = {
                                        status: true,
                                        message: "Successfully mail sent",
                                        data: data
                                    };
                                    res.status(200).send(responseData);
                                }
                            });
                        }
                    })
                } else {
                    console.log("Email Not Matched, tell your admin to verify");
                    responseData = {
                        status: false,
                        errorCode: 400,
                        message: "Email Not matched or inactive"
                    };
                    res.status(200).send(responseData);
                }

            })

        }
        else if (email == 'vc4allAdmin@gmail.com') {
            responseData = {
                status: true,
                message: "Successfully get admin login"
            };
            res.status(200).send(responseData);
        } else {
            responseData = {
                status: false,
                message: "Email id is not valid"
            };
            res.status(400).send(responseData);
        }
    } else {
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
    console.log("req.body.sessionHost: " + req.body.sessionHost + " req.body.email: " + req.body.email + " req.body.url: " + req.body.url);
    var password = randomstring.generate(7);
    console.log("password: " + password);
    careatorMaster.update({
        email: req.body.sessionHost
    }, {
            $push: {
                "invite": {
                    "remoteEmailId": req.body.email,
                    "password": password
                }
            }
        }, function (err, data) {
            if (err) {
                responseData = {
                    status: true,
                    errorCode: 200,
                    message: "Process not successful"
                };
                res.status(200).send(responseData);
            } else {
                var mailOptions = {
                    from: "info@vc4all.in",
                    to: req.body.email,
                    subject: 'VC4ALL Credential',
                    html: "<table style='border:10px solid gainsboro;'><thead style='background-image: linear-gradient(to bottom, #00BCD4 0%, #00bcd40f 100%);'><tr><th><h2>Greetings from VC4ALL</h2></th></tr></thead><tfoot style=background:#00bcd4;color:white;><tr><td style=padding:15px;><p><p>Regards</p><b>Careator Technologies Pvt. Ltd</b></p></td></tr></tfoot><tbody><tr><td><b>Dear Careator Employee,</b></td></tr><tr><td>Please note, You get the invitation from VC4ALL and sended by " + req.body.sessionHost + " you can access the below link by using given password.<p style=background:gainsboro;>Password: " + password + "</p><a href=" + req.body.url + " style=background:gainsboro;>URL: Click Me</p></td></tr></tbody></table>"
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

module.exports.getAdminObjectId = function (req, res) {
    console.log("getAdminObjectId-->");
    careatorMaster.find({ "email": "vc4allAdmin@gmail.com" }).toArray(function (err, admin) {
        if (err) {
            console.log("err: " + JSON.stringify(err));
            responseData = {
                status: false,
                message: "Unsuccessfull, go back and refresh then start session"
            };
            res.status(400).send(responseData);
        } else {
            console.log("admin: " + JSON.stringify(admin));
            responseData = {
                status: true,
                message: "Successfull",
                data: admin[0]._id
            };
            res.status(200).send(responseData);
        }
    })
}

module.exports.setCollection = function (req, res) {
    console.log("setCollection-->");
    console.log("req.body.url: " + req.body.url);
    console.log("req.body.email: " + req.body.email);

    var obj = {
        "email": req.body.email,
        "url": req.body.url,
        "chat": [],
        "session_dateTime": new Date()
    }
    console.log("obj: " + JSON.stringify(obj));

    careatorMaster.update({ "email": req.body.email }, {
        $set: {
            "sessionURL": req.body.url, "invite": [], "session_dateTime": new Date()
        }
    }, function (err, urlUpdate) {
        if (err) {
            console.log("err: " + JSON.stringify(err));
            responseData = {
                status: false,
                message: "Unsuccessfull, go back and refresh then start session"
            };
            res.status(400).send(responseData);
        } else {
            chatHistory.insertOne(obj, function (err, data) {
                if (err) {
                    console.log("err: " + JSON.stringify(err));
                    responseData = {
                        status: false,
                        message: "UnSuccessfully"
                    };
                    res.status(400).send(responseData);
                } else {
                    console.log("data: " + JSON.stringify(data));
                    var obj = {
                        "url": req.body.url
                    }
                    responseData = {
                        status: true,
                        message: "Successfully",
                        data: obj
                    };
                    res.status(200).send(responseData);
                }
            })
        }
    })




}

module.exports.getChatByUrl = function (req, res) {
    console.log("getChatByUrl-->");
    var obj = {
        "url": req.body.url,
    }
    console.log("obj: " + JSON.stringify(obj));
    chatHistory.find(obj).toArray(function (err, data) {
        console.log("data: " + JSON.stringify(data));
        console.log("data.length: " + data.length);
        if (err) {
            console.log("err: " + JSON.stringify(err));
            responseData = {
                status: false,
                message: "UnSuccessfully"
            };
            res.status(400).send(responseData);
        } else {
            console.log("data: " + JSON.stringify(data));
            responseData = {
                status: true,
                message: "Successfully",
                data: data
            };
            res.status(200).send(responseData);
        }
    })
}
module.exports.getHistoryByEmailId = function (req, res) {
    console.log("setCollection-->");
    var email = req.params.email;
    var obj = {
        "email": email,
    }
    console.log("obj: " + JSON.stringify(obj));
    chatHistory.find(obj).toArray(function (err, data) {
        console.log("data: " + JSON.stringify(data));
        console.log("data.length: " + data.length);
        if (err) {
            console.log("err: " + JSON.stringify(err));
            responseData = {
                status: false,
                message: "UnSuccessfully"
            };
            res.status(400).send(responseData);
        } else {
            console.log("data: " + JSON.stringify(data));
            responseData = {
                status: true,
                message: "Successfully",
                data: data
            };
            res.status(200).send(responseData);
        }
    })


}

module.exports.getHistory = function (req, res) {
    console.log("getHistory-->");

    chatHistory.find().toArray(function (err, data) {
        console.log("data: " + JSON.stringify(data));
        console.log("data.length: " + data.length);
        if (err) {
            console.log("err: " + JSON.stringify(err));
            responseData = {
                status: false,
                message: "UnSuccessfully"
            };
            res.status(400).send(responseData);
        } else {
            console.log("data: " + JSON.stringify(data));
            responseData = {
                status: true,
                message: "Successfully",
                data: data
            };
            res.status(200).send(responseData);
        }
    })


}

module.exports.careatorMasterInsert = function (req, res) {
    console.log("careatorMasterInsert-->");
    var responseData;
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    var userDataFile = req.files.img;
    console.log("userDataFile: " + userDataFile);
    var parser = csv.fromString(userDataFile.data.toString(), {
        headers: true,
        ignoreEmpty: true
    }).on("data", function (data) {
        console.log("data: " + JSON.stringify(data));
        parser.pause();
        if (data.Name == "#" || alreadyExist == 'yes') {
            parser.resume();
        } else {
            module.exports.careatorMasterInsertValidate(data, function (err) {
                console.log("validation -->");
                console.log("alreadyExist : " + alreadyExist + " existEmail: " + existEmail + " existEmpId: " + existEmpId);
                parser.resume();
            });
        }
    })
        .on("end", function () {
            console.log("end marker: ");
            if (alreadyExist == 'yes') {
                careatorMasterArray = [];
                alreadyExist = null;
                if (existEmpId != null) {
                    var temp = existEmpId;
                } else if (existEmail != null) {
                    var temp = existEmail;
                }

                existEmail = null;
                existEmpId = null;
                responseData = {
                    status: false,
                    message: "Upload failed because this " + temp + " already exist",
                };
                res.status(400).send(responseData);
            } else {
                careatorMaster.insert(careatorMasterArray, function (err, insertedData) {
                    careatorMasterArray = [];
                    if (err) {
                        console.log("err: " + JSON.stringify(err));
                        responseData = {
                            status: false,
                            message: "Insert Unsuccessful"
                        };
                        res.status(400).send(responseData);
                    } else {
                        console.log("insertedData: " + JSON.stringify(insertedData));
                        responseData = {
                            status: true,
                            message: "Insert Successfull",
                        };
                        res.status(200).send(responseData);
                    }
                })
            }
        })
}

module.exports.careatorMasterInsertValidate = function (data, callback) {
    console.log("careatorMasterInsertValidate-->");
    var findEmpId = {
        "empId": data.EmpId
    }
    var findEmail = {
        "email": data.Email
    }
    var obj = {
        "name": data.Name,
        "empId": data.EmpId,
        "email": data.Email,
        "videoRights": data.VideoRights,
        "chatRights": data.ChatRights,
        "status": "active",
        "chatStatus": "Available",
        "restrictedTo": []
    }
    careatorMaster.find(findEmpId).toArray(function (err, findData) {
        if (err) {
            console.log("err: " + JSON.stringify(err));

        } else {
            console.log("findData: " + JSON.stringify(findData));
            if (findData.length > 0) {
                alreadyExist = "yes";
                existEmpId = data.EmpId;
                if (callback) callback();
            } else {
                careatorMaster.find(findEmail).toArray(function (err, findData) {
                    if (err) {
                        console.log("err: " + JSON.stringify(err));

                    } else {
                        console.log("findData: " + JSON.stringify(findData));
                        if (findData.length > 0) {
                            alreadyExist = "yes";
                            existEmail = data.Email;
                            if (callback) callback();
                        } else {
                            careatorMasterArray.push(obj);
                            if (callback) callback();
                        }

                    }
                })
            }
        }
    })

}


module.exports.careatorSingleUserInsert = function (req, res) {
    console.log("careatorSingleUserInsert-->");

    var obj = {
        "name": req.body.userName,
        "empId": req.body.empId,
        "email": req.body.empEmail,
        "videoRights": req.body.videoRights,
        "chatRights": req.body.chatRights,
        "status": "active",
        "restrictedTo": []
    }
    console.log("obj :" + JSON.stringify(obj));
    var findEmpId = {
        "empId": req.body.empId
    }
    var findEmail = {
        "email": req.body.empEmail
    }
    console.log("findEmpId :" + JSON.stringify(findEmpId));
    console.log("findEmail :" + JSON.stringify(findEmail));

    careatorMaster.find(findEmpId).toArray(function (err, idFindData) {
        if (err) {
            console.log("err: " + JSON.stringify(err));
            responseData = {
                status: false,
                message: "Find employeeid for insert failed"
            };
            res.status(400).send(responseData);
        } else {
            console.log("idFindData: " + JSON.stringify(idFindData));
            if (idFindData.length > 0) {

                responseData = {
                    status: false,
                    message: "This employee id already exist"
                };
                res.status(400).send(responseData);
            } else {
                careatorMaster.find(findEmail).toArray(function (err, emailFindData) {
                    if (err) {
                        console.log("err: " + JSON.stringify(err));
                        responseData = {
                            status: false,
                            message: "Find emailid for insert failed"
                        };
                        res.status(400).send(responseData);
                    } else {
                        console.log("emailFindData: " + JSON.stringify(emailFindData));
                        if (emailFindData.length > 0) {

                            responseData = {
                                status: false,
                                message: "This emaail id already exist"
                            };
                            res.status(400).send(responseData);
                        } else {
                            careatorMaster.insert(obj, function (err, insertedData) {
                                if (err) {
                                    console.log("err: " + JSON.stringify(err));
                                    responseData = {
                                        status: false,
                                        message: "Insert Unsuccessful"
                                    };
                                    res.status(400).send(responseData);
                                } else {
                                    console.log("insertedData: " + JSON.stringify(insertedData));
                                    responseData = {
                                        status: true,
                                        message: "Insert Successfull",
                                    };
                                    res.status(200).send(responseData);
                                }
                            })

                        }

                    }
                })
            }
        }
    })

}

module.exports.careator_getAllEmp = function (req, res) {
    console.log("careator_getAllEmp-->");
    var response;
    careatorMaster.find().toArray(function (err, allEmp) {
        if (err) {
            console.log("err: " + JSON.stringify(err));
            response = {
                status: false,
                message: "Unsucessfully retrived data",
                data: err
            };
            res.status(400).send(responseData);
        } else {
            console.log("allEmp: " + JSON.stringify(allEmp));
            response = {
                status: true,
                message: "Sucessfully retrived data",
                data: allEmp
            };
            res.status(200).send(response);
        }
    })

}
/* ##### Start: Get careator all employee include status inactive  #### */
module.exports.careator_getChatRightsEmp = function (req, res) {
    console.log("careator_getChatRightsEmp-->");
    var response;
    careatorMaster.find({
        "chatRights": "yes"
    }).toArray(function (err, allEmp_chat) {
        if (err) {
            console.log("err: " + JSON.stringify(err));
            response = {
                status: false,
                message: "Unsucessfully retrived data",
                data: err
            };
            res.status(400).send(responseData);
        } else {
            console.log("allEmp_chat: " + JSON.stringify(allEmp_chat));
            response = {
                status: true,
                message: "Sucessfully retrived data",
                data: allEmp_chat
            };
            res.status(200).send(response);
        }
    })

}
/* ##### End: Get careator all employee include status inactive  #### */

/////////////////Group Status Change////////////////////////////
module.exports.groupStatusChangeById = function (req, res) {
    console.log("groupStatusChangeById-->");
    var response;
    var id = req.body.id;
    var status = req.body.status;
    console.log("id: " + id + " status: " + status);
    if (general.emptyCheck(id)) {
        var queryId = {
            "_id": ObjectId(id)
        }
        console.log("queryId: " + JSON.stringify(queryId));
        var updateVlaue = {
            "status": status
        }
        console.log("updateVlaue: " + JSON.stringify(updateVlaue));
        careatorChatGroup.update({ "_id": ObjectId(id) }, { $set: { "status": status } }, function (err, data) {
            console.log("status query proccessed-->");
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Update unsucessfully",
                    data: err
                };
                res.status(400).send(response);
            } else {
                console.log("updatedData: " + JSON.stringify(data));
                response = {
                    status: true,
                    message: "Update sucessfully",
                    data: data
                };
                res.status(200).send(response);
            }
        })
    } else {
        console.log("Epty value found");
        var obj = {
            "id": id
        }
        response = {
            status: false,
            message: "empty value found",
            data: obj
        };
        res.status(400).send(response);
    }

}

module.exports.statusChangeById = function (req, res) {
    console.log("statusChangeById-->");
    var response;
    var id = req.body.id;
    var status = req.body.status;
    console.log("id: " + id + " status: " + status);
    if (general.emptyCheck(id)) {
        var queryId = {
            "_id": ObjectId(id)
        }
        console.log("queryId: " + JSON.stringify(queryId));
        var updateVlaue = {
            "status": status
        }
        console.log("updateVlaue: " + JSON.stringify(updateVlaue));
        careatorMaster.update({ "_id": ObjectId(id) }, { $set: { "status": status } }, function (err, data) {
            console.log("status query proccessed-->");
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Update unsucessfully",
                    data: err
                };
                res.status(400).send(response);
            } else {
                console.log("updatedData: " + JSON.stringify(data));
                response = {
                    status: true,
                    message: "Update sucessfully",
                    data: data
                };
                res.status(200).send(response);
            }
        })
    } else {
        console.log("Epty value found");
        var obj = {
            "id": id
        }
        response = {
            status: false,
            message: "empty value found",
            data: obj
        };
        res.status(400).send(response);
    }

}
/* ##### Start: Get careator all employee exclude status inactive  #### */
module.exports.getChatRights_emp = function (req, res) {
    console.log("getChatRights_emp-->");
    var response;
    careatorMaster.find({
        "chatRights": "yes",
        "status": "active"
    }).toArray(function (err, allEmp_chat) {
        if (err) {
            console.log("err: " + JSON.stringify(err));
            response = {
                status: false,
                message: "Unsucessfully retrived data",
                data: err
            };
            res.status(400).send(responseData);
        } else {
            console.log("allEmp_chat: " + JSON.stringify(allEmp_chat));
            response = {
                status: true,
                message: "Sucessfully retrived data",
                data: allEmp_chat
            };
            res.status(200).send(response);
        }
    })

}
/* ##### End: Get careator all employee exclude status inactive  #### */

module.exports.getVideoRights_emp = function (req, res) {
    console.log("getVideoRights_emp-->");
    var response;
    careatorMaster.find({
        "videoRights": "yes",
        "status": "active"
    }).toArray(function (err, allEmp_chat) {
        if (err) {
            console.log("err: " + JSON.stringify(err));
            response = {
                status: false,
                message: "Unsucessfully retrived data",
                data: err
            };
            res.status(400).send(responseData);
        } else {
            console.log("allEmp_chat: " + JSON.stringify(allEmp_chat));
            response = {
                status: true,
                message: "Sucessfully retrived data",
                data: allEmp_chat
            };
            res.status(200).send(response);
        }
    })

}

module.exports.careator_getChatVideo_emp = function (req, res) {
    console.log("careator_getChatVideo_emp-->");
    var response;
    careatorMaster.find({
        "chatRights": "yes",
        "videoRights": "yes",
        "status": "active"
    }).toArray(function (err, allEmp_chat) {
        if (err) {
            console.log("err: " + JSON.stringify(err));
            response = {
                status: false,
                message: "Unsucessfully retrived data",
                data: err
            };
            res.status(400).send(responseData);
        } else {
            console.log("allEmp_chat: " + JSON.stringify(allEmp_chat));
            response = {
                status: true,
                message: "Sucessfully retrived data",
                data: allEmp_chat
            };
            res.status(200).send(response);
        }
    })

}

module.exports.careator_chat_creteGroup = function (req, res) {
    console.log("careator_chat_creteGroup-->");
    var response;
    var groupName = req.body.groupName;
    var groupMembers = req.body.members;
    var admin = req.body.admin;
    if (general.emptyCheck(groupName)) {

        var insertObj = {
            "groupName": groupName,
            "groupMembers": groupMembers,
            "admin": admin,
            "status": "active"
        }
        careatorChatGroup.insert(insertObj, function (err, groupCreate) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Unsuccessfull group creation",
                    data: err
                };
                res.status(400).send(response);
            } else {
                console.log("groupCreate: " + JSON.stringify(groupCreate));
                response = {
                    status: true,
                    message: "Successfully group created",
                    data: groupCreate
                };
                res.status(200).send(response);
            }
        })
    } else {
        console.log("Epty value found");
        var groupName = {
            "groupName": groupName
        }
        response = {
            status: false,
            message: "empty value found",
            data: groupName
        };
        res.status(400).send(response);
    }

}


module.exports.careator_getChatGroupListById = function (req, res) {
    console.log("getChatGroupListById-->");
    var id = req.params.id;
    if (general.emptyCheck(id)) {
        careatorChatGroup.find({
            "groupMembers": {
                $elemMatch: {
                    "userId": id
                }
            }
        }).toArray(function (err, data) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                responseData = {
                    status: false,
                    data: err,
                    message: "Process not successful"
                };
                res.status(400).send(responseData);
            } else {
                console.log("data: " + JSON.stringify(data));
                responseData = {
                    status: true,
                    errorCode: 200,
                    message: "Successfully get Data",
                    data: data
                };
                res.status(200).send(responseData);
            }
        })

    } else {
        console.log("Epty value found");
        response = {
            status: false,
            message: "empty value found"
        };
        res.status(400).send(response);
    }
}

module.exports.careator_getChatGroupList = function (req, res) {
    console.log("careator_getChatGroupList-->");

    careatorChatGroup.find().toArray(function (err, data) {
        if (err) {
            console.log("err: " + JSON.stringify(err));
            responseData = {
                status: false,
                data: err,
                message: "Process not successful"
            };
            res.status(400).send(responseData);
        } else {
            console.log("data: " + JSON.stringify(data));
            responseData = {
                status: true,
                errorCode: 200,
                message: "Successfully get Data",
                data: data
            };
            res.status(200).send(responseData);
        }
    })
}

module.exports.careator_getChatRightsAllemp = function (req, res) {
    console.log("careator_getChatRightsAllemp-->: " + req.params.id);
    var id = req.params.id;
    var restrictedUsers = req.body.restrictedTo;
    console.log("restrictedUsers: " + JSON.stringify(restrictedUsers));
    for (var x = 0; x < restrictedUsers.length; x++) {
        console.log("restrictedUsers[x]: " + JSON.stringify(restrictedUsers[x]));
        restrictedUsers[x] = ObjectId(restrictedUsers[x]);
    }
    console.log("restrictedUsers: " + restrictedUsers);
    if (general.emptyCheck(id)) {
        careatorMaster.find({
            "_id": {
                $in: restrictedUsers

            },
            "chatRights": "yes",
            "status": "active"
        }).toArray(function (err, allEmp_chat) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Unsucessfully retrived data",
                    data: err
                };
                res.status(400).send(responseData);
            } else {
                console.log("allEmp_chat: " + JSON.stringify(allEmp_chat));
                response = {
                    status: true,
                    message: "Sucessfully retrived data",
                    data: allEmp_chat
                };
                res.status(200).send(response);
            }
        })

    } else {
        console.log("Epty value found");
        response = {
            status: false,
            message: "empty value found"
        };
        res.status(400).send(response);
    }
}

module.exports.careator_getChatRightsAllemp_byLoginId = function (req, res) {
    console.log("careator_getChatRightsAllemp_byLoginId-->: " + req.params.id);
    var id = req.params.id;

    if (general.emptyCheck(id)) {
        careatorMaster.find({ "_id": { $ne: ObjectId(id) }, "chatRights": "yes" }).toArray(function (err, allEmp_chat) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Unsucessfully retrived data",
                    data: err
                };
                res.status(400).send(responseData);
            } else {
                console.log("allEmp_chat: " + JSON.stringify(allEmp_chat));
                response = {
                    status: true,
                    message: "Sucessfully retrived data",
                    data: allEmp_chat
                };
                res.status(200).send(response);
            }
        })

    } else {
        console.log("Epty value found");
        response = {
            status: false,
            message: "empty value found"
        };
        res.status(400).send(response);
    }
}

module.exports.individualText = function (req, res) {
    console.log("individualText-->");
    var date = new Date();
    var title = req.body.senderId + req.body.receiverId;
    var r_title = req.body.receiverId + req.body.senderId;
    console.log("title : " + title + "r_title: " + r_title);

    careatorChat.find({
        $or: [{
            "title": title
        }, {
            "title": r_title
        }]
    }).toArray(function (err, data) {
        if (err) {
            console.log("err: " + JSON.stringify(err));
            response = {
                status: false,
                message: "Unsucessfully retrived data",
                data: err
            };
            res.status(400).send(responseData);
        } else {
            console.log("data.length: " + data.length);
            console.log("data: " + JSON.stringify(data));
            if (data.length == 0) {
                var obj = {
                    "title": title,
                    "senderId": req.body.senderId,
                    "senderName": req.body.senderName,
                    "receiverId": req.body.receiverId,
                    "receiverName": req.body.receiverName,
                    "chats": [{
                        "senderId": req.body.senderId,
                        "senderName": req.body.senderName,
                        "message": req.body.message,
                        "sendTime": date
                    }],
                    "timeStamp": date
                }
                console.log("obj : " + JSON.stringify(obj));
                careatorChat.insert(obj, function (err, insertedData) {
                    if (err) {
                        console.log("err: " + JSON.stringify(err));
                        response = {
                            status: false,
                            message: "Unsucessfully retrived data",
                            data: err
                        };
                        res.status(400).send(responseData);
                    } else {
                        var io = req.app.get('socketio');
                        io.emit('comm_textReceived', {
                            "id": insertedData.ops[0]._id,
                            "senderId": obj.chats[0].senderId,
                            "senderName": obj.chats[0].senderName,
                            "message": obj.chats[0].message,
                            "sendTime": obj.chats[0].sendTime,
                            "receiverId": obj.receiverId,
                            "freshInsert": true
                        }); /* ### Note: Emit message to client ### */
                        response = {
                            status: true,
                            message: "Sucessfully sent",
                            data: insertedData
                        };
                        res.status(200).send(response);
                    }
                })
            } else {
                var obj = {
                    "senderId": req.body.senderId,
                    "senderName": req.body.senderName,
                    "message": req.body.message,
                    "sendTime": date
                }
                console.log("obj : " + JSON.stringify(obj));
                var findObj = {
                    "_id": data[0]._id
                }
                console.log("findObj: " + JSON.stringify(findObj));
                careatorChat.update(findObj, {
                    "$push": {
                        "chats": obj
                    }
                }, function (err, updatedData) {
                    if (err) {
                        console.log("err: " + JSON.stringify(err));
                        response = {
                            status: false,
                            message: "Unsucessfully updated data",
                            data: err
                        };
                        res.status(400).send(responseData);
                    } else {
                        console.log("updatedData: " + JSON.stringify(updatedData));
                        var io = req.app.get('socketio');
                        io.emit('comm_textReceived', {
                            "id": data[0]._id,
                            "senderId": obj.senderId,
                            "senderName": obj.senderName,
                            "message": obj.message,
                            "receiverId": req.body.receiverId,
                            "sendTime": obj.sendTime
                        }); /* ### Note: Emit message to client ### */
                        response = {
                            status: true,
                            message: "Sucessfully updated",
                            data: updatedData
                        };
                        res.status(200).send(response);
                    }
                })
            }
        }
    })
}
module.exports.individualTextReadById = function (req, res) {
    console.log("individualTextReadById--> ");
    var sId = req.params.sId;
    var rId = req.params.rId;
    console.log("sId: " + sId + " rId: " + rId);
    var title = sId + rId;
    var r_title = rId + sId;
    console.log("title : " + title + " r_title: " + r_title);
    if (general.emptyCheck(sId) && general.emptyCheck(rId)) {
        careatorChat.find({
            $or: [{
                "title": title
            }, {
                "title": r_title
            }]
        }).toArray(function (err, data) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Unsucessfully retrived data",
                    data: err
                };
                res.status(400).send(response);
            } else {
                console.log("data.length: " + data.length);
                console.log("data: " + JSON.stringify(data));
                response = {
                    status: true,
                    message: "Sucessfully retrived data",
                    data: data
                };
                res.status(200).send(response);
            }
        })
    } else {
        console.log("Epty value found");
        response = {
            status: false,
            message: "empty value found"
        };
        res.status(400).send(response);
    }

}

module.exports.groupTextReadByGroupId = function (req, res) {
    console.log("groupTextReadByGroupId-->");
    var date = new Date();
    var group_id = req.params.group_id;
    console.log("group_id: " + group_id);
    if (general.emptyCheck(group_id)) {

        careatorChat.find({ "group_id": group_id }).toArray(function (err, data) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Unsucessfully retrived data",
                    data: err
                };
                res.status(400).send(responseData);
            } else {
                console.log("data.length: " + data.length);
                console.log("data: " + JSON.stringify(data));
                response = {
                    status: true,
                    message: "Sucessfully get",
                    data: data
                };
                res.status(200).send(response);

            }
        })
    }
    else {
        console.log("Epty value found");
        response = {
            status: false,
            message: "empty value found"
        };
        res.status(400).send(response);
    }
}
module.exports.groupText = function (req, res) {
    console.log("groupText-->");
    var date = new Date();
    var obj = {
        "group_id": req.body.group_id,
        "groupName": req.body.groupName,
        "chats": [{
            "senderId": req.body.senderId,
            "senderName": req.body.senderName,
            "message": req.body.message,
            "sendTime": date
        }],
        "timeStamp": date
    }
    console.log("obj : " + JSON.stringify(obj));
    if (general.emptyCheck(req.body.group_id)) {
        careatorChat.find({ "group_id": obj.group_id, "groupName": obj.groupName }).toArray(function (err, data) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Unsucessfully retrived data",
                    data: err
                };
                res.status(400).send(responseData);
            } else {
                console.log("data.length: " + data.length);
                console.log("data: " + JSON.stringify(data));
                if (data.length == 0) {
                    var obj = {
                        "group_id": req.body.group_id,
                        "groupName": req.body.groupName,
                        "chats": [{
                            "senderId": req.body.senderId,
                            "senderName": req.body.senderName,
                            "message": req.body.message,
                            "sendTime": date
                        }],
                        "timeStamp": date
                    }
                    console.log("obj : " + JSON.stringify(obj));
                    careatorChat.insert(obj, function (err, insertedData) {
                        if (err) {
                            console.log("err: " + JSON.stringify(err));
                            response = {
                                status: false,
                                message: "Unsucessfully retrived data",
                                data: err
                            };
                            res.status(400).send(responseData);
                        } else {
                            console.log("insertedData: " + JSON.stringify(insertedData));
                            console.log("insertedData.ops[0]._id", insertedData.ops[0]._id);
                            var io = req.app.get('socketio');
                            io.emit('comm_textReceived', {
                                "id": insertedData.ops[0]._id,
                                "senderId": obj.chats[0].senderId,
                                "senderName": obj.chats[0].senderName,
                                "message": obj.chats[0].message,
                                "sendTime": obj.chats[0].sendTime,
                                "freshInsert": true
                            }); /* ### Note: Emit message to client ### */
                            response = {
                                status: true,
                                message: "Sucessfully sent",
                                data: insertedData
                            };
                            res.status(200).send(response);
                        }
                    })
                } else {
                    var obj = {
                        "senderId": req.body.senderId,
                        "senderName": req.body.senderName,
                        "message": req.body.message,
                        "sendTime": date
                    }
                    console.log("obj : " + JSON.stringify(obj));
                    var findObj = {
                        "_id": data[0]._id
                    }
                    console.log("findObj: " + JSON.stringify(findObj));
                    careatorChat.update(findObj, {
                        "$push": {
                            "chats": obj
                        }
                    }, function (err, updatedData) {
                        if (err) {
                            console.log("err: " + JSON.stringify(err));
                            response = {
                                status: false,
                                message: "Unsucessfully updated data",
                                data: err
                            };
                            res.status(400).send(responseData);
                        } else {
                            console.log("updatedData: " + JSON.stringify(updatedData));
                            var io = req.app.get('socketio');
                            io.emit('comm_textReceived', {
                                "id": data[0]._id,
                                "senderId": obj.senderId,
                                "senderName": obj.senderName,
                                "message": obj.message,
                                "sendTime": obj.sendTime
                            }); /* ### Note: Emit message to client ### */
                            response = {
                                status: true,
                                message: "Sucessfully updated",
                                data: updatedData
                            };
                            res.status(200).send(response);
                        }
                    })
                }
            }
        })
    } else {
        console.log("Epty value found");
        response = {
            status: false,
            message: "empty value found"
        };
        res.status(400).send(response);
    }
}
module.exports.getGroupById = function (req, res) {
    console.log("getGroupById-->");
    var id = req.params.id;
    var response;
    if (general.emptyCheck(id)) {
        var findObj = {
            "_id": ObjectId(id)
        }
        careatorChatGroup.find(findObj).toArray(function (err, groupData) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Unsucessfully retrived data",
                    data: err
                };
                res.status(400).send(responseData);
            } else {
                console.log("groupData: " + JSON.stringify(groupData));
                response = {
                    status: true,
                    message: "Sucessfully retrived data",
                    data: groupData
                };
                res.status(200).send(response);
            }
        })
    } else {
        console.log("empty value found");
        response = {
            status: false,
            message: "Empty value found",
        }
        res.status(400).send(response);
    }

}
module.exports.careator_getUserById = function (req, res) {
    console.log("careator_getUserById-->");
    var id = req.params.id;
    var response;
    if (general.emptyCheck(id)) {
        var findObj = {
            "_id": ObjectId(id)
        }
        careatorMaster.find(findObj).toArray(function (err, allEmp_chat) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Unsucessfully retrived data",
                    data: err
                };
                res.status(400).send(responseData);
            } else {
                console.log("allEmp_chat: " + JSON.stringify(allEmp_chat));
                response = {
                    status: true,
                    message: "Sucessfully retrived data",
                    data: allEmp_chat
                };
                res.status(200).send(response);
            }
        })
    } else {
        console.log("empty value found");
        response = {
            status: false,
            message: "Empty value found",
        }
        res.status(400).send(response);
    }

}

module.exports.getChatListRecordById = function (req, res) {
    console.log("getChatListRecordById-->: " + req.params.id);
    var id = req.params.id;
    if (general.emptyCheck(id)) {
        careatorChat.find({
            $or: [{
                "senderId": id
            }, {
                "receiverId": id
            }]
        }).toArray(function (err, findData) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Unsucessfully retrived data",
                    data: err
                };
                res.status(400).send(response);
            } else {
                console.log("allEmp_chat: " + JSON.stringify(findData));
                response = {
                    status: true,
                    message: "Sucessfully retrived data",
                    data: findData
                };
                res.status(200).send(response);
            }
        })

    } else {
        console.log("Epty value found");
        response = {
            status: false,
            message: "empty value found"
        };
        res.status(400).send(response);
    }

}

module.exports.careator_getGroupById = function (req, res) {
    console.log("careator_getGroupById-->");
    var id = req.params.id;
    var response;
    if (general.emptyCheck(id)) {
        var findObj = {
            "_id": ObjectId(id)
        }
        careatorChatGroup.find(findObj).toArray(function (err, allEmp_chat) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Unsucessfully retrived data",
                    data: err
                };
                res.status(400).send(responseData);
            } else {
                console.log("allEmp_chat: " + JSON.stringify(allEmp_chat));
                response = {
                    status: true,
                    message: "Sucessfully retrived data",
                    data: allEmp_chat
                };
                res.status(200).send(response);
            }
        })
    } else {
        console.log("empty value found");
        response = {
            status: false,
            message: "Empty value found",
        }
        res.status(400).send(response);
    }

}
module.exports.userEditById = function (req, res) {
    console.log("userEditById-->");
    var response;
    var id = req.params.id;
    console.log("id: " + id);
    if (general.emptyCheck(id)) {
        var queryId = {
            "_id": ObjectId(id)
        }
        console.log("queryId: " + JSON.stringify(queryId));
        var updateVlaue = {};

        if (req.body.userName) {
            updateVlaue.name = req.body.userName;
        }
        if (req.body.empId) {
            updateVlaue.empId = req.body.empId;
        }
        if (req.body.userEmail) {
            updateVlaue.email = req.body.userEmail;
        }
        if (req.body.videoRights) {
            updateVlaue.videoRights = req.body.videoRights;
        }
        if (req.body.chatRights) {
            updateVlaue.chatRights = req.body.chatRights;
        }
        console.log("updateVlaue: " + JSON.stringify(updateVlaue));
        careatorMaster.update(queryId, { $set: updateVlaue }, function (err, updatedData) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Update unsucessfully",
                    data: err
                };
                res.status(400).send(response);
            } else {
                var io = req.app.get('socketio');
                io.emit('comm_aboutUserEdit', {
                    "id": id
                }); /* ### Note: Emit message to user about their new restricted user ### */
                console.log("updatedData: " + JSON.stringify(updatedData));
                response = {
                    status: true,
                    message: "Update sucessfully",
                    data: updatedData
                };
                res.status(200).send(response);
            }
        })
    } else {
        console.log("Epty value found");
        var obj = {
            "id": id
        }
        response = {
            status: false,
            message: "empty value found",
            data: obj
        };
        res.status(400).send(response);
    }

}
module.exports.groupEditById = function (req, res) {
    console.log("groupEditById-->");
    var response;
    var id = req.params.id;
    console.log("id: " + id);
    if (general.emptyCheck(id)) {
        var queryId = {
            "_id": ObjectId(id)
        }
        console.log("queryId: " + JSON.stringify(queryId));
        var updateVlaue = {};

        if (req.body.userName) {
            updateVlaue.name = req.body.userName;
        }
        if (req.body.empId) {
            updateVlaue.empId = req.body.empId;
        }
        if (req.body.userEmail) {
            updateVlaue.email = req.body.userEmail;
        }
        if (req.body.videoRights) {
            updateVlaue.videoRights = req.body.videoRights;
        }
        if (req.body.chatRights) {
            updateVlaue.chatRights = req.body.chatRights;
        }
        console.log("updateVlaue: " + JSON.stringify(updateVlaue));
        careatorMaster.update(queryId, {
            $set: updateVlaue
        }),
            function (err, updatedData) {
                if (err) {
                    console.log("err: " + JSON.stringify(err));
                    response = {
                        status: false,
                        message: "Update unsucessfully",
                        data: err
                    };
                    res.status(400).send(response);
                } else {
                    console.log("updatedData: " + JSON.stringify(updatedData));
                    response = {
                        status: true,
                        message: "Update sucessfully",
                        data: updatedData
                    };
                    res.status(200).send(response);
                }
            }
    } else {
        console.log("Epty value found");
        var obj = {
            "id": id
        }
        response = {
            status: false,
            message: "empty value found",
            data: obj
        };
        res.status(400).send(response);
    }

}
module.exports.userDeleteById = function (req, res) {
    console.log("userDeleteByI-->");
    var response;
    var id = req.params.id;
    console.log("id: " + id);
    if (general.emptyCheck(id)) {
        var queryId = {
            "_id": ObjectId(id)
        }
        console.log("queryId: " + JSON.stringify(queryId));
        careatorMaster.deleteOne(queryId, function (err, updatedData) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Delete fail",
                    data: err
                };
                res.status(400).send(response);
            } else {
                console.log("updatedData: " + JSON.stringify(updatedData));
                response = {
                    status: true,
                    message: "Delete sucessfully",
                    data: updatedData
                };
                res.status(200).send(response);
            }
        })
    } else {
        console.log("Empty value found");
        var obj = {
            "id": id
        }
        response = {
            status: false,
            message: "empty value found",
            data: obj
        };
        res.status(400).send(response);
    }

}
module.exports.groupDeleteById = function (req, res) {
    console.log("groupDeleteById-->");
    var response;
    var id = req.params.id;
    console.log("id: " + id);
    if (general.emptyCheck(id)) {
        var queryId = {
            "_id": ObjectId(id)
        }
        console.log("queryId: " + JSON.stringify(queryId));
        careatorChatGroup.deleteOne(queryId, function (err, updatedData) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Delete fail",
                    data: err
                };
                res.status(400).send(response);
            } else {
                console.log("updatedData: " + JSON.stringify(updatedData));
                response = {
                    status: true,
                    message: "Delete sucessfully",
                    data: updatedData
                };
                res.status(200).send(response);
            }
        })
    } else {
        console.log("Empty value found");
        var obj = {
            "id": id
        }
        response = {
            status: false,
            message: "empty value found",
            data: obj
        };
        res.status(400).send(response);
    }

}
module.exports.groupUpdateById = function (req, res) {
    console.log("groupUpdateById-->");
    var response;
    var id = req.params.id;

    if (general.emptyCheck(id)) {
        var objFind = {
            "_id": ObjectId(id)
        }
        var objUpdate = {};
        if (req.body.groupName) {
            objUpdate.groupName = req.body.groupName;
        }
        if (req.body.memebers) {
            objUpdate.groupMembers = req.body.memebers;
        }
        if (req.body.admin) {
            objUpdate.admin = req.body.admin;
        }

        console.log("objFind: " + JSON.stringify(objFind));
        console.log("objUpdate: " + JSON.stringify(objUpdate));
        careatorChatGroup.update(objFind, { $set: objUpdate }, function (err, groupUpdate) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Unsuccessfull group update",
                    data: err
                };
                res.status(400).send(response);
            } else {
                console.log("groupCreate: " + JSON.stringify(groupUpdate));
                if (req.body.groupName) {
                    var objFindByGroupId = {
                        "group_id": id
                    }
                    careatorChat.update(objFindByGroupId, { $set: { "groupName": req.body.groupName } }, function (err, groupNameUpdated) {
                        if (err) {
                            console.log("err: " + JSON.stringify(err));
                            response = {
                                status: false,
                                message: "Unsuccessfull group update into chat details",
                                data: err
                            };
                            res.status(400).send(response);
                        } else {
                            console.log("groupNameUpdated: " + JSON.stringify(groupNameUpdated));
                            response = {
                                status: true,
                                message: "Successfully group update into chat details as well group details"
                            };
                            res.status(200).send(response);
                        }
                    })

                }
                else {
                    response = {
                        status: true,
                        message: "Successfully group update",
                        data: groupUpdate
                    };
                    res.status(200).send(response);
                }
            }
        })
    } else {
        console.log("Epty value found");
        response = {
            status: false,
            message: "empty value found"
        };
        res.status(400).send(response);
    }

}
module.exports.restrictedTo = function (req, res) {
    console.log("restrictedTo-->");
    var response;
    var id = req.params.id;
    console.log("req.body.restrictedTo: " + JSON.stringify(req.body.restrictedTo));
    if (general.emptyCheck(id)) {
        var objFind = {
            "_id": ObjectId(id)
        }
        var objUpdate = {
            "restrictedTo": req.body.restrictedTo
        };

        console.log("objFind: " + JSON.stringify(objFind));
        console.log("objUpdate: " + JSON.stringify(objUpdate));
        careatorMaster.update(objFind, { $addToSet: { "restrictedTo": req.body.restrictedTo } }, function (err, restrict) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Unsuccessfull",
                    data: err
                };
                res.status(400).send(response);
            } else {
                console.log("restrict: " + JSON.stringify(restrict));
                var io = req.app.get('socketio');
                io.emit('comm_aboutRestrictedUpdate', {
                    "id": id,
                    "restrictedTo": req.body.restrictedTo
                }); /* ### Note: Emit message to user about their new restricted user ### */
                response = {
                    status: true,
                    message: "Successfull",
                    data: restrict
                };
                res.status(200).send(response);
            }
        })
    } else {
        console.log("Epty value found");
        response = {
            status: false,
            message: "empty value found"
        };
        res.status(400).send(response);
    }

}

module.exports.removeRestrictedUserById = function (req, res) {
    console.log("removeRestrictedUserById-->");
    var response;
    var id = req.params.id;
    console.log("req.body.restrictedTo: " + JSON.stringify(req.body.restrictedTo));
    if (general.emptyCheck(id)) {
        var objFind = {
            "_id": ObjectId(id)
        }
        var objUpdate = {
            "restrictedTo": req.body.restrictedTo
        };

        console.log("objFind: " + JSON.stringify(objFind));
        console.log("objUpdate: " + JSON.stringify(objUpdate));
        careatorMaster.update(objFind, { $pull: { "restrictedTo": req.body.restrictedTo } }, function (err, restrict) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Unsuccessfull",
                    data: err
                };
                res.status(400).send(response);
            } else {
                console.log("restrict: " + JSON.stringify(restrict));
                var io = req.app.get('socketio');
                io.emit('comm_aboutRestrictedUpdate', {
                    "id": id,
                    "restrictedTo": req.body.restrictedTo
                }); /* ### Note: Emit message to user about their new restricted user ### */
                response = {
                    status: true,
                    message: "Successfull",
                    data: restrict
                };
                res.status(200).send(response);
            }
        })
    } else {
        console.log("Epty value found");
        response = {
            status: false,
            message: "empty value found"
        };
        res.status(400).send(response);
    }

}

module.exports.restrictedToSave = function (req, res) {
    console.log("restrictedToSave-->");
    var response;
    var id = req.params.id;
    console.log("req.body.restrictedTo: " + JSON.stringify(req.body.restrictedTo));
    if (general.emptyCheck(id)) {
        var objFind = {
            "_id": ObjectId(id)
        }
        var objUpdate = {
            "restrictedTo": req.body.restrictedTo
        };

        console.log("objFind: " + JSON.stringify(objFind));
        console.log("objUpdate: " + JSON.stringify(objUpdate));
        careatorMaster.update(objFind, { $set: { "restrictedTo": req.body.restrictedTo } }, function (err, restrict) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Unsuccessfull",
                    data: err
                };
                res.status(400).send(response);
            } else {
                console.log("restrict: " + JSON.stringify(restrict));
                var io = req.app.get('socketio');
                io.emit('comm_aboutRestrictedUpdate', {
                    "id": id,
                    "restrictedTo": req.body.restrictedTo
                }); /* ### Note: Emit message to user about their new restricted user ### */
                response = {
                    status: true,
                    message: "Successfull",
                    data: restrict
                };
                res.status(200).send(response);
            }
        })
    } else {
        console.log("Epty value found");
        response = {
            status: false,
            message: "empty value found"
        };
        res.status(400).send(response);
    }

}

module.exports.getChatsById = function (req, res) {
    console.log("getChatsById-->");
    var id = req.params.id;
    console.log("id: " + id);
    var response;
    if (general.emptyCheck(id)) {
        var findObj = {
            "_id": ObjectId(id)
        }
        careatorChat.find(findObj).toArray(function (err, allChat) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Unsucessfully retrived data",
                    data: err
                };
                res.status(400).send(responseData);
            } else {
                console.log("allChat: " + JSON.stringify(allChat));
                response = {
                    status: true,
                    message: "Sucessfully retrived data",
                    data: allChat[0]
                };
                res.status(200).send(response);
            }
        })
    } else {
        console.log("empty value found");
        response = {
            status: false,
            message: "Empty value found",
        }
        res.status(400).send(response);
    }

}

module.exports.chatStatusUpdateById = function (req, res) {
    console.log("chatStatusUpdateById-->");
    var id = req.params.id;
    console.log("id: " + id);
    console.log("chatStatus: " + req.body.chatStatus);
    var response;
    if (general.emptyCheck(id)) {
        var findObj = {
            "_id": ObjectId(id)
        }
        careatorMaster.update(findObj, { $set: { chatStatus: req.body.chatStatus } }, function (err, chatStatusUpdated) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Unsucessfully retrived data",
                    data: err
                };
                res.status(400).send(responseData);
            } else {
                console.log("chatStatusUpdated: " + JSON.stringify(chatStatusUpdated));
                var io = req.app.get('socketio');
                io.emit('comm_receiverStatusUpdate', {
                    "id": id,
                    "status": req.body.chatStatus
                }); /* ### Note: Emit message to client ### */
                response = {
                    status: true,
                    message: "Sucessfully retrived data",
                    data: chatStatusUpdated
                };
                res.status(200).send(response);
            }
        })
    }
    else {
        console.log("empty value found");
        response = {
            status: false,
            message: "Empty value found",
        }
        res.status(400).send(response);
    }
}


