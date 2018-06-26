
var fs = require('fs');
var path = require('path');
var general = require("../general.js");
const schoolLogoDirectory = process.cwd() + '/public/schoolLogo/';
const profilePicDirectory = process.cwd() + '/public/profilePic/';

module.exports.upload = function (req, res) {
    console.log("uploadProfile Image--> ");
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    console.log("req.files.sampleFile: " + req.files.logo);
    let myFile = req.files.logo;
    console.log("path--" + schoolLogoDirectory);
    var fileArr = myFile.name.split(".");
    var fileName = "";
    for (var i = 0; i < fileArr.length - 1; i++) {
        fileName = fileName + fileArr[i]
    }
    fileName = fileName + "_" + general.date() + "." + fileArr[fileArr.length - 1];
    console.log("fileName--" + fileName)

    myFile.mv(schoolLogoDirectory + fileName, function (err) {
        if (err) {
            console.log(require('util').inspect(err));
            var responseData = {
                "status": true,
                "message": "date stored unsuccessfully",
                "data": { "err": err }
            }
            res.status(500).send(responseData);

        }
        else {
            var responseData = {
                "status": true,
                "message": "date stored successfully",
                "data": { "filePath": "/schoolLogo/" + fileName }
            }
            res.status(200).send(responseData);
        }
    });

    console.log("uploadProfile Image--> ");
}

module.exports.profilePicupload = function (req, res) {
    console.log("uploadProfile Image--> ");
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    console.log("req.files.sampleFile: " + req.files.logo);
    let myFile = req.files.logo;
    console.log("path--" + profilePicDirectory);
    var fileArr = myFile.name.split(".");
    var fileName = "";
    for (var i = 0; i < fileArr.length - 1; i++) {
        fileName = fileName + fileArr[i]
    }
    fileName = fileName + "_" + general.date() + "." + fileArr[fileArr.length - 1];
    console.log("fileName--" + fileName)

    myFile.mv(profilePicDirectory + fileName, function (err) {
        if (err) {
            console.log(require('util').inspect(err));
            var responseData = {
                "status": true,
                "message": "date stored unsuccessfully",
                "data": { "err": err }
            }
            res.status(500).send(responseData);
        }
        else {
            var responseData = {
                "status": true,
                "message": "date stored successfully",
                "data": { "filePath": "/profilePic/" + fileName }
            }
            res.status(200).send(responseData);
        }
    });

    console.log("uploadProfile Image--> ");
}

