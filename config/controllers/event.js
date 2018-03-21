var db = require('../dbConfig.js').getDb();
var event = db.collection('event');
var general = require('../general.js');

var bodyParser = require('body-parser');

var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'logeswari.careator@gmail.com',
        pass: 'iloveindia'
    }
});
module.exports.eventSend = function(req, res) {
    console.log("eventSend-->");
    var responseData;
    if(general.emptyCheck(req.body.studName) && general.emptyCheck(req.body.studId) && general.emptyCheck(req.body.reason) &&  general.emptyCheck(req.body.email)){

        var userData = {
            "reason":req.body.reason,
            "studName":req.body.studName,
            "studId":req.body.studId,
            "email": req.body.email,
            "start":req.body.start,
            "end":req.body.end,
            "startAt":req.body.startAt,
            "endAt":req.body.endAt,
            "primColor":req.body.primColor
    
        }
        console.log("userData: "+JSON.stringify(userData));
        event.insertOne(userData, function(err, data) {
            console.log("data: "+JSON.stringify(data));
            if (err) {
               
                responseData = {
                    "status": false,
                    "message": "Failed to Register",
                    "data": data
                }
                res.status(400).send(responseData);
            }
            else{
             
              
    
              
                var mailOptions = {
                    from: "logeswari.careator@gmail.com",
                    to: req.body.email,
                    subject: "Regarding School Meeting",
                    html: req.body.reason
                };
                console.log("mailOptions: "+JSON.stringify(mailOptions));
                
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        responseData = {
                            "status": false,
                            "errorCode": 400,
                            "message": "Registeration Successfull and Failed to send mail",
                            "data": data
                        }
                        res.status(400).send(responseData);
                       
                
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
                
        
    
            }
    
        })
        
        
      
    }
    else{

        console.log("Epty value found");
        responseData = {
            "status": false,
            "message": "empty value found",
            "data": userData
        }
        res.status(400).send(responseData);
    
    }
}

module.exports.eventGet = function(req, res) {
    console.log("getEvent-->");
    var responseData;
    event.find().toArray(function(err, listOfevents){ 
        if (err) {
               
            responseData = {
                "status": false,
                "message": "Failed to get Data",
                "data": data
            }
            res.status(400).send(responseData);
        }
        else{
            responseData = {
                "status": true,
                "message": "Registeration Successfull",
                "data": listOfevents
            }
           
          

            res.status(200).send(responseData);   
        }
       
    })

}