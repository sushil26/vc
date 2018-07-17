
var db = require("../dbConfig.js").getDb();
var careatorMaster = db.collection("careatorMaster"); /* ### careator employee collection  ### */
var careatorChatGroup = db.collection("careatorChatGroup"); /* ### careatorChatGroup collection  ### */
var careatorVideoGroup = db.collection("careatorVideoGroup"); /* ### careatorChatGroup collection  ### */
var general = require("../general.js");
var careatorMasterArray = {};


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
        var obj = {
            "email": data.Email,
            "videoRights": data.VideoRights,
            "chatRights": data.ChatRights
        }
        console.log("obj: " + JSON.stringify(obj));

        careatorMasterArray.push(obj);
    })
        .on("end", function () {
            console.log("end marker: ");
            careatorMaster.insert({ $each: consolidateCS }, function (err, insertedData) {
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
                message: err
            };
            res.status(400).send(responseData);
        }
        else {
            console.log("allEmp: " + JSON.stringify(allEmp));
            response = {
                status: true,
                message: allEmp
            };
            res.status(200).send(responseData);
        }
    })

}

module.exports.careator_chat_creteGroup = function (req, res) {
    console.log("careator_chat_creteGroup-->");
    var response;
    var groupName = req.body.groupName;
    var groupMembers = req.body.groupMembers;
    if (general.emptyCheck(groupName)) {

        var insertObj = {
            "groupName": groupName,
            "groupMembers": groupMembers
        }
        careatorChatGroup.insert(insertObj, function (err, groupCreate) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Unsuccessfull group creation",
                    data: err
                };
                res.status(400).send(responseData);
            }
            else {
                console.log("groupCreate: " + JSON.stringify(groupCreate));
                response = {
                    status: true,
                    message: "Successfully group created",
                    data: groupCreate
                };
                res.status(200).send(responseData);
            }
        })
    }
    else {
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

module.exports.careator_video_creteGroup = function (req, res) {
    console.log("careator_video_creteGroup-->");
    var response;
    var groupName = req.body.groupName;
    var groupMembers = req.body.groupMembers;
    if (general.emptyCheck(groupName)) {

        var insertObj = {
            "groupName": groupName,
            "groupMembers": groupMembers
        }
        careatorVideoGroup.insert(insertObj, function (err, groupCreate) {
            if (err) {
                console.log("err: " + JSON.stringify(err));
                response = {
                    status: false,
                    message: "Unsuccessfull group creation",
                    data: err
                };
                res.status(400).send(responseData);
            }
            else {
                console.log("groupCreate: " + JSON.stringify(groupCreate));
                response = {
                    status: true,
                    message: "Successfully group created",
                    data: groupCreate
                };
                res.status(200).send(responseData);
            }
        })
    }
    else {
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


