var nodemailer = require("nodemailer");
var general = require("../general.js");
var createdDate = new Date();
var randomstring = require("randomstring");
var bodyParser = require("body-parser");
const path = require('path');
const ABSPATH = path.dirname(process.mainModule.filename); // Absolute path to our app directory
const dailyPicDirectory = process.cwd() + '/public/dailyPic/';

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

module.exports.captureImgSend = function (req, res) {
    console.log("captureImgSend-->");
    console.log("req.files: " + req.files);
    console.log("req.files.logo: " + req.files.logo);
    console.log("req.files.path: " + req.files.logo.path);
    console.log("req.files.name: " + req.files.logo.name);

    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    console.log("req.files.sampleFile: " + req.files.logo);
    let myFile = req.files.logo;
    console.log("path--" + dailyPicDirectory);
    var fileArr = myFile.name.split(".");
    var fileName = "";
    for (var i = 0; i < fileArr.length - 1; i++) {
        fileName = fileName + fileArr[i]
    }
    fileName = fileName + "_" + general.date() + "." + fileArr[fileArr.length - 1];
    console.log("fileName--" + fileName)

    myFile.mv(dailyPicDirectory + fileName, function (err) {
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
            var mailOptions = {
                from: "info@vc4all.in",
                to:"aditya@careator.com",
                subject: 'Arrival Report',
                html:"<table style='border:10px solid gainsboro;'><thead style='background:cornflowerblue;'><tr><th><h2>Greetings from School</h2></th></tr></thead><tfoot style='background:#396fc9;color:white;'><tr><td style='padding:15px;'><p><p>Regards</p><b>Careator Technologies Pvt. Ltd</b></p></td></tr></tfoot><tbody><tr><td><b>Dear parent,</b></td></tr><tr><td>This is the confirmation that your child "+req.params.studName+" has been successfully reached the school.<img style='max-width:300px;' src='cid:"+fileName+"'/></td></tr></tbody></table>",
              
                attachments: [{
                    filename: 'selfi.jpg',
                    path: ABSPATH + '/public/dailyPic/' + fileName,
                    cid: fileName //same cid value as in the html img src
                }]
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
    });


    
}