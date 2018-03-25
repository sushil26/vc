var db = require('../dbConfig.js').getDb();
var user = db.collection('user');
var general = require('../general.js');
var util = require('util');
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;

// var randomstring = require("randomstring");

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
            "status": "active"

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
    // console.log("res.body.email: "+JSON.stringify(req));
    // console.log("res.body.email: "+req.body.data);
    // console.log("res.body.email: "+JSON.stringify(req.body.data));

    if (general.emptyCheck(req.body.email) && general.emptyCheck(req.body.password)) {
        user.find({ 'email': req.body.email }).toArray(function (err, data) {
            if (data.length > 0) {
                if (data[0].password == req.body.password) {
                    if (data[0].status == 'active') {
                        console.log("Successfully Logged in");
                        responseData = {
                            "status": true,
                            "message": "Login Successfully",
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
        user.update(obj,{ $set: updatedJson }, { multi: true }, function (err, data) {
           
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