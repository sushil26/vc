
var db = require("../dbConfig.js").getDb();
var user = db.collection("user"); /* ### Teacher collection  ### */
var stud = db.collection("student"); /* ### student collection  ### */
var school = db.collection("school"); /* ### school collection  ### */


var general = require("../general.js");
var ObjectId = require("mongodb").ObjectID;
var bodyParser = require('body-parser');

var csv = require('fast-csv');
var d = new Date();
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

module.exports.markUpdate = function (req, res) {
    console.log("markUpdate-->");
    schoolName = req.params.schoolName;
    testType = req.params.testType;
    testStartDate = req.params.date;
    clas = req.params.clas;
    section = req.params.section;
    console.log("schoolName: " + schoolName + " testType: " + testType + " testStartDate: " + testStartDate + " clas: " + clas + " section: " + section);
    console.log("req.body.files: " + req.files.img);
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

    console.log("<--markUpdate");
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
                                marker = fasle;
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
                stud.find(studIdForFindQry,{"attendance.dateAttendance.date": attndnce.date}).toArray(function (err, findData) {
                    console.log("*1st query findData: " + JSON.stringify(findData));
                    // console.log("1st query findData.length: " + findData.attendance);
                    if (err) {
                        marker = true;
                        if (callback) callback();
                    }
                    else {
                       
                        if (findData.length == 0) {
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
    console.log('inside saving')
    var arrayLength
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
    var objJson = [];
    // var cs = [{"class":req.params.class,"section":req.params.section}];
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    var studentDataFile = req.files.img;
    console.log("studentDataFile: " + studentDataFile);
    var parser = csv.fromString(studentDataFile.data.toString(), {
        headers: true,
        ignoreEmpty: true
    }).on("data", function (data) {
        console.log("data: " + JSON.stringify(data));
        var csData = [{ "class": req.params.clas, "section": req.params.section }];
        var userData = {
            schoolName: req.params.schoolName,
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
            ]
        };

        objJson.push(userData);
        console.log("userData: " + JSON.stringify(userData));
    })
        .on("end", function () {
            console.log("end marker: " + marker);
            console.log("objJson: " + JSON.stringify(objJson));
            stud.find({ "cs": { "class": req.params.clas, "section": req.params.section } }).toArray(function (err, studentClassList) {
                console.log("studentClassList.length: " + studentClassList.length);
                if (err) {
                    responseData = {
                        status: false,
                        message: "Failed to get Data",

                    };
                    res.status(400).send(responseData);
                } else {
                    if (studentClassList.length == 0) {
                        stud.insert(objJson, function (err, data) {
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
                                    message: "Insert Successfull",
                                    data: data
                                };
                                res.status(200).send(responseData);
                            }
                        });
                    }
                    else {
                        responseData = {
                            status: false,
                            message: "Sorry! you already inserted data for this class, further insertion you have to use reports update option",

                        };
                        res.status(400).send(responseData);
                    }
                }
            });
        });
    console.log("<--uploadStudentMaster");
}
module.exports.updateStudentMaster = function (req, res) {
    console.log("updateStudentMaster-->");

    var responseData;
    var marker;
    var objJson = [];
    // var cs = [{"class":req.params.class,"section":req.params.section}];
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
            stud.update(id, { $set: objJson }, function (err, data) {
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
    console.log("<--updateStudentMaster");
}
module.exports.uploadTeacherMaster = function (req, res) {
    console.log("uploadStudentMaster-->");
    var responseData;
    var marker;
    var css = [];
    var objJson = [];
    // var cs = [{"class":req.params.class,"section":req.params.section}];
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    var studentDataFile = req.files.img;
    console.log("studentDataFile: " + studentDataFile);
    var parser = csv.fromString(studentDataFile.data.toString(), {
        headers: true,
        ignoreEmpty: true
    }).on("data", function (data) {
        console.log("data: " + JSON.stringify(data));
        // var csData = [{ "class": req.params.class, "section": req.params.section }];
        var userData = {
            schoolName: req.params.schoolName,
            schoolId: data.TeacherID,
            firstName: data.FirstName,
            lastName: data.LastName,
            email: data.Email,
            mobileNum: data.PhoneNumber,
            dob: data.DOB,
            doj: data.DOJ,
            pswd: "abc",
            css: [],
            timeTable: [],
            status: "active",
            loginType: "teacher"
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
        objJson.push(userData);
    })
        .on("end", function () {
            console.log("end marker: " + marker);
            console.log("objJson: " + JSON.stringify(objJson));
            user.insert(objJson, function (err, data) {
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
                        message: "Insert Successfull",
                        data: data
                    };
                    res.status(200).send(responseData);
                }
            });
        });

    console.log("<--uploadStudentMaster");
};
module.exports.updateTeacherMaster = function (req, res) {
    console.log("updateTeacherMaster-->");
    var responseData;
    var marker;
    var css = [];
    var objJson = [];
    // var cs = [{"class":req.params.class,"section":req.params.section}];
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
            user.update(id, { $set: objJson }, function (err, data) {
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

    console.log("<--updateTeacherMaster");
}

