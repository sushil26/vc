var general = require("../general.js");
const comm_employeeProfilePicDirectory = process.cwd() + '/public/comm_employeeProfilePic/';

module.exports.comm_profileImgUpload = function (req, res) {
    console.log("comm_profileImgUpload--> ");
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    console.log("req.files.sampleFile: " + req.files.logo);
    let myFile = req.files.logo;
    console.log("path--" + comm_employeeProfilePicDirectory);
    var fileArr = myFile.name.split(".");
    var fileName = "";
    for (var i = 0; i < fileArr.length - 1; i++) {
        fileName = fileName + fileArr[i]
    }
    fileName = fileName + "_" + general.date() + "." + fileArr[fileArr.length - 1];
    console.log("fileName--" + fileName)

    myFile.mv(comm_employeeProfilePicDirectory + fileName, function (err) {
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
                "data": { "filePath": "/comm_employeeProfilePic/" + fileName }
            }
            res.status(200).send(responseData);
        }
    });

    console.log("uploadProfile Image--> ");
}