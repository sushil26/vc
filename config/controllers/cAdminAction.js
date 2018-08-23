var db = require("../dbConfig.js").getDb();
var general = require("../general.js");
var property = require("../../property.json");
var ObjectId = require("mongodb").ObjectID;
var organizationModel = require("./schemas/organization.js");
var careatorMaster = db.collection("careatorMaster"); /* ### careator employee collection  ### */
var organizations = db.collection("organizations"); /* ### organizations collection  ### */
var randomstring = require("randomstring");

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

module.exports.adminCreate = function (req, res) {
    console.log("adminCreate-->");
    var createdDate = new Date();
    var sessionRandomId = randomstring.generate(7);
    var organizationObj = {
        "organizationName": req.body.organizationName,
        "domain": req.body.organizationDomain,
        "dor": req.body.dor,
        "registrationRegNumber": req.body.registrationRegNumber,
        // "address": req.body.organizationAddress,
        "adminFirstName": req.body.firstName,
        "adminLastName": req.body.lastName,
        "email": req.body.email,
        "mobNumber": req.body.mobNumber,
        "streetName": req.body.streetName,
        "city": req.body.city,
        "state": req.body.state,
        "pinCode": req.body.pinCode,
        "country": req.body.country,
        "status": "active",
        "logoPath": req.body.logoPath,
        "subscription": "Basic",
        "created_at": createdDate
    }
    var adminObj = {
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "email": req.body.email,
        "organizationName": req.body.organizationName,
        "mobNumber": req.body.mobNumber,
        "password": req.body.pswd,
        "status": "active",
        "loginType": "admin",
        "logoPath": req.body.logoPath,
        "created_at": createdDate,
        "videoRights": 'yes',
        "chatRights": 'yes',
        "chatStatus": "Available",
        "restrictedTo": [],
        "profilePicPath": "/careatorApp/css/user.png",
        "login": "notDone",
        "logout": "done",
        "sessionRandomId": sessionRandomId,
    }
    console.log("organizationObj: " + JSON.stringify(organizationObj));
    console.log("adminObj: " + JSON.stringify(adminObj));
    organizationModel.create(organizationObj, function (err, data) {
        console.log("data: " + JSON.stringify(data));
        if (err) {
            if (err.code == 11000) {
                console.log("err: " + JSON.stringify(err.errmsg));
                var errmsg = err.errmsg;
                var splitErrMsg = errmsg.split(':');
                var nextSplit = splitErrMsg[4].split('}');
                console.log("splitErrMsg: " + splitErrMsg + " nextSplit: " + nextSplit);
                responseData = {
                    status: false,
                    message: nextSplit[0] + " Already exist"
                };
                res.status(400).send(responseData);
            }
            else {
                console.log("err" + JSON.stringify(err));
                console.log("err.name: " + err.name);
                if (err.name == 'ValidationError') {
                    var message;
                    if (err.errors.schoolName) {
                        responseData = {
                            status: false,
                            message: "Organization Name is required"
                        };
                        res.status(400).send(responseData);
                    }
                    else if (err.errors.schoolRegNumber) {
                        responseData = {
                            status: false,
                            message: "Organization Registeration Number is required"
                        };
                        res.status(400).send(responseData);
                    }
                    else if (err.errors.address) {
                        responseData = {
                            status: false,
                            message: "Address is required"
                        };
                        res.status(400).send(responseData);
                    }
                    else if (err.errors.email) {
                        responseData = {
                            status: false,
                            message: "Email is required"
                        };
                        res.status(400).send(responseData);
                    }
                    else if (err.errors.mobNumber) {
                        responseData = {
                            status: false,
                            message: "Mobile number is required as a Number"
                        };
                        res.status(400).send(responseData);
                    }
                    else if (err.errors.dor) {
                        responseData = {
                            status: false,
                            message: "Date of registration is required"
                        };
                        res.status(400).send(responseData);
                    }
                    else if (err.errors.streetName) {
                        responseData = {
                            status: false,
                            message: "Street name is required"
                        };
                        res.status(400).send(responseData);
                    }
                    else if (err.errors.city) {
                        responseData = {
                            status: false,
                            message: "City of registration is required"
                        };
                        res.status(400).send(responseData);
                    }
                    else if (err.errors.state) {
                        responseData = {
                            status: false,
                            message: "State name is required"
                        };
                        res.status(400).send(responseData);
                    }
                    else if (err.errors.pinCode) {
                        responseData = {
                            status: false,
                            message: "PinCode of registration is required"
                        };
                        res.status(400).send(responseData);
                    }
                    else if (err.errors.country) {
                        responseData = {
                            status: false,
                            message: "Country name number is required"
                        };
                        res.status(400).send(responseData);
                    }

                }
            }
        }
        else {
            adminObj.orgId = data._id;
            var password = "abc";
            careatorMaster.insert(adminObj, function (err, data) {
                console.log("data: " + JSON.stringify(data));
                if (err) {
                    if (err.code == 11000) {
                        console.log("err: " + JSON.stringify(err.errmsg));
                        var errmsg = err.errmsg;
                        var splitErrMsg = errmsg.split(':');
                        var nextSplit = splitErrMsg[4].split('}');
                        console.log("splitErrMsg: " + splitErrMsg + " nextSplit: " + nextSplit);
                        responseData = {
                            status: false,
                            message: nextSplit[0] + " Already exist"
                        };
                        res.status(400).send(responseData);
                    }
                    else {
                        console.log("err.errors.name: " + err.name);
                        console.log("err.errors: " + err.errors);
                        if (err.name == 'ValidationError') {
                            if (err.errors.mobileNum) {
                                console.log("mobile Number has to be Number");
                                responseData = {
                                    status: false,
                                    message: "Mobile Number is required as a Number"
                                };
                                res.status(400).send(responseData);
                            }
                            else if (err.errors.schoolName) {
                                responseData = {
                                    status: false,
                                    message: "SchoolName is required as a string"
                                };
                                res.status(400).send(responseData);
                            }
                            else if (err.errors.schoolId) {
                                responseData = {
                                    status: false,
                                    message: "SchoolId is required"
                                };
                                res.status(400).send(responseData);
                            }
                            else if (err.errors.firstName) {
                                responseData = {
                                    status: false,
                                    message: "FirstName is required as a string"
                                };
                                res.status(400).send(responseData);
                            }
                            else if (err.errors.lastName) {
                                responseData = {
                                    status: false,
                                    message: "LastName is required as a string"
                                };
                                res.status(400).send(responseData);
                            }
                            else if (err.errors.email) {
                                responseData = {
                                    status: false,
                                    message: "Email is required as a string"
                                };
                                res.status(400).send(responseData);
                            }
                            else if (err.errors.mobNumber) {
                                responseData = {
                                    status: false,
                                    message: "Mobile number is required as a string"
                                };
                                res.status(400).send(responseData);
                            }
                            else if (err.errors.email) {
                                responseData = {
                                    status: false,
                                    message: "Email is required as a string"
                                };
                                res.status(400).send(responseData);
                            }
                            else if (err.errors.mobNumber) {
                                responseData = {
                                    status: false,
                                    message: "Mobile number is required as a string"
                                };
                                res.status(400).send(responseData);
                            }
                        }
                    }
                } else {
                    var mailOptions = {
                        from: "info@vc4all.in",
                        to: req.body.email,
                        subject: "Regarding VC4ALL Credential",
                        html: "<table style='border:10px solid gainsboro;'><thead style='background-image: linear-gradient(to bottom, #00BCD4 0%, #00bcd40f 100%);'><tr><th><h2>Greetings from VC4ALL</h2></th></tr></thead><tfoot style=background:#00bcd4;color:white;><tr><td style=padding:15px;><p><p>Regards</p><b>Careator Technologies Pvt. Ltd</b></p></td></tr></tfoot><tbody><tr><td><b>Dear Admin,</b></td></tr><tr><td><p>Please note, you have to use the following credential for login. <p style=background:gainsboro;>Here your link and credential for login.</p> <p> Link: <a href='https://vc4all.in'>https://vc4all.in/</a> </p><p> Email: " + req.body.email + "</p><p> Password: " + req.body.pswd + "</p></td></tr></tbody></table>"
                        // html: "<html><head><p><b>Dear Parents, </b></p><p>Please note, you have to attend meeting regarding <b>" + req.body.reason + " </b>please open the below link at sharp " + req.body.startAt + " to " + req.body.endAt + "</p><p style=background:gainsboro;>Here your link and password for meeting <a href=" + req.body.url + ">" + req.body.url + "</a> and Password: " + password + "</p><p>Regards</p><p><b>Careator Technologies Pvt. Ltd</b></p></head><body></body></html>"
                    };
                    console.log("mailOptions: " + JSON.stringify(mailOptions));
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                            // responseData = {
                            //     "status": true,
                            //     "errorCode": 200,
                            //     "message": "Registeration Successfull and Failed to send mail",
                            //     "data": userData
                            // }
                            // res.status(200).send(responseData);
                        } else {
                            console.log('Email sent: ' + info.response);
                            // responseData = {
                            //     "status": true,
                            //     "errorCode": 200,
                            //     "message": "Registeration Successfull and sent mail",

                            //     "data": userData
                            // }
                            // res.status(200).send(responseData);
                        }

                    });
                    responseData = {
                        status: true,
                        errorCode: 200,
                        message: "Insert Successfull",
                    };
                    res.status(200).send(responseData);
                }
            });
        }


        console.log("<--adminCreate");
    })

}

module.exports.getAllAdmin = function (req, res) {
    console.log("getAllAdmin-->");

    var responseData;
    careatorMaster.find({ "loginType": "admin" }).toArray(function (err, adminDataList) {
        if (err) {
            responseData = {
                status: false,
                message: "Failed to get Data"

            };
            res.status(400).send(responseData);
        } else {
            responseData = {
                status: true,
                message: "All admin collected successfully",
                data: adminDataList
            };

            res.status(200).send(responseData);
        }

    })
    console.log("<--getAllAdmin");

}

module.exports.getAllOrg = function (req, res) {
    console.log("getAllOrganization-->");

    var responseData;
    organizations.find().toArray(function (err, schoolDataList) {
        if (err) {
            responseData = {
                status: false,
                message: "Failed to get Data",

            };
            res.status(400).send(responseData);
        } else {
            responseData = {
                status: true,
                message: "All School collected successfully",
                data: schoolDataList
            };

            res.status(200).send(responseData);
        }

    })
    console.log("<--getAllOrganization");

}


module.exports.updateOrgStatus = function (req, res) {
    console.log("updateOrgStatus-->");
    var responseData;
    if (general.emptyCheck(req.body.id)) {
        var obj = {
            _id: ObjectId(req.body.id)
        };
        var updatedJson = {
            status: req.body.status
        };
        organizations.update(obj, { $set: updatedJson }, function (err, data) {
            if (err) {
                responseData = {
                    status: false,
                    message: "Failed to get Data",
                    data: data
                };
                res.status(400).send(responseData);
            } else {
                var obj = {
                    orgId: ObjectId(req.body.id)
                };
                careatorMaster.update(obj, { $set: updatedJson }, function (err, data) {
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
                            message: "Successfull updated status",
                            data: data
                        };

                        res.status(200).send(responseData);
                    }
                })
            }
        });
    } else {
        console.log("Epty value found");
        responseData = {
            status: false,
            message: "empty value found",
        };
        res.status(400).send(responseData);
    }

    console.log("<--updateOrgStatus");
};

module.exports.getOrg_admin_byOrgId = function (req, res) {
    console.log("getOrg_admin_byOrgId-->");
    var responseData;
    if (general.emptyCheck(req.params.id)) {
        var obj = {
            _id: ObjectId(req.params.id)
        };
        console.log("obj: " + JSON.stringify(obj));
        organizations.find(obj).toArray(function (err, data) {
            if (err) {
                responseData = {
                    status: false,
                    message: "Failed to get Data",
                    data: data
                };
                res.status(400).send(responseData);
            } else {
                var findObj = {
                    orgId: ObjectId(req.params.id)
                };
                console.log("findObj: " + JSON.stringify(findObj));
                careatorMaster.find(findObj).toArray(function (err, adminPassword) {
                    if (err) {
                        responseData = {
                            status: false,
                            message: "Failed to get Data",
                            data: data
                        };
                        res.status(400).send(responseData);
                    } else {
                        console.log("adminPassword[0]: " + JSON.stringify(adminPassword[0]));
                        var obj = data[0];
                        obj.password = adminPassword[0].password;
                        //console.log("obj: "+JSON.stringify(obj));
                        responseData = {
                            status: true,
                            message: "Successfull updated status",
                            data: obj
                        };

                        res.status(200).send(responseData);
                    }
                })
            }
        })


    }
    else {
        console.log("Epty value found");
        responseData = {
            status: false,
            message: "empty value found",
        };
        res.status(400).send(responseData);
    }
}

module.exports.orgEditById = function (req, res) {
    console.log("orgEditById-->");
    var response;
    var id = req.params.id;
    console.log("id: " + id);
    if (general.emptyCheck(id)) {
        var date = new Date();
        var queryId = {
            "_id": ObjectId(id)
        }
        console.log("Organization queryId: "+JSON.stringify(queryId));
        var updateVlaue = {
            "lastUpdatedDate": date
        };

        if (req.body.organizationName) {
            updateVlaue.organizationName = req.body.organizationName;
        }
        if (req.body.organizationDomain) {
            updateVlaue.domain = req.body.organizationDomain;
        }
        if (req.body.dor) {
            updateVlaue.dor = req.body.dor;
        }
        if (req.body.registrationRegNumber) {
            updateVlaue.registrationRegNumber = req.body.registrationRegNumber;
        }
        if (req.body.email) {
            updateVlaue.email = req.body.email;
        }
        if (req.body.mobNumber) {
            updateVlaue.mobNumber = req.body.mobNumber
        }
        if (req.body.streetName) {
            updateVlaue.streetName = req.body.streetName;
        }
        if (req.body.city) {
            updateVlaue.city = req.body.city
        }
        if (req.body.state) {
            updateVlaue.state = req.body.state;
        }
        if (req.body.pinCode) {
            updateVlaue.pinCode = req.body.pinCode;
        }
        if (req.body.country) {
            updateVlaue.country = req.body.country;
        }
        if (req.body.firstName) {
            updateVlaue.adminFirstName = req.body.firstName;
        }
        if (req.body.lastName) {
            updateVlaue.adminLastName = req.body.lastName;
        }

        console.log("updateValue: " + JSON.stringify(updateVlaue));
        /* ###  Start: Admin data, Organization data updated from careator master collection, organization collection ### */
        organizations.update(queryId, { $set: updateVlaue }, function (err, updatedData) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: property.E0007,
                    data: err
                };
                res.status(400).send(response);
            } else {
                console.log("updatedData: " + JSON.stringify(updatedData));

                var careatorUpdateQueryId = {
                    "orgId": ObjectId(id)
                }
                console.log("careatorUpdateQueryId: "+JSON.stringify(careatorUpdateQueryId));
                var adminObj = {
                    "lastUpdatedDate": date
                }
                if (req.body.firstName) {
                    adminObj.firstName = req.body.firstName;
                }
                if (req.body.lastName) {
                    adminObj.lastName = req.body.lastName;
                }
                if (req.body.organizationName) {
                    adminObj.organizationName = req.body.organizationName;
                }
                if (req.body.email) {
                    adminObj.email = req.body.email;
                }
                if (req.body.mobNumber) {
                    adminObj.mobNumber = req.body.mobNumber
                }
                if (req.body.pswd) {
                    adminObj.password = req.body.pswd;
                }
                console.log("adminObj: " + JSON.stringify(adminObj));
                /* ###  Start: Admin data updated from careator master collection ### */
                careatorMaster.update(careatorUpdateQueryId, { $set: adminObj }, function (err, updatedData) {
                    if (err) {
                        console.log("err: " + JSON.stringify(err));
                        response = {
                            status: false,
                            message: property.E0007,
                            data: err
                        };
                        res.status(400).send(response);
                    } else {
                        console.log("updatedData: " + JSON.stringify(updatedData));

                        response = {
                            status: true,
                            message: property.S0015,
                            data: updatedData
                        };
                        res.status(200).send(response);
                    }
                })
                /* ###  End: Admin data updated from careator master collection ### */
            }
        })
        /* ###  End: Admin data, Organization data updated from careator master collection, organization collection ### */
    } else {
        console.log("Empty value found");
        var obj = {
            "id": id
        }
        response = {
            status: false,
            message: property.N0003,
            data: obj
        };
        res.status(400).send(response);
    }
    console.log("<--orgEditById");
}


