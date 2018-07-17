
var db = require("../dbConfig.js").getDb();
var student = require("./schemas/student.js");
var teacher = require("./schemas/teacher.js");

var user = db.collection("user"); /* ### Teacher collection  ### */
var stud = db.collection("students"); /* ### student collection  ### */
//var studCheck = db.collection("students"); /* ### student collection  ### */
var school = db.collection("school"); /* ### school collection  ### */
var general = require("../general.js");
var ObjectId = require("mongodb").ObjectID;
var csv = require('fast-csv');
var d = new Date();

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

var fs = require("fs");
var message;
var month;
var marker; /* ### Note: marker is used for identify the status of update query ###*/
var monthAtt = []; /* ### Note: get all attendance of the month ###*/
var unknownData = [];
var attendanceIndex; /* ### Note: dateAttendance index based on month select  ### */
var schoolName; /* ### Note: Get School Name of API  ### */
var testType; /* ### Note: Get testType while uploading marksheet  ### */
var testStartDate; /* ### Note: Get test start date while uploading marksheet  ### */
var clas, section;  /* ### Note: Used while uploading marksheet  ### */
var counter = 0; /* ### Note: Used while uploading marksheet  ### */
var expectedMessage; /* ### Note:Attendance month validation  ### */
var id; /* ### Note:Attendance Update based on id  ### */
var createdDate = new Date();
var ids = []; /* ### All valid ids storage for studentMaster  ### */
var csData = []; /* ### Class and Section for studentMaster### */
var objJson = []; /* ### Storage for student master valid data ### */
var studentFileValidationMessage = null; /* ### Notification for student master invalid data ### */
var teacherFileValidationMessage = null; /* ### Notification for student master invalid data ### */
var allStudentEmailIds = [];  /* ### storage for all parents email ids ### */
var allTeacherEmailIds = [];  /* ### storage for all teacher email ids ### */
var feeType;/* ### Note: Get reportType while uploading fee  ### */
var fee_otherName; /* ### Note: Get fee_otherName while uploading fee  ### */

module.exports.updateSchoolStatus = function (req, res) {
    console.log("updateSchoolStatus-->");
    var responseData;
    if (general.emptyCheck(req.body.id)) {
        var obj = {
            _id: ObjectId(req.body.id)
        };
        var updatedJson = {
            status: req.body.status
        };
        school.update(obj, { $set: updatedJson }, { multi: true }, function (
            err,
            data
        ) {
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
        });
    } else {
        console.log("Epty value found");
        responseData = {
            status: false,
            message: "empty value found",
            data: userData
        };
        res.status(400).send(responseData);
    }

    console.log("<--updateSchoolStatus");
};

module.exports.getAllTeacherList = function (req, res) {
    console.log("getAllTeacherList-->");
    var responseData;
    if (general.emptyCheck(req.params.schoolName)) {
        var queryData = {
            "schoolName": req.params.schoolName,
            "loginType": "teacher"
        }
        console.log("queryData: " + JSON.stringify(queryData));
        user.find(queryData).toArray(function (err, teacherData) {
            // console.log("teacherData: " + JSON.stringify(teacherData));
            if (err) {
                responseData = {
                    "status": false,
                    "message": "Failed to Register",
                    "data": teacherData
                }
                res.status(400).send(responseData);
            }
            else {
                responseData = {
                    "status": true,
                    "errorCode": 200,
                    "message": "Data collected successfully",
                    "data": teacherData
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
    console.log("<--getAllTeacherList");
}

module.exports.getAllSchool = function (req, res) {
    console.log("getAllAdmin-->");
    var responseData;
    school.find().toArray(function (err, schoolList) {
        if (err) {
            responseData = {
                status: false,
                message: "Failed to get Data",
                data: schoolList
            };
            res.status(400).send(responseData);
        } else {
            responseData = {
                status: true,
                message: "All school collected successfully",
                data: schoolList
            };

            res.status(200).send(responseData);
        }

    })
    console.log("<--getAllAdmin");
}
module.exports.getAllAdmin = function (req, res) {
    console.log("getAllAdmin-->");
    var responseData;
    user.find({ "loginType": "admin" }).toArray(function (err, adminDataList) {
        if (err) {
            responseData = {
                status: false,
                message: "Failed to get Data",
                data: teacherData
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

module.exports.getSchoolUser = function (req, res) {
    console.log("getSchoolUser-->");
    var responseData;
    var schoolUserList = {

    };
    user.find({ "schoolName": req.params.schoolName }).toArray(function (err, teacherData) {
        //console.log("teacherData: " + JSON.stringify(teacherData));

        if (err) {
            responseData = {
                status: false,
                message: "Failed to get Data",
                data: teacherData
            };
            res.status(400).send(responseData);
        } else {
            schoolUserList.schoolTeacherList = teacherData;
            // console.log("schoolUserList: " + JSON.stringify(schoolUserList));
            stud.find({ "schoolName": req.params.schoolName }).toArray(function (err, studentData) {
                // console.log("studentData: " + JSON.stringify(studentData));

                if (err) {
                    responseData = {
                        status: false,
                        message: "Failed to get Data",
                        data: studentData
                    };
                    res.status(400).send(responseData);
                } else {
                    schoolUserList.schoolStudentList = studentData;
                    //console.log("schoolUserList: " + JSON.stringify(schoolUserList));
                    responseData = {
                        status: true,
                        message: "All user collected successfully",
                        data: schoolUserList
                    };

                    res.status(200).send(responseData);

                }

            })

        }
    })
    console.log("<--getSchoolUser");
}

module.exports.uploadClassFile = function (req, res) {
    console.log("uploadClassFile-->");
    var responseData;
    var section = [];
    var subject = [];
    var classSection = [];
    var consolidateCS = [];
    schoolName = req.params.schoolName;
    console.log("req.body.files: " + req.files.img);
    var fileName = req.files.img.name;
    var fileNameSeparate = fileName.split('_');
    if (fileNameSeparate[0] == 'ClassSubjectSection') {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');
        var studentDataFile = req.files.img;
        console.log("studentDataFile: " + studentDataFile);
        var parser = csv.fromString(studentDataFile.data.toString(), {
            headers: true,
            ignoreEmpty: true
        }).on("data", function (data) {
            console.log("data: " + JSON.stringify(data));
            var parts = data.Section.split(',');
            console.log("parts: " + JSON.stringify(parts));
            for (var x = 0; x <= parts.length; x++) {
                if (general.emptyCheck(parts[x])) {
                    section.push(parts[x]);
                }
            }
            console.log("section: " + JSON.stringify(section));
            var subjectParts = data.Subject.split(',');
            console.log("subjectParts: " + JSON.stringify(subjectParts));
            for (var x = 0; x <= subjectParts.length; x++) {
                if (general.emptyCheck(subjectParts[x])) {
                    subject.push(subjectParts[x]);
                }
            }
            console.log("subject: " + JSON.stringify(subject));
            consolidateCS.push({ "class": data.Class, "section": section, "subject": subject });
            section = [];
            subject = [];
            // classSection.push({"class":data.class, "section":[data]})
            // parser.pause();
        })
            .on("end", function () {
                console.log("end ");
                console.log("consolidateCS: " + JSON.stringify(consolidateCS));
                console.log("schoolName:" + schoolName);
                school.findOneAndUpdate({ "schoolName": schoolName }, { $push: { "css": { $each: consolidateCS } } }, { new: true }, function (err, data) {
                    console.log("data: " + JSON.stringify(data));
                    if (err) {
                        responseData = {
                            status: false,
                            message: err

                        };
                        res.status(400).send(responseData);
                    } else {
                        responseData = {
                            status: true,
                            errorCode: 200,
                            message: "Insert Successfull",
                            data: data
                        };
                        res.status(200).send(responseData);
                    }
                });

            });
    }
    else {
        responseData = {
            status: false,
            message: "Upload File Content is Mismatched"
        };
        res.status(400).send(responseData);
    }
    console.log("<--uploadClassFile");
};
module.exports.uploadTeacher_timeTable = function (req, res) {
    console.log("uploadTeacher_timeTable-->");
    var responseData;
    var consolidateTT = [];
    var timing = [];
    var css = {
        "Mon": [],
        "Tue": [],
        "Wed": [],
        "Thu": [],
        "Fri": [],
        "Sat": []
    };
    var count = 0;
    schoolName = req.params.schoolName;
    var id = req.params.id;
    console.log("req.body.files: " + req.files.img);
    var fileName = req.files.img.name;
    var fileNameSeparate = fileName.split('_');
    if (fileNameSeparate[0] == 'TimeTable') {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');
        var studentDataFile = req.files.img;
        console.log("studentDataFile: " + studentDataFile);
        var parser = csv.fromString(studentDataFile.data.toString(), {
            headers: true,
            ignoreEmpty: true
        }).on("data", function (data) {
            console.log("upload data: " + JSON.stringify(data));
            //var count = Object.keys(data).length;
            count = count + 1;
            var p = 0;
            for (var key in data) {
                p = p + 1;
                console.log(data[key]);
                console.log("key: " + key);
                console.log("data[key]: " + data[key]);
                var parts = key.split('-');
                console.log("parts.length: " + parts.length);
                console.log("parts: " + JSON.stringify(parts));

                if (count == 1) {
                    console.log("parts: " + JSON.stringify(parts));
                    timing.push({ "periods": p, "startsAt": parts[0], "endsAt": parts[1] });
                }
                var cssParts = data[key].split('-');
                if (count == 1) {
                    css.Mon.push({ "class": cssParts[0], "section": cssParts[1], "subject": cssParts[2] });
                }
                else if (count == 2) {
                    css.Tue.push({ "class": cssParts[0], "section": cssParts[1], "subject": cssParts[2] });
                }
                else if (count == 3) {
                    css.Wed.push({ "class": cssParts[0], "section": cssParts[1], "subject": cssParts[2] });
                }
                else if (count == 4) {
                    css.Thu.push({ "class": cssParts[0], "section": cssParts[1], "subject": cssParts[2] });
                }
                else if (count == 5) {
                    css.Fri.push({ "class": cssParts[0], "section": cssParts[1], "subject": cssParts[2] });
                }
                else if (count == 6) {
                    css.Sat.push({ "class": cssParts[0], "section": cssParts[1], "subject": cssParts[2] });
                }

            }

            console.log("timing: " + JSON.stringify(timing));
        })
            .on("end", function () {
                console.log("end ");
                consolidateTT.push({ "timing": timing, "css": css });
                console.log("consolidateTT: " + JSON.stringify(consolidateTT));
                user.find({ "_id": ObjectId(id), "schoolName": schoolName }).toArray(function (err, userData) {
                    console.log("userData: " + JSON.stringify(userData));
                    console.log("userData[0].timeTable.length: " + userData[0].timeTable.length);
                    if (err) {
                        responseData = {
                            status: false,
                            message: err

                        };
                        res.status(400).send(responseData);
                    } else {
                        if (userData[0].timeTable.length > 0) {
                            responseData = {
                                status: true,
                                errorCode: 200,
                                message: "Sorry! You Already updated value",
                                data: userData
                            };
                            res.status(200).send(responseData);
                        }
                        else {
                            user.findOneAndUpdate({ "_id": ObjectId(id), "schoolName": schoolName }, { $push: { "timeTable": { $each: consolidateTT } } }, { new: true }, function (err, updatedData) {
                                console.log("data: " + JSON.stringify(updatedData));
                                if (err) {
                                    responseData = {
                                        status: false,
                                        message: err

                                    };
                                    res.status(400).send(responseData);
                                } else {
                                    responseData = {
                                        status: true,
                                        errorCode: 200,
                                        message: "Updated  Successfull",
                                        data: updatedData
                                    };
                                    res.status(200).send(responseData);
                                }
                            });
                        }
                    }
                })


            });
    }
    else {
        responseData = {
            status: false,
            message: "Upload File Content is Mismatched"
        };
        res.status(400).send(responseData);
    }
    console.log("<--uploadTeacher_timeTable");
};
module.exports.updateTeacher_timeTable = function (req, res) {
    console.log("uploadStudentMaster-->");
    var responseData;

    var timing = [];
    var css = {
        "Mon": [],
        "Tue": [],
        "Wed": [],
        "Thu": [],
        "Fri": [],
        "Sat": []
    };
    var count = 0;
    schoolName = req.params.schoolName;
    var id = req.params.id;
    var fileName = req.files.img.name;
    var fileNameSeparate = fileName.split('_');
    if (fileNameSeparate[0] == 'TimeTable') {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');
        var studentDataFile = req.files.img;
        console.log("studentDataFile: " + studentDataFile);
        var parser = csv.fromString(studentDataFile.data.toString(), {
            headers: true,
            ignoreEmpty: true
        }).on("data", function (data) {
            console.log("upload data: " + JSON.stringify(data));
            //var count = Object.keys(data).length;
            count = count + 1;
            var p = 0;
            for (var key in data) {
                p = p + 1;
                console.log(data[key]);
                console.log("key: " + key);
                console.log("data[key]: " + data[key]);
                var parts = key.split('-');
                console.log("parts.length: " + parts.length);
                console.log("parts: " + JSON.stringify(parts));

                if (count == 1) {
                    console.log("parts: " + JSON.stringify(parts));
                    timing.push({ "periods": p, "startsAt": parts[0], "endsAt": parts[1] });
                }
                var cssParts = data[key].split('-');
                if (count == 1) {
                    css.Mon.push({ "class": cssParts[0], "section": cssParts[1], "subject": cssParts[2] });
                }
                else if (count == 2) {
                    css.Tue.push({ "class": cssParts[0], "section": cssParts[1], "subject": cssParts[2] });
                }
                else if (count == 3) {
                    css.Wed.push({ "class": cssParts[0], "section": cssParts[1], "subject": cssParts[2] });
                }
                else if (count == 4) {
                    css.Thu.push({ "class": cssParts[0], "section": cssParts[1], "subject": cssParts[2] });
                }
                else if (count == 5) {
                    css.Fri.push({ "class": cssParts[0], "section": cssParts[1], "subject": cssParts[2] });
                }
                else if (count == 6) {
                    css.Sat.push({ "class": cssParts[0], "section": cssParts[1], "subject": cssParts[2] });
                }

            }
            console.log("timing: " + JSON.stringify(timing));
        })
            .on("end", function () {
                console.log("end ");
                var consolidateTT = [{ "timing": timing, "css": css }];
                console.log("consolidateTT: " + JSON.stringify(consolidateTT));
                var id = { "_id": ObjectId(req.params.id) }
                user.findOneAndUpdate(id, { $set: { "timeTable": consolidateTT } }, { new: true }, function (err, updatedData) {
                    console.log("data: " + JSON.stringify(updatedData));
                    if (err) {
                        responseData = {
                            status: false,
                            message: err

                        };
                        res.status(400).send(responseData);
                    } else {
                        responseData = {
                            status: true,
                            errorCode: 200,
                            message: "Updated  Successfull",
                            data: updatedData
                        };
                        res.status(200).send(responseData);
                    }
                });
            })
    }
    else {
        responseData = {
            status: false,
            message: "Upload File Content is Mismatched"
        };
        res.status(400).send(responseData);
    }
    console.log("<--uploadStudentMaster");
}

module.exports.uploadPeriodsFile = function (req, res) {
    console.log("uploadClassFile-->");
    var responseData;
    var consolidateResult = [];
    schoolName = req.params.schoolName;
    console.log("req.body.files: " + req.files.img);
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    var studentDataFile = req.files.img;
    console.log("studentDataFile: " + studentDataFile);
    var parser = csv.fromString(studentDataFile.data.toString(), {
        headers: true,
        ignoreEmpty: true
    }).on("data", function (data) {
        console.log("data: " + JSON.stringify(data));
        var count = Object.keys(data).length;
        // for (var x = 0; x < count; x++) {
        for (var key in data) {
            console.log(data[key]);
            console.log("key: " + key);
            console.log("data[key]: " + data[key]);
            var parts = data[key].split('-');
            console.log("parts: " + JSON.stringify(parts));
            consolidateResult.push({ "periods": key, "startsAt": parts[0], "endsAt": parts[1] });
        }

        // }

    })
        .on("end", function () {
            console.log("end ");
            console.log("consolidateResult: " + JSON.stringify(consolidateResult));

            school.findOneAndUpdate({ "schoolName": schoolName }, { $push: { "timeTable_timing": { $each: consolidateResult } } }, { new: true }, function (err, data) {
                console.log("data: " + JSON.stringify(data));
                if (err) {
                    responseData = {
                        status: false,
                        message: err

                    };
                    res.status(400).send(responseData);
                } else {
                    responseData = {
                        status: true,
                        errorCode: 200,
                        message: "Insert Successfull",
                        data: data
                    };
                    res.status(200).send(responseData);
                }
            });

        });
    console.log("<--uploadClassFile");
};

module.exports.uploadMarkFile = function (req, res) {
    console.log("uploadMarkFile-->");
    schoolName = req.params.schoolName;
    testType = req.params.testType;
    testStartDate = req.params.date;
    clas = req.params.clas;
    section = req.params.section;
    console.log("req.body.files: " + req.files.img);
    var fileName = req.files.img.name;
    var fileNameSeparate = fileName.split('_');
    if (fileNameSeparate[0] == 'Mark') {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');
        var studentDataFile = req.files.img;
        console.log("studentDataFile: " + studentDataFile);
        var parser = csv.fromString(studentDataFile.data.toString(), {
            headers: true,
            ignoreEmpty: true
        }).on("data", function (data) {
            console.log("upload data: " + JSON.stringify(data));
            parser.pause();
            //var count = Object.keys(data).length;
            var studIdForFindQry = {
                "cs": [{ "class": clas, "section": section }]
            }
            stud.find(studIdForFindQry).toArray(function (err, findData) {
                console.log("class section query findData: " + JSON.stringify(findData));
                console.log("class section query findData.length: " + findData.length);
                if (err) {
                    marker = false;
                    responseData = {
                        status: false,
                        message: err
                    };
                    res.status(400).send(responseData);
                }
                else {
                    if (findData.length > 0) {
                        parser.pause();
                        module.exports.uploadMarkSheet(data, function (err) {
                            console.log("savedatInitiate");
                            parser.resume();
                        });
                    }
                    else {
                        responseData = {
                            status: false,
                            message: "There is no record for this class and section"
                        };
                        res.status(400).send(responseData);
                    }
                }
            })
        })
            .on("end", function () {
                console.log("end ");
                console.log("end marker: " + marker);
                if (marker == false) {
                    responseData = {
                        status: false,
                        message: message
                    };
                    res.status(400).send(responseData);
                }
                else if (marker == true) {
                    console.log("unknownData: " + JSON.stringify(unknownData));
                    var unknownStud = unknownData;
                    responseData = {
                        status: true,
                        message: "Successfull updated data",
                        data: unknownStud
                    };
                    unknownData = [];
                    res.status(200).send(responseData);
                }
            })
    }
    else {
        responseData = {
            status: false,
            message: "Upload File Content is Mismatched"
        };
        res.status(400).send(responseData);
    }
    console.log("<--uploadMarkFile");
}
module.exports.uploadMarkSheet = function (data, callback) {
    console.log('inside saving -->uploadMarkSheet')
    // Simulate an asynchronous operation:
    var date = testStartDate;
    var mark = {};
    counter = counter + 1;

    for (var key in data) {
        console.log(data[key]);
        console.log("key: " + key);
        console.log("data[key]: " + data[key]);
        if (key != "StudentID" && key != "StudentName") {
            mark[key] = data[key];
        }
    }
    console.log("mark: " + JSON.stringify(mark));
    var consolidateMS = [{
        "date": date,
        "mark": mark
    }]
    var studIdForFindQry = {
        "schoolId": data.StudentID,
        "schoolName": schoolName
    }
    var studIdForUpdateQry = {
        "schoolId": data.StudentID,
        "schoolName": schoolName,
        "mark.testType": testType,
        "cs": [{ "class": clas, "section": section }]
    }
    console.log("studIdForFindQry: " + JSON.stringify(studIdForFindQry));
    console.log("studIdForUpdateQry: " + JSON.stringify(studIdForUpdateQry));

    stud.find(studIdForFindQry).toArray(function (err, findData) {
        // console.log("1st query findData: " + JSON.stringify(findData));
        console.log("1st query findData.length: " + findData.length);
        if (err) {
            marker = true;
            if (callback) callback();
        }
        else {
            if (findData.length > 0) {
                console.log("consolidateMS: " + JSON.stringify(consolidateMS));
                stud.findOneAndUpdate(studIdForUpdateQry, { $push: { "mark.$.subjectWithMark": { $each: consolidateMS } } }, function (err, data) {
                    // console.log("2nd query started: " + JSON.stringify(data));
                    console.log("2nd query data.length: " + data.length);
                    if (err) {
                        marker = true;
                        if (callback) callback();
                    }
                    else {
                        marker = true;
                        if (callback) callback();
                    }
                })
            }
            else {
                console.log("NO Detail found for this id");
                marker = true;
                var obj = {
                    "StudentID": data.StudentID,
                    "StudentName": data.StudentName
                }
                unknownData.push(obj);
                message = "Sorry! For this Id there is no student data";

                if (callback) callback();
            }
        }
    })

}
module.exports.uploadFeeFile = function (req, res) {
    console.log("uploadFeeFile-->");
    schoolName = req.params.schoolName;
    feeType = req.params.reportType;
    clas = req.params.clas;
    section = req.params.section;

    if (feeType == 'Other') {
        fee_otherName = req.params.fee_otherName;
    }
    else {

    }
    console.log("req.body.files: " + req.files.img);
    var fileName = req.files.img.name;
    var fileNameSeparate = fileName.split('_');
    if (fileNameSeparate[0] == 'Fee') {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');
        var studentDataFile = req.files.img;
        console.log("studentDataFile: " + JSON.stringify(studentDataFile));
        var parser = csv.fromString(studentDataFile.data.toString(), {
            headers: true,
            ignoreEmpty: true
        }).on("data", function (data) {
            console.log("upload data: " + JSON.stringify(data));
            parser.pause();
            //var count = Object.keys(data).length;
            var studIdForFindQry = {
                "cs": [{ "class": clas, "section": section }]
            }
            stud.find(studIdForFindQry).toArray(function (err, findData) {
                // console.log("class section query findData: " + JSON.stringify(findData));
                //console.log("class section query findData.length: " + findData.length);
                if (err) {
                    marker = false;
                    responseData = {
                        status: false,
                        message: err
                    };
                    res.status(400).send(responseData);
                }
                else {
                    if (findData.length > 0) {
                        parser.pause();
                        module.exports.uploadFeeSheet(data, function (err) {
                            console.log("savedatInitiate");
                            parser.resume();
                        });
                    }
                    else {
                        responseData = {
                            status: false,
                            message: "There is no record for this class and section"
                        };
                        res.status(400).send(responseData);
                    }
                }
            })
        })
            .on("end", function () {
                console.log("end ");
                console.log("end marker: " + marker);
                if (marker == false) {
                    responseData = {
                        status: false,
                        message: message
                    };
                    res.status(400).send(responseData);
                }
                else if (marker == true) {
                    console.log("unknownData: " + JSON.stringify(unknownData));
                    var unknownStud = unknownData;
                    responseData = {
                        status: true,
                        message: "Successfull updated data",
                        data: unknownStud
                    };
                    unknownData = [];
                    res.status(200).send(responseData);
                }
            })
    }
    else {
        responseData = {
            status: false,
            message: "Upload File Content is Mismatched"
        };
        res.status(400).send(responseData);
    }
    console.log("<--uploadFeeFile");
}
module.exports.uploadFeeSheet = function (data, callback) {
    console.log('inside saving -->uploadMarkSheet')
    // Simulate an asynchronous operation:
    var date = testStartDate;
    console.log("feeType: " + feeType);
    counter = counter + 1;

    var fee = [{
        "paymentOption": data.PaymentOption,
        "totalAmount": data.TotalAmount,
        "amountPaid": data.AmountPaid,
        "PaidDate": data.PaidDate,
        "dueAmout": data.DueAmount,
        "lastDateToPaid": data.LastDateToPaid
    }];
    if (feeType == 'Other') {
        fee[0].fee_otherName = fee_otherName;
    }

    var studIdForFindQry = {
        "schoolId": data.StudentID,
        "schoolName": schoolName
    }
    var studIdForUpdateQry = {
        "schoolId": data.StudentID,
        "schoolName": schoolName,
        "fee.feeType": feeType,
        "cs": [{ "class": clas, "section": section }]
    }
    console.log("studIdForFindQry: " + JSON.stringify(studIdForFindQry));
    console.log("studIdForUpdateQry: " + JSON.stringify(studIdForUpdateQry));

    stud.find(studIdForFindQry).toArray(function (err, findData) {
        // console.log("1st query findData: " + JSON.stringify(findData));
        console.log("1st query findData.length: " + findData.length);
        if (err) {
            marker = true;
            if (callback) callback();
        }
        else {
            if (findData.length > 0) {
                console.log("fee: " + JSON.stringify(fee));
                stud.update(studIdForUpdateQry, { $push: { "fee.$.details": { $each: fee } } }, function (err, updatedQryData) {
                    console.log("2nd query started: " + JSON.stringify(updatedQryData));
                    //console.log("2nd query data.length: " + updatedQryData.length);
                    if (err) {
                        marker = true;
                        if (callback) callback();
                    }
                    else {
                        marker = true;
                        if (callback) callback();
                    }
                })
            }
            else {
                console.log("NO Detail found for this id");
                marker = true;
                var obj = {
                    "StudentID": data.StudentID,
                    "StudentName": data.StudentName
                }
                unknownData.push(obj);
                message = "Sorry! For this Id there is no student data";

                if (callback) callback();
            }
        }
    })

}


module.exports.markUpdate = function (req, res) {
    console.log("markUpdate-->");
    schoolName = req.params.schoolName;
    testType = req.params.testType;
    testStartDate = req.params.date;
    clas = req.params.clas;
    section = req.params.section;
    console.log("schoolName: " + schoolName + " testType: " + testType + " testStartDate: " + testStartDate + " clas: " + clas + " section: " + section);
    console.log("req.body.files: " + req.files.img);
    var fileName = req.files.img.name;
    var fileNameSeparate = fileName.split('_');
    if (fileNameSeparate[0] == 'Mark') {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');
        var studentDataFile = req.files.img;
        console.log("studentDataFile: " + studentDataFile);
        var parser = csv.fromString(studentDataFile.data.toString(), {
            headers: true,
            ignoreEmpty: true
        }).on("data", function (data) {
            console.log("upload data: " + JSON.stringify(data));
            parser.pause();
            //var count = Object.keys(data).length;
            var studIdForFindQry = {
                "cs": [{ "class": clas, "section": section }]
            }
            stud.find(studIdForFindQry).toArray(function (err, findData) {
                console.log("class section query findData: " + JSON.stringify(findData));
                console.log("class section query findData.length: " + findData.length);
                if (err) {
                    marker = false;
                    responseData = {
                        status: false,
                        message: err
                    };
                    res.status(400).send(responseData);
                }
                else {
                    if (findData.length > 0) {
                        parser.pause();
                        module.exports.updateMarkSheet(data, function (err) {
                            console.log("savedatInitiate");
                            parser.resume();
                        });
                    }
                    else {
                        responseData = {
                            status: false,
                            message: "There is no record for this class and section"
                        };
                        res.status(400).send(responseData);
                    }
                }
            })
        })
            .on("end", function () {
                console.log("end ");
                console.log("end marker: " + marker);
                if (marker == false) {
                    responseData = {
                        status: false,
                        message: message
                    };
                    res.status(400).send(responseData);
                }
                else if (marker == true) {
                    console.log("unknownData: " + JSON.stringify(unknownData));
                    var unknownStud = unknownData;
                    responseData = {
                        status: true,
                        message: "Successfull updated data",
                        data: unknownStud
                    };
                    unknownData = [];
                    res.status(200).send(responseData);
                }
            })
    }
    else {
        responseData = {
            status: false,
            message: "Upload File Content is Mismatched"
        };
        res.status(400).send(responseData);
    }

    console.log("<--markUpdate");
}
module.exports.feeUpdate = function (req, res) {
    console.log("feeUpdate-->");
    schoolName = req.params.schoolName;
    feeType = req.params.reportType;
    clas = req.params.clas;
    section = req.params.section;
    console.log("schoolName: " + schoolName + " feeType: " + feeType + " clas: " + clas + " section: " + section);
    console.log("req.body.files: " + req.files.img);
    var fileName = req.files.img.name;
    var fileNameSeparate = fileName.split('_');
    console.log("fileNameSeparate[0]: " + fileNameSeparate[0]);
    if (fileNameSeparate[0] == 'FeeUpdate') {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');
        var studentDataFile = req.files.img;
        console.log("studentDataFile: " + studentDataFile);
        var parser = csv.fromString(studentDataFile.data.toString(), {
            headers: true,
            ignoreEmpty: true
        }).on("data", function (data) {
            console.log("upload data: " + JSON.stringify(data));
            parser.pause();
            //var count = Object.keys(data).length;
            var studIdForFindQry = {
                "cs": [{ "class": clas, "section": section }]
            }
            stud.find(studIdForFindQry).toArray(function (err, findData) {
                //console.log("class section query findData: " + JSON.stringify(findData));
                //console.log("class section query findData.length: " + findData.length);
                if (err) {
                    marker = false;
                    responseData = {
                        status: false,
                        message: err
                    };
                    res.status(400).send(responseData);
                }
                else {
                    if (findData.length > 0) {
                        parser.pause();
                        module.exports.updateFeeSheet(data, function (err) {
                            console.log("savedatInitiate");
                            parser.resume();
                        });
                    }
                    else {
                        responseData = {
                            status: false,
                            message: "There is no record for this class and section"
                        };
                        res.status(400).send(responseData);
                    }
                }
            })
        })
            .on("end", function () {
                console.log("end ");
                console.log("end marker: " + marker);
                if (marker == false) {
                    responseData = {
                        status: false,
                        message: message
                    };
                    res.status(400).send(responseData);
                }
                else if (marker == true) {
                    console.log("unknownData: " + JSON.stringify(unknownData));
                    var unknownStud = unknownData;
                    responseData = {
                        status: true,
                        message: "Successfull updated data",
                        data: unknownStud
                    };
                    unknownData = [];
                    res.status(200).send(responseData);
                }
            })
    }
    else {
        responseData = {
            status: false,
            message: "Upload File Content is Mismatched"
        };
        res.status(400).send(responseData);
    }

    console.log("<--feeUpdate");
}
module.exports.updateFeeSheet = function (data, callback) {

    console.log('inside saving -->updateFileSheet')
    counter = counter + 1;
    var fee = [{
        "paymentOption": data.PaymentOption,
        "totalAmount": data.TotalAmount,
        "amountPaid": data.AmountPaid,
        "PaidDate": data.PaidDate,
        "dueAmout": data.DueAmount,
        "lastDateToPaid": data.LastDateToPaid
    }];
    console.log("fee: " + JSON.stringify(fee));
    var studIdForFindQry = {
        "schoolId": data.StudentID,
        "schoolName": schoolName
    }
    var studIdForUpdateQry = {
        "schoolId": data.StudentID,
        "schoolName": schoolName,
        "fee.feeType": feeType,
        "cs": [{ "class": clas, "section": section }]
    }
    console.log("studIdForFindQry: " + JSON.stringify(studIdForFindQry));
    console.log("studIdForUpdateQry: " + JSON.stringify(studIdForUpdateQry));

    stud.find(studIdForFindQry).toArray(function (err, findData) {
        // console.log("1st query findData: " + JSON.stringify(findData));
        console.log("1st query findData.length: " + findData.length);
        if (err) {
            marker = true;
            if (callback) callback();
        }
        else {
            if (findData.length > 0) {
                //console.log("consolidateMS: " + JSON.stringify(consolidateMS));
                stud.update(studIdForUpdateQry, { $set: { "fee.$.details": [] } }, function (err, pulledData) {
                    console.log("2nd query data.length: " + JSON.stringify(pulledData));
                    if (err) {
                        marker = false;
                        if (callback) callback();
                    }
                    else {
                        stud.update(studIdForUpdateQry, { $push: { "fee.$.details": { $each: fee } } }, function (err, pulledData) {
                            if (err) {
                                marker = false;
                                if (callback) callback();
                            }
                            else {
                                marker = true;
                                if (callback) callback();
                            }
                        })
                    }
                })
            }
            else {
                console.log("NO Detail found for this id");
                marker = true;
                var obj = {
                    "StudentID": data.StudentID,
                    "StudentName": data.StudentName
                }
                unknownData.push(obj);
                message = "Sorry! For this Id there is no student data";

                if (callback) callback();
            }
        }
    })

    console.log("<--updateMarkSheet");
}
module.exports.updateMarkSheet = function (data, callback) {

    console.log('inside saving -->updateMarkSheet')
    // Simulate an asynchronous operation:
    var date = testStartDate;
    var mark = {};
    counter = counter + 1;

    for (var key in data) {
        console.log(data[key]);
        console.log("key: " + key);
        console.log("data[key]: " + data[key]);
        if (key != "StudentID" && key != "StudentName") {
            mark[key] = data[key];
        }
    }
    console.log("mark: " + JSON.stringify(mark));
    var consolidateMS = [{
        "date": date,
        "mark": mark
    }]
    var studIdForFindQry = {
        "schoolId": data.StudentID,
        "schoolName": schoolName
    }
    var studIdForUpdateQry = {
        "schoolId": data.StudentID,
        "schoolName": schoolName,
        "mark.testType": testType,
        "cs": [{ "class": clas, "section": section }]
    }
    console.log("studIdForFindQry: " + JSON.stringify(studIdForFindQry));
    console.log("studIdForUpdateQry: " + JSON.stringify(studIdForUpdateQry));

    stud.find(studIdForFindQry).toArray(function (err, findData) {
        // console.log("1st query findData: " + JSON.stringify(findData));
        console.log("1st query findData.length: " + findData.length);
        if (err) {
            marker = true;
            if (callback) callback();
        }
        else {
            if (findData.length > 0) {
                console.log("consolidateMS: " + JSON.stringify(consolidateMS));
                stud.update(studIdForUpdateQry, { $pull: { "mark.$.subjectWithMark": { "date": date } } }, function (err, pulledData) {
                    //stud.findOneAndUpdate(studIdForUpdateQry, { $push: { "mark.$.subjectWithMark": { $each: consolidateMS } } }, function (err, data) {

                    console.log("2nd query data.length: " + JSON.stringify(pulledData));
                    if (err) {
                        marker = false;
                        if (callback) callback();
                    }
                    else {
                        stud.update(studIdForUpdateQry, { $push: { "mark.$.subjectWithMark": { $each: consolidateMS } } }, function (err, pulledData) {
                            if (err) {
                                marker = false;
                                if (callback) callback();
                            }
                            else {
                                marker = true;
                                if (callback) callback();
                            }
                        })
                    }
                })
            }
            else {
                console.log("NO Detail found for this id");
                marker = true;
                var obj = {
                    "StudentID": data.StudentID,
                    "StudentName": data.StudentName
                }
                unknownData.push(obj);
                message = "Sorry! For this Id there is no student data";

                if (callback) callback();
            }
        }
    })

    console.log("<--updateMarkSheet");
}
module.exports.uploadAttendance = function (req, res) {
    expectedMessage = '';
    console.log("uploadAttendance-->");
    var responseData;
    schoolName = req.params.schoolName;

    console.log("req.body.files: " + JSON.stringify(req.files.img));
    // console.log("req.body.files: " + req.files.fullName);
    var fileName = req.files.img.name;
    var fileNameSeparate = fileName.split('_');
    if (fileNameSeparate[0] == 'Attendance') {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');
        var studentDataFile = req.files.img;
        console.log("studentDataFile: " + studentDataFile);
        var parser = csv.fromString(studentDataFile.data.toString(), {
            headers: true,
            ignoreEmpty: true
        }).on("data", function (data) {
            console.log("data: " + JSON.stringify(data));
            console.log("req.reportType: " + req.params.reportType);
            parser.pause();
            month = req.params.month;
            if (req.params.reportType == "Daily") {

                console.log("daily started-->");
                module.exports.dailyData(data, function (err) {
                    console.log("savedatInitiate");
                    // TODO: handle error
                    console.log("unknownData: " + JSON.stringify(unknownData));
                    parser.resume();
                });
            }
            if (req.params.reportType == "Monthly") {

                module.exports.monthlyData(data, function (err) {
                    console.log("savedatInitiate");
                    // TODO: handle error
                    console.log("unknownData: " + JSON.stringify(unknownData));
                    console.log("expectedMessage: " + expectedMessage);
                    if (expectedMessage) {
                        var responseData = {
                            status: false,
                            note: "upload not satisfied",
                            message: expectedMessage
                        };
                        res.status(400).send(responseData);
                    }
                    else {
                        parser.resume();
                    }

                });
            }
        })
            .on("end", function () {
                console.log("end marker: " + marker);
                if (marker == false) {
                    responseData = {
                        status: false,
                        message: message
                    };
                    res.status(400).send(responseData);
                }
                else if (marker == true) {
                    console.log("unknownData: " + JSON.stringify(unknownData));
                    var unknownStud = unknownData;
                    responseData = {
                        status: true,
                        message: "Successfull updated data",
                        data: unknownStud
                    };
                    unknownData = [];
                    res.status(200).send(responseData);
                }


            });
    }
    else {
        responseData = {
            status: false,
            message: "Upload File Content is Mismatched"
        };
        res.status(400).send(responseData);
    }
    console.log("<--uploadAttendance");
};
/* ### Start upload daily attendance status  ### */
module.exports.dailyData = function (data, callback) {
    console.log('inside dailyData insert saving')
    var day;
    var attndnce;
    //var dateString = data.Date;

    var parts = month.split('-');
    console.log("parts: " + JSON.stringify(parts));

    day = parts[1];
    month = parts[0];
    attndnce = { 'date': day, 'status': data.Status };

    console.log("attndnce: " + JSON.stringify(attndnce));

    console.log("attndnce: " + JSON.stringify(attndnce));
    var studIdForFindQry = {
        "schoolId": data.StudentID,
        "schoolName": schoolName,
        "attendance.month": month
    }
    console.log("studIdForFindQry: " + JSON.stringify(studIdForFindQry));
    var studIdForUpdateQry = {
        "schoolId": data.StudentID,
        "attendance.month": month,
        "schoolName": schoolName
    }
    console.log("studIdForUpdateQry: " + JSON.stringify(studIdForUpdateQry));
    stud.find({ "schoolName": schoolName, "schoolId": data.StudentID }).toArray(function (err, isThereData) {
        console.log("Basic query: " + JSON.stringify(isThereData));
        console.log("Basic query: " + isThereData.length);
        if (err) {
            console.log("error: " + err);
            message = err;
            marker = false;
            if (callback) callback();
        }
        else {

            if (isThereData.length > 0) {
                stud.find(studIdForFindQry).toArray(function (err, findData) {
                    console.log("*1st query findData: " + JSON.stringify(findData));
                    // console.log("1st query findData.length: " + findData.attendance);
                    if (err) {
                        marker = true;
                        if (callback) callback();
                    }
                    else {

                        var monthStrategy = {
                            "Jan": 1,
                            "Feb": 2,
                            "Mar": 3,
                            "Apr": 4,
                            "May": 5,
                            "Jun": 6,
                            "Jul": 7,
                            "Aug": 8,
                            "Sep": 9,
                            "Oct": 10,
                            "Nov": 11,
                            "Dec": 12
                        };
                        console.log("monthStrategy[" + month + "]: " + monthStrategy[month]);
                        var attendanceQueryIndex = monthStrategy[month]; /* ##### Note: requested attendance index find from document  ##### */
                        var dateAllreadyExists;
                        console.log("findData[0].attendance[" + attendanceQueryIndex + "]: " + JSON.stringify(findData[0].attendance[attendanceQueryIndex - 1]));
                        console.log("findData[0].attendance[" + attendanceQueryIndex + "].dateAttendance: " + JSON.stringify(findData[0].attendance[attendanceQueryIndex - 1].dateAttendance));
                        var findDataAttendance = findData[0].attendance[attendanceQueryIndex - 1].dateAttendance;
                        console.log("findDataAttendance: " + JSON.stringify(findDataAttendance));
                        for (var x = 0; x < findDataAttendance.length; x++) {
                            if (findDataAttendance[x].date == 1) {
                                dateAllreadyExists = true;
                            }
                            else {
                                dateAllreadyExists = false;
                            }
                        }
                        if (dateAllreadyExists == false || findDataAttendance.length == 0) {
                            stud.update(studIdForUpdateQry, { $push: { "attendance.$.dateAttendance": attndnce } }, function (err, data) {
                                console.log("2nd query started: " + JSON.stringify(data));
                                console.log("2nd query data.length: " + data.length);
                                if (err) {
                                    marker = true;
                                    if (callback) callback();
                                }
                                else {
                                    marker = true;
                                    if (callback) callback();
                                }
                            })
                        }
                        else {
                            marker = false;

                            message = "Sorry! You already updated for this date";

                            if (callback) callback();
                        }
                    }
                })
            }
            else {
                console.log("unknown started");
                var obj = {
                    "StudentID": data.StudentID,
                    "StudentName": data.StudentName
                }
                unknownData.push(obj);
                if (callback) callback();
            }
        }
    })
}
/* ### End upload daily attendance status  ### */
/* ### Start upload Monthly attendance status  ### */
module.exports.monthlyData = function (data, callback) {
    console.log('inside saving');
    var arrayLength;
    console.log("monthly started-->");
    console.log("req.params.month: " + month);
    // var marker;
    var studIdForFindQry = {
        "schoolId": data.StudentID,
        "attendance.month": month,
        "schoolName": schoolName
    }
    var columnLength = Object.keys(data).length; /* ##### Note: Number of column from uploaded files ##### */
    console.log("columnLength: " + columnLength);
    if (month == "Jan" || month == "Mar" || month == "May" || month == "Jul" || month == "Aug" || month == "Oct" || month == "Dec") {
        console.log("JAN");
        if (columnLength == 33) {

            if (month == "Jan") {
                attendanceIndex = 0;
            }
            else if (month == "Mar") {
                attendanceIndex = 2;
            }
            else if (month == "May") {
                attendanceIndex = 4;
            }
            else if (month == "Jul") {
                attendanceIndex = 6;
            }
            else if (month == "Aug") {
                attendanceIndex = 7;
            }
            else if (month == "Oct") {
                attendanceIndex = 9;
            }
            else if (month == "Dec") {
                attendanceIndex = 11;
            }
            for (var x = 1; x <= 31; x++) {
                console.log("x: " + x);
                monthAtt.push({ "date": x, "status": data[x] });
                if (x == 31) {
                    break;
                }
            }

        }
        else {

            expectedMessage = "Failled to upload! Expecting 31 days attendance status for " + month;
            if (callback) callback();
        }
    }
    else if (month == "Feb") {
        console.log("FEB");
        attendanceIndex = 1;
        if (columnLength == 30) {
            for (var x = 1; x <= 28; x++) {
                console.log("x: " + x);
                monthAtt.push({ "date": x, "status": data[x] });
                if (x == 28) {
                    break;
                }
            }
        }
        else {

            expectedMessage = "Failled to upload! Expecting 28 days attendance status for " + month;
            if (callback) callback();
        }
    }
    else if (month == "Apr" || month == "Jun" || month == "Sep" || month == "Nov") {
        if (columnLength == 30 + 2) {
            if (month == "Apr") {
                attendanceIndex = 3;
            }
            else if (month == "Jun") {
                attendanceIndex = 5;
            }
            else if (month == "Sep") {
                attendanceIndex = 8;
            }
            else if (month == "Nov") {
                attendanceIndex = 10;
            }
            for (var x = 1; x <= 30; x++) {
                console.log("x: " + x);
                monthAtt.push({ "date": x, "status": data[x] });
                if (x == 28) {
                    break;
                }
            }
        }
        else {

            expectedMessage = "Failled to upload! Expecting 30 days attendance status for " + month;
            if (callback) callback();
        }
    }

    console.log("*monthAtt: " + monthAtt.length);
    var idCheck = { "schoolName": schoolName, "schoolId": data.StudentID };
    console.log("idCheck: " + JSON.stringify(idCheck));
    stud.find(idCheck).toArray(function (err, isThereData) {
        console.log("Basic query: " + JSON.stringify(isThereData));
        console.log("Basic query: " + isThereData.length);
        if (err) {
            console.log("error: " + err);
            message = err;
            marker = false;
            if (callback) callback();
        }
        else {
            if (isThereData.length > 0) {
                console.log("month: " + month);

                stud.find({ "schoolName": schoolName, "schoolId": data.StudentID, "attendance.month": month }).toArray(function (err, findData) {
                    console.log("1st query findData: " + JSON.stringify(findData));
                    console.log("attendanceIndex: " + JSON.stringify(findData[0].attendance[attendanceIndex]));
                    console.log("dateAttendance: " + JSON.stringify(findData[0].attendance[attendanceIndex].dateAttendance));
                    arrayLength = findData[0].attendance[attendanceIndex].dateAttendance.length;
                    if (err) {
                        console.log("error: " + err);
                        message = err;
                        marker = false;
                        if (callback) callback();
                    }
                    else {
                        console.log("no erroe");
                        console.log("arrayLength: " + arrayLength);
                        if (arrayLength == 0) {
                            console.log("second query started");
                            console.log("studIdForFindQry: " + JSON.stringify(studIdForFindQry));
                            console.log("monthAtt: " + JSON.stringify(monthAtt));
                            stud.update(studIdForFindQry, { $push: { "attendance.$.dateAttendance": { $each: monthAtt } } }, function (err, findData) {
                                console.log("update month started: " + JSON.stringify(data));
                                monthAtt = [];
                                if (err) {
                                    marker = false;
                                    message = err;
                                    if (callback) callback();
                                }
                                else {
                                    marker = true;
                                    if (callback) callback();
                                }
                            })
                        }
                        else {
                            marker = false;
                            message = "Sorry! you already updated for this month";
                            if (callback) callback();
                        }

                    }
                })
            }
            else {
                console.log("unknown started");
                var obj = {
                    "StudentID": data.StudentID,
                    "StudentName": data.StudentName
                }
                unknownData.push(obj);
                if (callback) callback();
            }
        }
    })
}
/* ### End upload Monthly attendance status  ### */
module.exports.attendanceUpdate = function (req, res) {
    console.log("attendanceUpdate-->");
    expectedMessage = '';

    var responseData;
    schoolName = req.params.schoolName;
    console.log("req.body.files: " + req.files.img);
    var fileName = req.files.img.name;
    var fileNameSeparate = fileName.split('_');
    if (fileNameSeparate[0] == 'Attendance') {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');
        var studentDataFile = req.files.img;
        console.log("studentDataFile: " + studentDataFile);
        var parser = csv.fromString(studentDataFile.data.toString(), {
            headers: true,
            ignoreEmpty: true
        }).on("data", function (data) {
            console.log("data: " + JSON.stringify(data));
            console.log("req.reportType: " + req.params.reportType);
            parser.pause();
            month = req.params.month;
            if (req.params.reportType == "Daily") {
                console.log("daily started-->");
                module.exports.dailyDataUpdate(data, function (err) {
                    console.log("savedatInitiate");
                    // TODO: handle error
                    parser.resume();
                });
            }
            if (req.params.reportType == "Monthly") {

                module.exports.monthlyDataUpdate(data, function (err) {
                    console.log("savedatInitiate");
                    // TODO: handle error
                    console.log("unknownData: " + JSON.stringify(unknownData));
                    console.log("expectedMessage: " + expectedMessage);
                    if (expectedMessage) {
                        var responseData = {
                            status: false,
                            note: "upload not satisfied",
                            message: expectedMessage
                        };
                        res.status(400).send(responseData);
                    }
                    else {
                        parser.resume();
                    }

                });
            }


        })
            .on("end", function () {
                console.log("end marker: " + marker);
                if (marker == false) {
                    responseData = {
                        status: false,
                        message: message
                    };
                    res.status(400).send(responseData);
                }
                else if (marker == true) {
                    console.log("unknownData: " + JSON.stringify(unknownData));
                    var unknownStud = unknownData;
                    responseData = {
                        status: true,
                        message: "Successfull updated data",
                        data: unknownStud
                    };
                    unknownData = [];
                    res.status(200).send(responseData);
                }


            });
    }
    else {
        responseData = {
            status: false,
            message: "Upload File Content is Mismatched"
        };
    }
    console.log("<--attendanceUpdate");
}
/* ### Start update daily attendance status  ### */
module.exports.dailyDataUpdate = function (data, callback) {
    console.log('dailyDataUpdate: inside saving')
    var day;
    var attndnce;
    //var dateString = data.Date;

    var parts = month.split('-');
    console.log("parts: " + JSON.stringify(parts));

    day = parts[1];
    month = parts[0];
    attndnce = { 'date': Number(day), 'status': data.Status };

    console.log("attndnce: " + JSON.stringify(attndnce));

    var studIdForFindQry = {
        "schoolId": data.StudentID,
        "schoolName": schoolName,
        "attendance.month": month
    }
    console.log("studIdForFindQry: " + JSON.stringify(studIdForFindQry));
    var studIdForUpdateQry = {
        "schoolId": data.StudentID,
        "attendance.month": month,
        "schoolName": schoolName
        //"attendance.dateAttendance.date": day
    }
    console.log("studIdForUpdateQry: " + JSON.stringify(studIdForUpdateQry));
    stud.find({ "schoolName": schoolName, "schoolId": data.StudentID }).toArray(function (err, isThereData) {
        console.log("Basic query: " + JSON.stringify(isThereData));
        console.log("Basic query: " + isThereData.length);
        if (err) {
            console.log("error: " + err);
            message = err;
            marker = false;
            if (callback) callback();
        }
        else {
            if (isThereData.length > 0) {
                stud.find(studIdForFindQry).toArray(function (err, findData) {
                    console.log("1st query findData: " + JSON.stringify(findData));
                    console.log("1st query findData.length: " + findData.length);
                    if (err) {
                        marker = true;
                        if (callback) callback();
                    }
                    else {
                        var pulledQueryVal = {
                            "date": Number(day)
                        }
                        console.log("pulledQueryVal: " + JSON.stringify(pulledQueryVal));
                        stud.update(studIdForUpdateQry, { $pull: { "attendance.$.dateAttendance": pulledQueryVal } }, function (err, pulledData) {
                            //stud.find(studIdForUpdateQry, function (err, data) {
                            // stud.remove(studIdForUpdateQry, function (err, data) {
                            console.log("2nd query started: " + JSON.stringify(pulledData));
                            // console.log("2nd query data.length: " + data.length);
                            if (err) {
                                marker = true;
                                if (callback) callback();
                            }
                            else {
                                stud.update(studIdForUpdateQry, { $push: { "attendance.$.dateAttendance": attndnce } }, function (err, pushedData) {
                                    console.log("3nd query started: " + JSON.stringify(pushedData));
                                    if (err) {
                                        marker = false;
                                        if (callback) callback();
                                    }
                                    else {
                                        marker = true;
                                        if (callback) callback();
                                    }
                                })
                            }
                        })

                    }
                })
            }
            else {

            }
        }
    })
}
/* ### End update daily attendance status  ### */
/* ### Start update monthly attendance status  ### */
module.exports.monthlyDataUpdate = function (data, callback) {
    var arrayLength
    console.log("monthly DataUpdate started-->");
    console.log("req.params.month: " + month);
    // var marker;
    var studIdForFindQry = {
        "schoolId": data.StudentID,
        "attendance.month": month,
        "schoolName": schoolName
    }
    var columnLength = Object.keys(data).length; /* ##### Note: Number of column from uploaded files ##### */
    console.log("columnLength: " + columnLength);
    if (month == "Jan" || month == "Mar" || month == "May" || month == "Jul" || month == "Aug" || month == "Oct" || month == "Dec") {
        console.log("JAN");
        if (columnLength == 33) {

            if (month == "Jan") {
                attendanceIndex = 0;
            }
            else if (month == "Mar") {
                attendanceIndex = 2;
            }
            else if (month == "May") {
                attendanceIndex = 4;
            }
            else if (month == "Jul") {
                attendanceIndex = 6;
            }
            else if (month == "Aug") {
                attendanceIndex = 7;
            }
            else if (month == "Oct") {
                attendanceIndex = 9;
            }
            else if (month == "Dec") {
                attendanceIndex = 11;
            }
            for (var x = 1; x <= 31; x++) {
                console.log("x: " + x);
                monthAtt.push({ "date": x, "status": data[x] });
                if (x == 31) {
                    break;
                }
            }

        }
        else {

            expectedMessage = "Failled to upload! Expecting 31 days attendance status for " + month;
            if (callback) callback();
        }
    }
    else if (month == "Feb") {
        console.log("FEB");
        attendanceIndex = 1;
        if (columnLength == 30) {
            for (var x = 1; x <= 28; x++) {
                console.log("x: " + x);
                monthAtt.push({ "date": x, "status": data[x] });
                if (x == 28) {
                    break;
                }
            }
        }
        else {

            expectedMessage = "Failled to upload! Expecting 28 days attendance status for " + month;
            if (callback) callback();
        }
    }
    else if (month == "Apr" || month == "Jun" || month == "Sep" || month == "Nov") {
        if (columnLength == 30 + 2) {
            if (month == "Apr") {
                attendanceIndex = 3;
            }
            else if (month == "Jun") {
                attendanceIndex = 5;
            }
            else if (month == "Sep") {
                attendanceIndex = 8;
            }
            else if (month == "Nov") {
                attendanceIndex = 10;
            }
            for (var x = 1; x <= 30; x++) {
                console.log("x: " + x);
                monthAtt.push({ "date": x, "status": data[x] });
                if (x == 28) {
                    break;
                }
            }
        }
        else {

            expectedMessage = "Failled to upload! Expecting 30 days attendance status for " + month;
            if (callback) callback();
        }
    }

    console.log("*monthAtt: " + monthAtt.length);
    var idCheck = { "schoolName": schoolName, "schoolId": data.StudentID };
    console.log("idCheck: " + JSON.stringify(idCheck));
    stud.find(idCheck).toArray(function (err, isThereData) {
        console.log("Basic query: " + JSON.stringify(isThereData));
        console.log("Basic query: " + isThereData.length);
        if (err) {
            console.log("error: " + err);
            message = err;
            marker = false;
            if (callback) callback();
        }
        else {
            if (isThereData.length > 0) {
                console.log("month: " + month);
                stud.find({ "schoolName": schoolName, "schoolId": data.StudentID, "attendance.month": month }).toArray(function (err, findData) {
                    console.log("1st query findData: " + JSON.stringify(findData));
                    console.log("attendanceIndex: " + JSON.stringify(findData[0].attendance[attendanceIndex]));
                    console.log("dateAttendance: " + JSON.stringify(findData[0].attendance[attendanceIndex].dateAttendance));
                    arrayLength = findData[0].attendance[attendanceIndex].dateAttendance.length;
                    if (err) {
                        console.log("error: " + err);
                        message = err;
                        marker = false;
                        if (callback) callback();
                    }
                    else {
                        console.log("no error--");
                        console.log("studIdForFindQry: " + JSON.stringify(studIdForFindQry));
                        console.log("monthAtt: " + JSON.stringify(monthAtt));
                        console.log("arrayLength: " + arrayLength);
                        console.log("second query started");
                        stud.update(studIdForFindQry, { $set: { "attendance.$.dateAttendance": [] } }, function (err, findData) {
                            //stud.update(studIdForFindQry, { $push: { "attendance.$.dateAttendance": { $each: monthAtt } } }, function (err, findData) {
                            console.log("set findData: " + JSON.stringify(findData));

                            if (err) {
                                marker = false;
                                message = err;
                                if (callback) callback();
                            }
                            else {
                                stud.update(studIdForFindQry, { $push: { "attendance.$.dateAttendance": { $each: monthAtt } } }, function (err, findData) {
                                    console.log("set findData: " + JSON.stringify(findData));
                                    monthAtt = [];
                                    if (err) {
                                        marker = false;
                                        message = err;
                                        if (callback) callback();
                                    }
                                    else {
                                        marker = true;
                                        if (callback) callback();
                                    }
                                })
                            }
                        })


                    }
                })
            }
            else {
                console.log("unknown started");
                var obj = {
                    "StudentID": data.StudentID,
                    "StudentName": data.StudentName
                }
                unknownData.push(obj);
                if (callback) callback();
            }
        }
    })
}
/* ### End update monthly attendance status  ### */
module.exports.uploadStudentMaster = function (req, res) {
    console.log("uploadStudentMaster-->");
    var responseData;
    var marker;

    schoolName = req.params.schoolName;
    // var cs = [{"class":req.params.class,"section":req.params.section}];
    var fileName = req.files.img.name;
    var fileNameSeparate = fileName.split('_');

    if (fileNameSeparate[0] == 'Student') {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        var studentDataFile = req.files.img;
        console.log("studentDataFile: " + studentDataFile);
        var parser = csv.fromString(studentDataFile.data.toString(), {
            headers: true,
            ignoreEmpty: true
        }).on("data", function (data) {
            console.log("data: " + JSON.stringify(data));
            csData = [{ "class": req.params.clas, "section": req.params.section }];
            parser.pause();
            console.log("data.StudentID: " + data.StudentID);
            if (data.StudentID != '#end#') {
                if (studentFileValidationMessage == null) {
                    module.exports.studentMasterValidation(data, function (err) {
                        console.log("savedatInitiate");
                        // TODO: handle error
                        console.log("studentFileValidationFunction start-->: " + studentFileValidationMessage);
                        parser.resume();
                    });
                }
            }
            else {
                // parser.end();
                parser.resume();
            }
        })
            .on("end", function () {
                console.log("end marker: " + marker);
                console.log("objJson: " + JSON.stringify(objJson));
                console.log("studentFileValidationMessage: " + studentFileValidationMessage);
                if (studentFileValidationMessage != null) {
                    responseData = {
                        status: false,
                        message: studentFileValidationMessage
                    };
                    res.status(400).send(responseData);
                    console.log("responseData: " + JSON.stringify(responseData));
                    console.log("ids: " + ids + " studentFileValidationMessage: " + studentFileValidationMessage + " objJson: " + JSON.stringify(objJson));
                    ids = [];
                    studentFileValidationMessage = null;
                    objJson = [];
                    console.log("ids: " + ids + " studentFileValidationMessage: " + studentFileValidationMessage + " objJson: " + JSON.stringify(objJson));
                }
                else {
                    student.create(objJson, function (err, data) {
                        console.log("data: " + JSON.stringify(data));
                        // console.log("err: " + JSON.stringify(err));
                        if (err) {
                            console.log("err: " + JSON.stringify(err));
                            // console.log("err.code: " + err.code+" err.index: "+err.index+" err.errmsg: "+err.errmsg+" err.op: "+err.op);
                            console.log("err.op: " + JSON.stringify(err.op));
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
                                    var message;
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
                                    else if (err.errors.parentName) {
                                        responseData = {
                                            status: false,
                                            message: "parentName is required as a string"
                                        };
                                        res.status(400).send(responseData);
                                    }
                                    else if (err.errors.parentEmail) {
                                        responseData = {
                                            status: false,
                                            message: "parentEmail is required as a string"
                                        };
                                        res.status(400).send(responseData);
                                    }
                                    else if (err.errors.mobileNum) {
                                        responseData = {
                                            status: false,
                                            message: "Father mobile number is required"
                                        };
                                        res.status(400).send(responseData);
                                    }
                                    else if (err.errors.motherName) {
                                        responseData = {
                                            status: false,
                                            message: "motherName is required as a string"
                                        };
                                        res.status(400).send(responseData);
                                    }
                                    else if (err.errors.motherEmail) {
                                        responseData = {
                                            status: false,
                                            message: "MotherEmail is required"
                                        };
                                        res.status(400).send(responseData);
                                    }
                                    else if (err.errors.motherNum) {
                                        responseData = {
                                            status: false,
                                            message: "Mother mobile number is required"
                                        };
                                        res.status(400).send(responseData);
                                    }

                                    else if (err.errors.dob) {
                                        responseData = {
                                            status: false,
                                            message: "dob is required"
                                        };
                                        res.status(400).send(responseData);
                                    }
                                    else if (err.errors.doj) {
                                        responseData = {
                                            status: false,
                                            message: "doj is required"
                                        };
                                        res.status(400).send(responseData);
                                    }


                                }
                            }
                        } else {

                            allStudentEmailIds.forEach(function (to, i, array) {
                                console.log("i: " + i);
                                console.log("to: " + to);
                                console.log("array: " + JSON.stringify(array));
                                var mailOptions = {
                                    from: "info@vc4all.in",
                                    to: to.email,
                                    subject: "Regarding School Meeting",
                                    html: "<table style='border:10px solid gainsboro;'><thead style='background-image: linear-gradient(to bottom, #00BCD4 0%, #00bcd40f 100%);'><tr><th><h2>Greetings from VC4ALL</h2></th></tr></thead><tfoot style=background:#00bcd4;color:white;><tr><td style=padding:15px;><p><p>Regards</p><b>Careator Technologies Pvt. Ltd</b></p></td></tr></tfoot><tbody><tr><td><b>Dear Parents,</b></td></tr><tr><td><p>Please note, this is regarding credential email: <b>" + to.email + "password: " + to.pswd + " </b> </p><p style=background:gainsboro;></p></td></tr></tbody></table>"
                                    // html: "<html><head><p><b>Dear Parents, </b></p><p>Please note, you have to attend meeting regarding <b>" + req.body.reason + " </b>please open the below link at sharp " + req.body.startAt + " to " + req.body.endAt + "</p><p style=background:gainsboro;>Here your link and password for meeting <a href=" + req.body.url + ">" + req.body.url + "</a> and Password: " + password + "</p><p>Regards</p><p><b>Careator Technologies Pvt. Ltd</b></p></head><body></body></html>"
                                };
                                console.log("mailOptions: " + JSON.stringify(mailOptions));
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                        console.log("err");
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                        console.log("info");
                                    }

                                });
                            })
                            ids = [];
                            studentFileValidationMessage = null;
                            objJson = [];
                            responseData = {
                                status: true,
                                message: "Insert Successfull",
                                data: data
                            };
                            res.status(200).send(responseData);
                            console.log("responseData: " + JSON.stringify(responseData));
                            console.log("ids: " + ids + " studentFileValidationMessage: " + studentFileValidationMessage + " objJson: " + JSON.stringify(objJson));

                        }
                    });
                }

            });
    }
    else {
        responseData = {
            status: false,
            message: "Upload File Content is Mismatched"
        };
        res.status(400).send(responseData);
    }
    console.log("<--uploadStudentMaster");
}
module.exports.studentMasterValidation = function (data, callback) {
    console.log("studentMasterValidation-->");
    if (studentFileValidationMessage == null) {
        var findId = { "schoolName": schoolName, "schoolId": data.StudentID };
        console.log("findId: " + JSON.stringify(findId));
        stud.find(findId).toArray(function (err, idLength) {
            console.log("idLength.length: " + idLength.length);
            if (err) {
                responseData = {
                    status: false,
                    message: err
                };
                res.status(400).send(responseData);
                if (callback) callback();
            }
            else {
                if (idLength.length == 0) {
                    console.log("ids.indexOf(data.StudentID): " + ids.indexOf(data.StudentID));
                    if (ids.indexOf(data.StudentID) == -1) {
                        ids.push(data.StudentID);
                        var userData = {
                            schoolName: schoolName,
                            schoolId: data.StudentID,
                            firstName: data.FirstName,
                            lastName: data.LastName,
                            parentName: data.FatherName,
                            parentEmail: data.FatherEmailId,
                            mobileNum: data.FatherPhoneNumber,
                            motherName: data.MotherName,
                            motherEmail: data.MotherEmailid,
                            motherNum: data.MotherPhoneNumber,
                            cs: csData,
                            dob: data.DOB,
                            doj: data.DOJ,
                            pswd: "abc",
                            status: "active",
                            loginType: "studParent",
                            attendance: [
                                { "month": "Jan", "dateAttendance": [] },
                                { "month": "Feb", "dateAttendance": [] },
                                { "month": "Mar", "dateAttendance": [] },
                                { "month": "Apr", "dateAttendance": [] },
                                { "month": "May", "dateAttendance": [] },
                                { "month": "Jun", "dateAttendance": [] },
                                { "month": "Jul", "dateAttendance": [] },
                                { "month": "Aug", "dateAttendance": [] },
                                { "month": "Sep", "dateAttendance": [] },
                                { "month": "Oct", "dateAttendance": [] },
                                { "month": "Nov", "dateAttendance": [] },
                                { "month": "Dec", "dateAttendance": [] }
                            ],
                            mark: [
                                { "testType": "AT", "subjectWithMark": [] },
                                { "testType": "UT", "subjectWithMark": [] },
                                { "testType": "MT", "subjectWithMark": [] },
                                { "testType": "TT", "subjectWithMark": [] },
                                { "testType": "AT", "subjectWithMark": [] },
                            ],
                            fee: [
                                { "feeType": "AF", "details": [] },
                                { "feeType": "BF", "details": [] },
                                { "feeType": "MF", "details": [] },
                                { "feeType": "OF", "details": [] },
                                { "feeType": "Other", "details": [] }
                            ],
                            created_at: createdDate
                        };
                        allStudentEmailIds.push({ "email": data.FatherEmailId, "pswd": "abc" });
                        if (data.MotherEmailid) {
                            allStudentEmailIds.push({ "email": data.MotherEmailid, "pswd": "abc" });
                        }
                        objJson.push(userData);

                        console.log("userData: " + JSON.stringify(userData));
                        if (callback) callback();
                    }
                    else {
                        studentFileValidationMessage = data.StudentID + " You Used More Than One Time";
                        if (callback) callback();
                    }
                }
                else {
                    studentFileValidationMessage = "OOPS! " + "'" + data.StudentID + "'" + " already Exist Or Not a Appropriate Class or Section"
                    if (callback) callback();
                }
            }
        })
    }
    else {
        console.log("studentFileValidationMessage-->: " + studentFileValidationMessage);
        if (callback) callback();

    }
    console.log("<--studentMasterValidation");

}
module.exports.updateStudentMaster = function (req, res) {
    console.log("updateStudentMaster-->");

    var responseData;
    var marker;
    var objJson = [];
    // var cs = [{"class":req.params.class,"section":req.params.section}];
    var fileName = req.files.img.name;
    var fileNameSeparate = fileName.split('_');
    if (fileNameSeparate[0] == 'Student') {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        var studentDataFile = req.files.img;
        console.log("studentDataFile: " + studentDataFile);
        var parser = csv.fromString(studentDataFile.data.toString(), {
            headers: true,
            ignoreEmpty: true
        }).on("data", function (data) {
            console.log("data: " + JSON.stringify(data));
            //var csData = [{ "class": req.params.clas, "section": req.params.section }];

            objJson = {
                schoolName: req.params.schoolName,
                firstName: data.FirstName,
                lastName: data.LastName,
                parentName: data.FatherName,
                parentEmail: data.FatherEmailId,
                mobileNum: data.FatherPhoneNumber,
                motherName: data.MotherName,
                motherEmail: data.MotherEmailid,
                motherNum: data.MotherPhoneNumber,
                dob: data.DOB,
                doj: data.DOJ
            }
            console.log("objJson: " + JSON.stringify(objJson));


        })
            .on("end", function () {
                console.log("end marker: ");
                console.log("objJson: " + JSON.stringify(objJson));
                // var queryData = {
                //     "_id": ObjectId(req.params.id),
                //     "schoolName": req.params.schoolName,
                // }
                var id = { "_id": ObjectId(req.params.id) }
                console.log("id: " + JSON.stringify(id));
                // console.log("queryData: " + JSON.stringify(queryData));
                // stud.update(queryData, { $set: { $each: objJson } }, function (err, data) {
                student.update(id, { $set: objJson }, function (err, data) {
                    console.log("data: " + JSON.stringify(data));
                    if (err) {
                        responseData = {
                            status: false,
                            message: "Failed to Insert",
                            data: data
                        };
                        res.status(400).send(responseData);
                    } else {
                        responseData = {
                            status: true,
                            errorCode: 200,
                            message: "Updated Successfull",
                            data: data
                        };
                        res.status(200).send(responseData);
                    }
                });
            });
    }
    else {
        responseData = {
            status: false,
            message: "Upload File Content is Mismatched"
        };
        res.status(400).send(responseData);
    }
    console.log("<--updateStudentMaster");
}
module.exports.uploadTeacherMaster = function (req, res) {
    console.log("uploadTeacherMaster-->");
    var responseData;
    var marker;
    var css = [];

    schoolName = req.params.schoolName;
    // var cs = [{"class":req.params.class,"section":req.params.section}];
    var fileName = req.files.img.name;
    var fileNameSeparate = fileName.split('_');
    if (fileNameSeparate[0] == 'Teacher') {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        var studentDataFile = req.files.img;
        console.log("studentDataFile: " + studentDataFile);
        var parser = csv.fromString(studentDataFile.data.toString(), {
            headers: true,
            ignoreEmpty: true,
            trim: true
        }).on("data", function (data) {
            console.log("data: " + JSON.stringify(data));
            // var csData = [{ "class": req.params.class, "section": req.params.section }];
            parser.pause();
            console.log("data.TeacherID: "+data.TeacherID);
            if (data.TeacherID != '#end#') {
                if (teacherFileValidationMessage == null) {
                    module.exports.teacherMasterValidation(data, function (err) {
                        console.log("savedatInitiate");
                        // TODO: handle error
                        console.log("teacherFileValidation function start-->: " + teacherFileValidationMessage);
                        console.log("objJson: " + JSON.stringify(objJson));
                        parser.resume();
                    });
                }
            }

            else {
                // parser.end();
                parser.resume();
            }
        })
            .on("end", function () {
                console.log("end marker: " + marker);
                console.log("objJson: " + JSON.stringify(objJson));
                console.log("teacherFileValidationMessage: " + teacherFileValidationMessage);
                if (teacherFileValidationMessage != null) {
                    responseData = {
                        status: false,
                        message: teacherFileValidationMessage
                    };
                    res.status(400).send(responseData);
                    console.log("responseData: " + JSON.stringify(responseData));
                    console.log("ids: " + ids + " teacherFileValidationMessage: " + teacherFileValidationMessage + " objJson: " + JSON.stringify(objJson));
                    ids = [];
                    teacherFileValidationMessage = null;
                    objJson = [];
                    console.log("ids: " + ids + " teacherFileValidationMessage: " + teacherFileValidationMessage + " objJson: " + JSON.stringify(objJson));
                }
                else {
                    console.log("ready for insert");
                    teacher.create(objJson, function (err, data) {
                        console.log("data: " + JSON.stringify(data));
                        // console.log("err: " + JSON.stringify(err));
                        if (err) {
                            console.log("err: " + JSON.stringify(err));
                            // console.log("err.code: " + err.code+" err.index: "+err.index+" err.errmsg: "+err.errmsg+" err.op: "+err.op);
                            console.log("err.op: " + JSON.stringify(err.op));
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
                                    var message;
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
                                    else if (err.errors.parentName) {
                                        responseData = {
                                            status: false,
                                            message: "parentName is required as a string"
                                        };
                                        res.status(400).send(responseData);
                                    }
                                    else if (err.errors.parentEmail) {
                                        responseData = {
                                            status: false,
                                            message: "parentEmail is required as a string"
                                        };
                                        res.status(400).send(responseData);
                                    }
                                    else if (err.errors.mobileNum) {
                                        responseData = {
                                            status: false,
                                            message: "Father mobile number is required"
                                        };
                                        res.status(400).send(responseData);
                                    }
                                    else if (err.errors.motherName) {
                                        responseData = {
                                            status: false,
                                            message: "motherName is required as a string"
                                        };
                                        res.status(400).send(responseData);
                                    }
                                    else if (err.errors.motherEmail) {
                                        responseData = {
                                            status: false,
                                            message: "MotherEmail is required"
                                        };
                                        res.status(400).send(responseData);
                                    }
                                    else if (err.errors.motherNum) {
                                        responseData = {
                                            status: false,
                                            message: "Mother mobile number is required"
                                        };
                                        res.status(400).send(responseData);
                                    }

                                    else if (err.errors.dob) {
                                        responseData = {
                                            status: false,
                                            message: "dob is required"
                                        };
                                        res.status(400).send(responseData);
                                    }
                                    else if (err.errors.doj) {
                                        responseData = {
                                            status: false,
                                            message: "doj is required"
                                        };
                                        res.status(400).send(responseData);
                                    }
                                }
                            }
                        } else {
                            allTeacherEmailIds.forEach(function (to, i, array) {
                                console.log("i: " + i);
                                console.log("to: " + to);
                                console.log("array: " + JSON.stringify(array));
                                var mailOptions = {
                                    from: "info@vc4all.in",
                                    to: to.email,
                                    subject: "Regarding School Meeting",
                                    html: "<table style='border:10px solid gainsboro;'><thead style='background-image: linear-gradient(to bottom, #00BCD4 0%, #00bcd40f 100%);'><tr><th><h2>Greetings from VC4ALL</h2></th></tr></thead><tfoot style=background:#00bcd4;color:white;><tr><td style=padding:15px;><p><p>Regards</p><b>Careator Technologies Pvt. Ltd</b></p></td></tr></tfoot><tbody><tr><td><b>Dear Teachers,</b></td></tr><tr><td><p>Please note, this is regarding credential email: <b>" + to.email + "password: " + to.pswd + " </b> </p><p style=background:gainsboro;></p></td></tr></tbody></table>"
                                    // html: "<html><head><p><b>Dear Parents, </b></p><p>Please note, you have to attend meeting regarding <b>" + req.body.reason + " </b>please open the below link at sharp " + req.body.startAt + " to " + req.body.endAt + "</p><p style=background:gainsboro;>Here your link and password for meeting <a href=" + req.body.url + ">" + req.body.url + "</a> and Password: " + password + "</p><p>Regards</p><p><b>Careator Technologies Pvt. Ltd</b></p></head><body></body></html>"
                                };
                                console.log("mailOptions: " + JSON.stringify(mailOptions));
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                        console.log("err");
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                        console.log("info");
                                    }

                                });
                            })
                            ids = [];
                            teacherFileValidationMessage = null;
                            objJson = [];
                            responseData = {
                                status: true,
                                message: "Insert Successfull",
                                data: data
                            };
                            res.status(200).send(responseData);
                            console.log("responseData: " + JSON.stringify(responseData));
                            console.log("ids: " + ids + " teacherFileValidationMessage: " + teacherFileValidationMessage + " objJson: " + JSON.stringify(objJson));

                        }
                    });
                }
            });
    }
    else {
        responseData = {
            status: false,
            message: "Upload File Content is Mismatched"
        };
        res.status(400).send(responseData);
    }

    console.log("<--uploadteacherMaster");
};
module.exports.teacherMasterValidation = function (data, callback) {
    console.log("teacherFileValidation-->");
    if (teacherFileValidationMessage == null) {
        // var findId = { "_id": ObjectId("5b0272d74a46530e1493371a") };
        var findId = { "schoolName": schoolName, "schoolId": data.TeacherID };
        console.log("findId: " + JSON.stringify(findId));
        user.find(findId).toArray(function (err, idLength) {
            console.log("idLength.length: " + idLength.length);
            if (err) {
                console.log("err: " + JSON.stringify(err));
                responseData = {
                    status: false,
                    message: err
                };
                res.status(400).send(responseData);
                if (callback) callback();
            }
            else {
                if (idLength.length == 0) {
                    console.log("ids.indexOf(data.TeacherID): " + ids.indexOf(data.TeacherID));
                    if (ids.indexOf(data.TeacherID) == -1) {
                        ids.push(data.TeacherID);
                        var userData =
                            {
                                schoolName: schoolName,
                                schoolId: data.TeacherID,
                                firstName: data.FirstName,
                                lastName: data.LastName,
                                email: data.Email,
                                mobNumber: data.PhoneNumber,
                                dob: data.DOB,
                                doj: data.DOJ,
                                pswd: "abc",
                                css: [],
                                timeTable: [],
                                status: "active",
                                loginType: "teacher",
                                created_at: createdDate
                            }
                        var cssParts = data.ClassSectionSubject.split(',');
                        console.log("cssParts: " + JSON.stringify(cssParts));
                        for (var x = 0; x < cssParts.length; x++) {
                            if (cssParts[x] != "") {
                                console.log("cssParts[x]: " + cssParts[x]);
                                var trimed = cssParts[x].trim();
                                console.log("cssSeparate: " + trimed);
                                var cssSeparate = trimed.split('-');
                                console.log("cssSeparate: " + JSON.stringify(cssSeparate));
                                userData.css.push({ "class": cssSeparate[0], "section": cssSeparate[1], "subject": cssSeparate[2] });
                            }
                        }
                        console.log("userData: " + JSON.stringify(userData));
                        allTeacherEmailIds.push({ "email": data.Email, "pswd": "abc" });
                        objJson.push(userData);

                        console.log("objJson: " + objJson.length);
                        if (callback) callback();
                    }
                    else {
                        teacherFileValidationMessage = data.TeacherID + " You Used More Than One Time";
                        if (callback) callback();
                    }
                }
                else {
                    teacherFileValidationMessage = "Sorry! " + data.TeacherID + " Already exist kindly check and update your csv file"
                    if (callback) callback();
                }
            }
        })
    }
    else {
        console.log("teacherFileValidationMessage-->: " + teacherFileValidationMessage);
        if (callback) callback();

    }
    console.log("<--teacherFileValidation");

}
module.exports.updateTeacherMaster = function (req, res) {
    console.log("updateTeacherMaster-->");
    var responseData;
    var marker;
    var css = [];
    var objJson = [];
    // var cs = [{"class":req.params.class,"section":req.params.section}];
    var fileName = req.files.img.name;
    var fileNameSeparate = fileName.split('_');
    if (fileNameSeparate[0] == 'Teacher') {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        var teacherDataFile = req.files.img;
        console.log("teacherDataFile: " + teacherDataFile);
        var parser = csv.fromString(teacherDataFile.data.toString(), {
            headers: true,
            ignoreEmpty: true
        }).on("data", function (data) {
            console.log("data: " + JSON.stringify(data));
            // var csData = [{ "class": req.params.class, "section": req.params.section }];
            objJson = {
                firstName: data.FirstName,
                lastName: data.LastName,
                email: data.Email,
                mobileNum: data.PhoneNumber,
                dob: data.DOB,
                doj: data.DOJ,
                pswd: "abc",
                css: [],
                timeTable: []
            }
            var cssParts = data.ClassSectionSubject.split(',');
            console.log("cssParts: " + JSON.stringify(cssParts));
            for (var x = 0; x < cssParts.length; x++) {
                if (cssParts[x] != "") {
                    console.log("cssParts[x]: " + cssParts[x]);
                    var trimed = cssParts[x].trim();
                    console.log("cssSeparate: " + trimed);
                    var cssSeparate = trimed.split('-');
                    console.log("cssSeparate: " + JSON.stringify(cssSeparate));
                    objJson.css.push({ "class": cssSeparate[0], "section": cssSeparate[1], "subject": cssSeparate[2] });
                }
            }
            console.log("objJson: " + JSON.stringify(objJson));
            //objJson.push(userData);
        })
            .on("end", function () {
                console.log("end marker ");
                console.log("objJson: " + JSON.stringify(objJson));
                // var queryData = {
                //     "_id": req.params.id
                //     // "schoolName": req.params.schoolName,
                // }
                var id = { "_id": ObjectId(req.params.id) }
                //console.log("queryData: " + JSON.stringify(queryData));
                teacher.update(id, { $set: objJson }, function (err, data) {
                    console.log("data: " + JSON.stringify(data));
                    if (err) {
                        responseData = {
                            status: false,
                            message: "Failed to Update"
                        };
                        res.status(400).send(responseData);
                    } else {
                        responseData = {
                            status: true,
                            errorCode: 200,
                            message: "Updated Successfull"
                        };
                        res.status(200).send(responseData);
                    }
                });
            });
    }
    else {
        responseData = {
            status: false,
            message: "Upload File Content is Mismatched"
        };
        res.status(400).send(responseData);
    }

    console.log("<--updateTeacherMaster");
}

