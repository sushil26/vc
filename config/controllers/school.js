
var db = require("../dbConfig.js").getDb();
var school = db.collection("school"); /* ### school collection  ### */

var general = require("../general.js");
var ObjectId = require("mongodb").ObjectID;
var bodyParser = require('body-parser');

module.exports.getSchoolList = function (req, res) {
    console.log("getSchoolList-->");
    var responseData;
    var schoolList = [];
    school.find().toArray(function (err, data) {
      //  console.log("schoolList: " + JSON.stringify(data));

        if (err) {
            responseData = {
                status: false,
                message: "Failed to get Data",
                data: data
            };
            res.status(400).send(responseData);
        } else {
            for(var x=0;x<data.length;x++){
                schoolList.push(data[x].schoolName);
            }
           
            console.log("schoolList: " + JSON.stringify(schoolList));
            responseData = {
                status: true,
                message: "There is no class",
                data: schoolList
            };

            res.status(200).send(responseData);

        }
    });
    console.log("<--getSchoolList");
};

module.exports.getSchoolData = function (req, res) {
    console.log("getAllClass-->");
    var responseData;
    var allClass = [];
    school.find({ "schoolName": req.params.schoolName }).toArray(function (err, data) {
       // console.log("data: " + JSON.stringify(data));

        if (err) {
            responseData = {
                status: false,
                message: "Failed to get Data",
                data: data
            };
            res.status(400).send(responseData);
        } else {
           
            if (data[0].css.length > 0) {
              

                // console.log("studentList: "+JSON.stringify(studentList));
                // console.log("allClass.length: " + allClass.length);
                // for (var len = 0; len < csList.length; len++) {
                //     var cls = studentList[len].cs[0].class;
                //     var sec = studentList[len].cs[0].section;
                //     console.log("cls: " + cls);
                //     allClass.push({ "class": cls, "section": sec });
                // }

                responseData = {
                    status: true,
                    message: "Successfull retrived data",
                    data: data[0]
                };

                res.status(200).send(responseData);
            }
            else {
                responseData = {
                    status: true,
                    message: "There is no class",
                    data: data[0]
                };

                res.status(200).send(responseData);
            }
        }
    });

    console.log("<--getAllClass");
};

module.exports.getSchoolDataById = function (req, res) {
    console.log("getAllClass-->");
    var responseData;
    var allClass = [];
    school.find({ "_id": ObjectId(req.params.id)}).toArray(function (err, data) {
       // console.log("data: " + JSON.stringify(data));

        if (err) {
            responseData = {
                status: false,
                message: "Failed to get Data",
                data: data
            };
            res.status(400).send(responseData);
        } else {
           
                // console.log("studentList: "+JSON.stringify(studentList));
                // console.log("allClass.length: " + allClass.length);
                // for (var len = 0; len < csList.length; len++) {
                //     var cls = studentList[len].cs[0].class;
                //     var sec = studentList[len].cs[0].section;
                //     console.log("cls: " + cls);
                //     allClass.push({ "class": cls, "section": sec });
                // }

                responseData = {
                    status: true,
                    message: "Successfull retrived data",
                    data: data
                };

                res.status(200).send(responseData);
            
        }
    });

    console.log("<--getAllClass");
};

