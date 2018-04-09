var db = require('../dbConfig.js').getDb();
var user = db.collection('user');/* ### Teacher collection  ### */
var stud = db.collection('student');/* ### student collection  ### */

var general = require('../general.js');
var util = require('util');
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;
var nodemailer = require('nodemailer');
// var randomstring = require("randomstring");

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'logeswari.careator@gmail.com',
        pass: 'iloveindia'
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports.register4VC = function (req, res) {
    console.log("Regisyer==>");
    console.log("dB: " + db);
    var responseData;
    // var password = randomstring.generate(5);
    // console.log("general.encrypt(password): " + general.encrypt(password));
    if (general.emptyCheck(req.body.userName) && general.emptyCheck(req.body.email) && general.emptyCheck(req.body.password)) {


        var userData = {
            "userName": req.body.userName,
            "email": req.body.email,
            "password": req.body.password,
            "status": "inactive"

        }
        console.log("userData: " + JSON.stringify(userData));
        user.insertOne(userData, function (err, data) {
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
                responseData = {
                    "status": true,
                    "message": "Registeration Successfull",
                    "data": data
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
    console.log("<<==Register");

}

module.exports.login4VC = function (req, res) {
    console.log("login==>");
    var responseData;
    if (general.emptyCheck(req.body.email) && general.emptyCheck(req.body.password)) {

        if (req.body.email == 'admin123@gmail.com') {
            var adminData;
            if (req.body.password == 'admin123') {
                adminData = {
                    "userName": "admin",
                    "status": "active",
                    "email": "admin123@gmail.com"
                }
                responseData = {
                    "status": true,
                    "message": "Login Successfully",
                    "loginType": "admin",
                    "data": adminData
                }
                res.status(200).send(responseData);
            }
            else {
                responseData = {
                    "status": false,
                    "message": "Password is wrong"
                }
                res.status(400).send(responseData);
            }

        }
        else {
            user.find({ 'teacherEmail': req.body.email }).toArray(function (err, data) {
                if (data.length > 0) {
                    if (data[0].password == req.body.pswd) {
                        if (data[0].status == 'active') {
                            console.log("Successfully Logged in");
                            responseData = {
                                "status": true,
                                "message": "Login Successfully",
                                "loginType": "teacher",
                                "data": data[0]
                            }
                            res.status(200).send(responseData);
                        }
                        else {
                            console.log("Profile Inactive");
                            responseData = {
                                "status": false,
                                "message": "Profile Inactive",
                                "data": data[0]
                            }
                            res.status(200).send(responseData);

                        }

                    }
                    else {
                        responseData = {
                            "status": false,
                            "errorCode": "E005",
                            "message": "Password is wrong"
                        }
                        res.status(200).send(responseData);
                    }
                }
                else {
                    responseData = {
                        "status": false,
                        "errorCode": "No Match",
                        "message": "There is no match for this EMail id from student database"
                    }
                    res.status(200).send(responseData);

                }
            })
        }
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


    console.log("<==login");

}

module.exports.getUserData = function (req, res) {
    console.log("getUserData-->");
    var responseData;
    user.find().toArray(function (err, listOfUser) {
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
                "message": "Successfull retrived data",
                "data": listOfUser
            }



            res.status(200).send(responseData);
        }

    })


    console.log("<--getUserData");
}
module.exports.getStudData = function (req, res) {
    console.log("getUserData-->");
    var responseData;
    stud.find().toArray(function (err, listOfUser) {
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
                "message": "Successfull retrived data",
                "data": listOfUser
            }



            res.status(200).send(responseData);
        }

    })


    console.log("<--getUserData");
}
module.exports.updateUserStatus = function (req, res) {
    console.log("updateUserStatus-->");
    var responseData;
    if (general.emptyCheck(req.body.id)) {

        var obj = {
            '_id': ObjectId(req.body.id)
        }
        var updatedJson = {

            "status": req.body.status
        }
        user.update(obj, { $set: updatedJson }, { multi: true }, function (err, data) {

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
                    "message": "Successfull updated status",
                    "data": data
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

    console.log("<--updateUserStatus");
}
module.exports.updateStudStatus = function (req, res) {
    console.log("updateStudStatus-->");
    var responseData;
    if (general.emptyCheck(req.body.id)) {

        var obj = {
            '_id': ObjectId(req.body.id)
        }
        var updatedJson = {

            "status": req.body.status
        }
        stud.update(obj, { $set: updatedJson }, { multi: true }, function (err, data) {

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
                    "message": "Successfull updated status",
                    "data": data
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

    console.log("<--updateStudStatus");
}

module.exports.deleteUser = function (req, res) {
    console.log("deleteUser-->");
    var responseData;
    if (general.emptyCheck(req.body.id)) {
        var id = {
            "_id": ObjectId(req.body.id)
        }
        user.remove(id, function (err, data) {
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
    else {
        console.log("Epty value found");
        responseData = {
            "status": false,
            "message": "empty value found"

        }
        res.status(400).send(responseData);

    }
    console.log("<--deleteUser");
}
module.exports.deleteStud = function (req, res) {
    console.log("deleteUser-->");
    var responseData;
    if (general.emptyCheck(req.body.id)) {
        var id = {
            "_id": ObjectId(req.body.id)
        }
        stud.remove(id, function (err, data) {
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
    else {
        console.log("Epty value found");
        responseData = {
            "status": false,
            "message": "empty value found"

        }
        res.status(400).send(responseData);

    }
    console.log("<--deleteUser");
}

module.exports.emailInvite = function (req, res) {
    console.log("emailInvite-->");
    var mailOptions = {
        from: "info@vc4all.in",
        to: req.body.email,
        subject: "Regarding School Instance Meeting",
        html: "<html><head><p><b>Dear Parents, </b></p><p>Please note, you have to attend meeting right now, please open the below link.<p>Here your link: " + req.body.url + "and password: abc</p><p>Regards</p><p><b>Careator Technologies Pvt. Ltd</b></p></head><body></body></html>"
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
    console.log("<--emailInvite");
}

module.exports.sessionCreate = function (req, res) {
    console.log("sessionCreate-->");
    var responseData;
    console.log("req.body.url: " + req.body.url);
    if (general.emptyCheck(req.body.url)) {
        var data = {
            "url": req.body.url
        }
        responseData = {
            "status": true,
            "message": "get url sucessfully",
            "data": data
        }
        res.status(200).send(responseData);
    }
    else {
        responseData = {
            "status": false,
            "message": "empty value found"

        }
        res.status(400).send(responseData);

    }
    console.log("<--sessionCreate");
}

module.exports.teacherInsert = function (req, res) {
    console.log("teacherInsert-->");
    var responseData;
    var userData = {
        "schoolName": req.body.schoolName,
        "teacherId": req.body.teacherId,
        "teacherName": req.body.teacherName,
        "teacherEmail": req.body.teacherEmail,
        "mobileNum": req.body.mobileNum,
        "css": req.body.css,
        "pswd": req.body.pswd,
        "status": "inactive",
        "loginType": "teacher"
    }
   
    console.log("userData: " + JSON.stringify(userData));
    user.insertOne(userData, function (err, data) {
        console.log("data: " + JSON.stringify(data));
        if (err) {

            responseData = {
                "status": false,
                "message": "Failed to Insert",
                "data": data
            }
            res.status(400).send(responseData);
        }
        else {
            responseData = {
                "status": true,
                "errorCode": 200,
                "message": "Insert Successfull",
                "data": userData
            }
            res.status(200).send(responseData);
        }
    })

    console.log("<--teacherInsert");
}

module.exports.studentInsert = function (req, res) {
    console.log("studentInsert-->");
    var responseData;
    var userData = {
        "schoolName": req.body.schoolName,
        "studId": req.body.studId,
        "studName": req.body.studName,
        "parentName": req.body.parentName,
        "parentEmail": req.body.parentEmail,
        "mobileNum": req.body.mobileNum,
        "css": req.body.css,
        "pswd": req.body.pswd,
        "status": "inactive",
        "loginType": "studParent"
    }
 
    console.log("userData: " + JSON.stringify(userData));
    stud.insertOne(userData, function (err, data) {
        console.log("data: " + JSON.stringify(data));
        if (err) {

            responseData = {
                "status": false,
                "message": "Failed to Insert",
                "data": data
            }
            res.status(400).send(responseData);
        }
        else {
            responseData = {
                "status": true,
                "errorCode": 200,
                "message": "Insert Successfull",
                "data": userData
            }
            res.status(200).send(responseData);
        }
    })

    console.log("<--studentInsert");

}

module.exports.teacherdetail = function (req, res) {
    console.log("teacherdetail-->");
    if(general.emptyCheck(req.params.id)){
        var id = {
            "userId": req.params.id
        }
        user.find(id).toArray(function (err, data) {
            console.log("data: "+JSON.stringify(data));
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
    
    
    
                res.status(200).send(responseData);
            }
    
        })
    
    }
    else{
        console.log("Epty value found");
        responseData = {
            "status": false,
            "message": "there is no userId to find",
           
        }
        res.status(400).send(responseData);
    }
    console.log("<--teacherdetail");
}


