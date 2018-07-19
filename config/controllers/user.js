var db = require("../dbConfig.js").getDb();
var teacher = require("./schemas/teacher.js");
var schoolModel = require("./schemas/school.js");
var user = db.collection("user"); /* ### Teacher collection  ### */
var stud = db.collection("students"); /* ### student collection  ### */
var school = db.collection("school"); /* ### school collection  ### */

// var logger = require('../log.js');
// var log = logger.LOG;

var general = require("../general.js");
var util = require("util");
var bodyParser = require("body-parser");
var ObjectId = require("mongodb").ObjectID;
var nodemailer = require("nodemailer");
var createdDate = new Date();
// var randomstring = require("randomstring");

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
module.exports.register4VC = function (req, res) {
  console.log("Regisyer==>");
  console.log("dB: " + db);
  var responseData;
  // var password = randomstring.generate(5);
  // console.log("general.encrypt(password): " + general.encrypt(password));
  if (
    general.emptyCheck(req.body.userName) &&
    general.emptyCheck(req.body.email) &&
    general.emptyCheck(req.body.password)
  ) {
    var userData = {
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      status: "inactive"
    };
    console.log("userData: " + JSON.stringify(userData));
    user.insertOne(userData, function (err, data) {
      console.log("data: " + JSON.stringify(data));
      if (err) {
        responseData = {
          status: false,
          message: "Failed to Register",
          data: data
        };
        res.status(400).send(responseData);
      } else {
        responseData = {
          status: true,
          message: "Registeration Successfull",
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
  console.log("<<==Register");
};
module.exports.login4VC = function (req, res) {
  console.log("login==*>");
  var responseData;

  if (general.emptyCheck(req.body.email) && general.emptyCheck(req.body.password)) {
    if (req.body.loginType == "teacher") {
      console.log("logintype: " + req.body.loginType);
      user.find({ email: req.body.email }).toArray(function (err, data) {
        console.log("data: " + JSON.stringify(data));
        if (err) {
          responseData = {
            status: false,
            message: "Failed to get Data",
            data: schoolStatus
          };
        }
        else {
          console.log("data.length: " + data.length);
          if (data.length > 0) {
            if (data[0].loginType == 'vc4allAdmin') {
              console.log("login-->:vc4allAdmin");
              if (data[0].pswd == req.body.password) {

                responseData = {
                  status: true,
                  message: "Login Successfully",
                  sessionData: "79ea520a-3e67-11e8-9679-97fa7aeb8e97",
                  data: data[0]
                };
                res.status(200).send(responseData);
              }
              else {
                responseData = {
                  status: false,
                  errorCode: "E005",
                  message: "Password is wrong"
                };
                res.status(200).send(responseData);
              }
            }
            else if (data[0].loginType == 'teacher') {
              console.log("login-->: teacher: " + data[0].pswd + "req.body.password: " + req.body.password);
              if (data[0].pswd == req.body.password) {
                console.log("log started--->");
                responseData = {
                  status: true,
                  message: "Login Successfully",
                  sessionData: "79ea520a-3e67-11e8-9679-97fa7aeb8e97",
                  data: data[0]
                };
                res.status(200).send(responseData);
              }
              else {
                responseData = {
                  status: false,
                  errorCode: "E005",
                  message: "Password is wrong"
                };
                res.status(200).send(responseData);
              }
            }
            else {
              console.log("data[0].schoolName: " + data[0].schoolName);
              var sn = {
                "schoolName": data[0].schoolName
              }
              school.find(sn).toArray(function (err, schoolStatus) {
                console.log("second query status: " + schoolStatus[0].status);

                if (err) {
                  responseData = {
                    status: false,
                    message: "Failed to get Data",
                    data: schoolStatus
                  };
                  res.status(400).send(responseData);
                } else {
                  if (schoolStatus[0].status == "active") {
                    if (data[0].pswd == req.body.password) {
                      if (data[0].status == "active") {
                        console.log("Successfully Logged in as " + (data[0].loginType));

                        responseData = {
                          status: true,
                          message: "Login Successfully",
                          sessionData: "79ea520a-3e67-11e8-9679-97fa7aeb8e97",
                          data: data[0]
                        };
                        res.status(200).send(responseData);
                      } else {
                        console.log("Profile Inactive");
                        responseData = {
                          status: false,
                          message: "Profile Inactive",
                          data: data[0]
                        };
                        res.status(200).send(responseData);
                      }
                    } else {
                      responseData = {
                        status: false,
                        errorCode: "E005",
                        message: "Password is wrong"
                      };
                      res.status(200).send(responseData);
                    }
                  }
                  else {
                    responseData = {
                      status: false,
                      message: "Your not allow to login",
                      data: data[0]
                    };
                    res.status(200).send(responseData);
                  }

                }
              })
            }

          }
          else {
            console.log("There is no match for this EMail id from Teacher database");
            responseData = {
              status: false,
              errorCode: "No Match",
              message:
                "There is no match for this EMail id from Teacher database"
            };
            res.status(200).send(responseData);
          }
        }

      });

    }
    else {
      stud.find({ $or: [{ parentEmail: req.body.email }, { motherEmail: req.body.email }] }).toArray(function (err, data) {
        if (data.length > 0) {
          if (data[0].pswd == req.body.password) {
            if (data[0].status == "active") {
              console.log("Successfully Logged in");
              responseData = {
                status: true,
                message: "Login Successfully",
                loginType: "studParent",
                data: data[0]
              };
              res.status(200).send(responseData);
            } else {
              console.log("Profile Inactive");
              responseData = {
                status: false,
                message: "Profile Inactive",
                data: data[0]
              };
              res.status(200).send(responseData);
            }
          } else {
            responseData = {
              status: false,
              errorCode: "E005",
              message: "Password is wrong"
            };
            res.status(200).send(responseData);
          }
        } else {
          responseData = {
            status: false,
            errorCode: "No Match",
            message:
              "There is no match for this EMail id from student database"
          };
          res.status(200).send(responseData);
        }
      });
    }

  } else {
    console.log("Epty value found");
    responseData = {
      status: false,
      message: "empty value found",
      data: userData
    };
    res.status(400).send(responseData);
  }

  console.log("<==login");
};

module.exports.checkPassword = function (req, res) {
  console.log("checkPassword-->");
  var responseData;
  var loginType = req.params.loginType;
  var id = req.params.id;
  console.log("loginType: " + loginType + " id" + id);
  if (general.emptyCheck(id) && general.emptyCheck(loginType)) {

    if (general.emptyCheck(req.body.pswd)) {
      if (loginType == 'admin' || loginType == 'teacher' || loginType == 'vc4allAdmin') {
        var findQuery = {
          "_id": ObjectId(id)
        }
        user.find(findQuery).toArray(function (err, userData) {
          console.log("find query status: " + JSON.stringify(userData));
          console.log("find query status length: " + userData.length);

          if (err) {
            responseData = {
              status: false,
              message: "Failed to get Data"
            };
            res.status(400).send(responseData);
          } else {
            if (userData.length > 0) {
              if (userData[0].pswd == req.body.pswd) {
                responseData = {
                  status: true,
                  message: "Password Matched"
                };
                res.status(200).send(responseData);
              }
              else {
                responseData = {
                  status: false,
                  message: "Password Not Matched"
                };
                res.status(400).send(responseData);
              }
            }
            else {
              responseData = {
                status: false,
                message: "There is no data for this Id"
              };
              res.status(400).send(responseData);
            }
          }
        })
      }
      else if (loginType == 'studParent') {
        var findQuery = {
          "_id": ObjectId(id)
        }
        stud.find(findQuery).toArray(function (err, userData) {
          console.log("find query status: " + JSON.stringify(userData));
          console.log("find query status length: " + userData.length);
          if (err) {
            responseData = {
              status: false,
              message: "Failed to get Data"
            };
            res.status(400).send(responseData);
          } else {
            if (userData.length > 0) {
              if (userData[0].pswd == req.body.pswd) {
                responseData = {
                  status: true,
                  message: "Password Matched"
                };
                res.status(200).send(responseData);
              }
              else {
                responseData = {
                  status: false,
                  message: "Password Not Matched"
                };
                res.status(400).send(responseData);
              }
            }
            else {
              responseData = {
                status: false,
                message: "There is no data for this Id"
              };
              res.status(400).send(responseData);
            }
          }
        })
      }
    }
    else {
      responseData = {
        status: false,
        message: "There is no password to check"
      };
      res.status(400).send(responseData);
    }

  }
  else {
    responseData = {
      status: false,
      message: "There is no Id and LoginType to check"
    };
    res.status(400).send(responseData);
  }
  console.log("<--checkPassword");
}
module.exports.passwordUpdate = function (req, res) {
  console.log("passwordUpdate-->");
  var responseData;
  var loginType = req.params.loginType;
  var id = req.params.id;
  console.log("loginType: " + loginType + " id" + id);
  if (general.emptyCheck(id) && general.emptyCheck(loginType)) {

    if (general.emptyCheck(req.body.currentPswd) && general.emptyCheck(req.body.newPswd)) {
      if (loginType == 'admin' || loginType == 'teacher' || loginType == 'vc4allAdmin') {
        var findQuery = {
          "_id": ObjectId(id),
          "pswd": req.body.currentPswd
        }
        user.find(findQuery).toArray(function (err, userData) {
          console.log("find query status: " + JSON.stringify(userData));
          console.log("find query status length: " + userData.length);

          if (err) {
            responseData = {
              status: false,
              message: "Failed to get Data"
            };
            res.status(400).send(responseData);
          } else {
            if (userData.length > 0) {

              user.update(findQuery, { $set: { "pswd": req.body.newPswd } }, function (err, userData) {
                console.log("find query status: " + JSON.stringify(userData));
                // console.log("find query status length: " + userData.length);

                if (err) {
                  responseData = {
                    status: false,
                    message: "Failed to get Data"
                  };
                  res.status(400).send(responseData);
                } else {

                  responseData = {
                    status: true,
                    message: "Password Updated"
                  };
                  res.status(200).send(responseData);
                }
              })

            }
            else {
              responseData = {
                status: false,
                message: "Password Not Matched"
              };
              res.status(400).send(responseData);
            }


          }
        })
      }
      else if (loginType == 'studParent') {
        var findQuery = {
          "_id": ObjectId(id),
          "pswd": req.body.currentPswd
        }
        user.find(findQuery).toArray(function (err, userData) {
          console.log("find query status: " + JSON.stringify(userData));
          console.log("find query status length: " + userData.length);

          if (err) {
            responseData = {
              status: false,
              message: "Failed to get Data"
            };
            res.status(400).send(responseData);
          } else {
            if (userData.length > 0) {

              stud.update(findQuery, { $set: { "pswd": req.body.newPswd } }, function (err, userData) {
                console.log("find query status: " + JSON.stringify(userData));
                //console.log("find query status length: " + userData.length);

                if (err) {
                  responseData = {
                    status: false,
                    message: "Failed to get Data"
                  };
                  res.status(400).send(responseData);
                } else {

                  responseData = {
                    status: true,
                    message: "Password Updated"
                  };
                  res.status(200).send(responseData);
                }
              })
            }

            else {
              responseData = {
                status: false,
                message: "Password Not Matched"
              };
              res.status(400).send(responseData);
            }


          }
        })
      }
    }
    else {
      responseData = {
        status: false,
        message: "There is no password to check"
      };
      res.status(400).send(responseData);
    }

  }
  else {
    responseData = {
      status: false,
      message: "There is no Id and LoginType to check"
    };
    res.status(400).send(responseData);
  }
  console.log("<--passwordUpdate");
}
module.exports.profilePicUpdate = function (req, res) {
  console.log("profilePicUpdate-->");
  var id = req.params.id;
  if (general.emptyCheck(req.params.id)) {
    var loginType = req.body.loginType;
    if (loginType == 'user') {
      var profilePic_path = req.body.profilePic_path;
      user.update({ "_id": ObjectId(id) }, { $set: { "profilePic_path": profilePic_path } }, function (err, data) {
        if (err) {
          responseData = {
            status: false,
            message: "Failed to update"
          };
          res.status(400).send(responseData);
        }
        else {
          responseData = {
            status: false,
            message: "update successful"
          };
          res.status(200).send(responseData);
        }
      })
    }
    else {
      var updateJson;
      console.log("req.body.profilePic_path: " + req.body.profilePic_path);
      console.log("req.body.father_profilePic_path: " + req.body.father_profilePic_path);
      console.log("req.body.mother_profilePic_path: " + req.body.mother_profilePic_path);
      if (req.body.profilePic_path) {
        console.log("req.body.profilePic_path: " + req.body.profilePic_path);
        updateJson = {
          "profilePic_path": req.body.profilePic_path
        }
      }
      else if (req.body.father_profilePic_path) {
        console.log("req.body.father_profilePic_path: " + req.body.father_profilePic_path);
        updateJson = {
          "father_profilePic_path": req.body.father_profilePic_path
        }
      }
      else if (req.body.mother_profilePic_path) {
        console.log("req.body.mother_profilePic_path: " + req.body.mother_profilePic_path);
        updateJson = {
          "mother_profilePic_path": req.body.mother_profilePic_path
        }
      }
      console.log("updateJson: " + JSON.stringify(updateJson));
      stud.update({ "_id": ObjectId(id) }, { $set: updateJson }, function (err, data) {
        if (err) {
          responseData = {
            status: false,
            message: "Failed to update"
          };
          res.status(400).send(responseData);
        }
        else {
          responseData = {
            status: false,
            message: "update successful"
          };
          res.status(200).send(responseData);
        }
      })
    }
  }
  else {
    console.log("Empty value find");
    responseData = {
      status: false,
      message: "empty id find"
    };
    res.status(400).send(responseData);
  }

  console.log("<--profilePicUpdate");
}
module.exports.getUserData = function (req, res) {
  console.log("getUserData-->");
  var responseData;
  user.find().toArray(function (err, listOfUser) {
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
        message: "Successfull retrived data",
        data: listOfUser
      };

      res.status(200).send(responseData);
    }
  });

  console.log("<--getUserData");
};
module.exports.getStudData = function (req, res) {
  console.log("getUserData-->");
  var responseData;
  stud.find().toArray(function (err, listOfUser) {
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
        message: "Successfull retrived data",
        data: listOfUser
      };

      res.status(200).send(responseData);
    }
  });

  console.log("<--getUserData");
};
module.exports.updateUserStatus = function (req, res) {
  console.log("updateUserStatus-->");
  var responseData;
  if (general.emptyCheck(req.body.id)) {
    var obj = {
      _id: ObjectId(req.body.id)
    };
    var updatedJson = {
      status: req.body.status
    };
    user.update(obj, { $set: updatedJson }, { multi: true }, function (
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

  console.log("<--updateUserStatus");
};
module.exports.updateStudStatus = function (req, res) {
  console.log("updateStudStatus-->");
  var responseData;
  if (general.emptyCheck(req.body.id)) {
    var obj = {
      _id: ObjectId(req.body.id)
    };
    var updatedJson = {
      status: req.body.status
    };
    stud.update(obj, { $set: updatedJson }, { multi: true }, function (
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

  console.log("<--updateStudStatus");
};
module.exports.deleteUser = function (req, res) {
  console.log("deleteUser-->");
  var responseData;
  if (general.emptyCheck(req.body.id)) {
    var id = {
      _id: ObjectId(req.body.id)
    };
    user.remove(id, function (err, data) {
      if (err) {
        console.log("Failed to delete  data");
        responseData = {
          status: false,
          message: "Failed to delete",
          data: data
        };
        res.status(400).send(responseData);
      } else {
        responseData = {
          status: true,
          message: "Deleted Sucessfully",
          data: data
        };
        res.status(200).send(responseData);
      }
    });
  } else {
    console.log("Epty value found");
    responseData = {
      status: false,
      message: "empty value found"
    };
    res.status(400).send(responseData);
  }
  console.log("<--deleteUser");
};
module.exports.deleteStud = function (req, res) {
  console.log("deleteUser-->");
  var responseData;
  if (general.emptyCheck(req.body.id)) {
    var id = {
      _id: ObjectId(req.body.id)
    };
    stud.remove(id, function (err, data) {
      if (err) {
        console.log("Failed to delete  data");
        responseData = {
          status: false,
          message: "Failed to delete",
          data: data
        };
        res.status(400).send(responseData);
      } else {
        responseData = {
          status: true,
          message: "Deleted Sucessfully",
          data: data
        };
        res.status(200).send(responseData);
      }
    });
  } else {
    console.log("Epty value found");
    responseData = {
      status: false,
      message: "empty value found"
    };
    res.status(400).send(responseData);
  }
  console.log("<--deleteUser");
};
module.exports.emailInvite = function (req, res) {
  console.log("emailInvite-->");
  var mailOptions = {
    from: "info@vc4all.in",
    to: req.body.email,
    subject: "Regarding School Instance Meeting",
    html:
      "<html><head><p><b>Dear Parents, </b></p><p>Please note, you have to attend meeting right now, please open the below link.<p>Here your link <a href=" + req.body.url + ">" + req.body.url + "</a> and password: abc</p><p>Regards</p><p><b>Careator Technologies Pvt. Ltd</b></p></head><body></body></html>"
  };
  console.log("mailOptions: " + JSON.stringify(mailOptions));

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      responseData = {
        status: true,
        errorCode: 200,
        message: "Registeration Successfull and Failed to send mail",
        data: data
      };
      res.status(200).send(responseData);
    } else {
      console.log("Email sent: " + info.response);
      responseData = {
        status: true,
        errorCode: 200,
        message: "Registeration Successfull and sent mail",

        data: data
      };
      res.status(200).send(responseData);
    }
  });
  console.log("<--emailInvite");
};
module.exports.sessionCreate = function (req, res) {
  console.log("sessionCreate-->");
  var responseData;
  console.log("req.body.url: " + req.body.url);
  if (general.emptyCheck(req.body.url)) {
    var data = {
      url: req.body.url
    };
    responseData = {
      status: true,
      message: "get url sucessfully",
      data: data
    };
    res.status(200).send(responseData);
  } else {
    responseData = {
      status: false,
      message: "empty value found"
    };
    res.status(400).send(responseData);
  }
  console.log("<--sessionCreate");
};
module.exports.teacherInsert = function (req, res) {
  console.log("teacherInsert-->");
  var responseData;
  var userData = {
    schoolName: req.body.schoolName,
    teacherId: req.body.teacherId,
    teacherName: req.body.teacherName,
    teacherEmail: req.body.teacherEmail,
    mobileNum: req.body.mobileNum,
    css: req.body.css,
    pswd: req.body.pswd,
    timeTable: req.body.timetabletech,
    status: "inactive",
    loginType: "teacher"
  };

  console.log("userData: " + JSON.stringify(userData));
  user.insertOne(userData, function (err, data) {
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
        data: userData
      };
      res.status(200).send(responseData);
    }
  });

  console.log("<--teacherInsert");
};

module.exports.studentInsert = function (req, res) {
  console.log("studentInsert-->");
  var responseData;
  var userData = {
    schoolName: req.body.schoolName,
    studId: req.body.studId,
    studName: req.body.studName,
    parentName: req.body.parentName,
    parentEmail: req.body.parentEmail,
    mobileNum: req.body.mobileNum,
    MotherName: req.body.motherName,
    MotherEmail: req.body.motherEmail,
    MotherNum: req.body.motherNum,
    cs: req.body.cs,
    pswd: req.body.pswd,
    status: "inactive",
    loginType: "studParent"
  };

  console.log("userData: " + JSON.stringify(userData));
  stud.insertOne(userData, function (err, data) {
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
        data: userData
      };
      res.status(200).send(responseData);
    }
  });

  console.log("<--studentInsert");
};

module.exports.teacherDetail = function (req, res) {
  console.log("teacherdetail-->");
  if (general.emptyCheck(req.params.id)) {
    var id = {
      _id: ObjectId(req.params.id)
    };
    user.find(id).toArray(function (err, data) {
      //console.log("data: " + JSON.stringify(data));
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
          message: "get data successfully",
          data: data
        };

        res.status(200).send(responseData);
      }
    });
  } else {
    console.log("Epty value found");
    responseData = {
      status: false,
      message: "there is no userId to find"
    };
    res.status(400).send(responseData);
  }
  console.log("<--teacherdetail");
};

module.exports.studentDetail = function (req, res) {
  console.log("teacherdetail-->");
  if (general.emptyCheck(req.params.id)) {
    var id = {
      _id: ObjectId(req.params.id)
    };
    stud.find(id).toArray(function (err, data) {
      //console.log("data: " + JSON.stringify(data));
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
          message: "get data successfully",
          data: data
        };

        res.status(200).send(responseData);
      }
    });
  } else {
    console.log("Epty value found");
    responseData = {
      status: false,
      message: "there is no userId to find"
    };
    res.status(400).send(responseData);
  }
  console.log("<--teacherdetail");
};

module.exports.teacherPersonalData = function (req, res) {
  console.log("teacherPersonalData-->");
  console.log("req.params.id: " + req.params.id);
  if (general.emptyCheck(req.params.id)) {
    var id = {
      _id: ObjectId(req.params.id)
    };
    user.find(id).toArray(function (err, data) {
      // console.log("data: " + JSON.stringify(data));
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
          message: "get data successfully",
          data: data
        };

        res.status(200).send(responseData);
      }
    });
  } else {
    console.log("Epty value found");
    responseData = {
      status: false,
      message: "there is no userId to find"
    };
    res.status(400).send(responseData);
  }
  console.log("<--teacherPersonalData");
};

module.exports.studentPersonalData = function (req, res) {
  console.log("studentPersonalData-->");
  console.log("req.params.id: " + req.params.id);
  if (general.emptyCheck(req.params.id)) {
    var id = {
      _id: ObjectId(req.params.id)
    };
    stud.find(id).toArray(function (err, data) {
      // console.log("data: " + JSON.stringify(data));
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
          message: "get data successfully",
          data: data
        };

        res.status(200).send(responseData);
      }
    });
  } else {
    console.log("Epty value found");
    responseData = {
      status: false,
      message: "there is no userId to find"
    };
    res.status(400).send(responseData);
  }
  console.log("<--studentPersonalData");
};

module.exports.getLoginData = function (req, res) {
  console.log("getLoginData-->");
  console.log("req.params.id: " + req.params.id);
  if (general.emptyCheck(req.params.id)) {
    var id = {
      _id: ObjectId(req.params.id)
    };
    user.find(id).toArray(function (err, data) {
      console.log("data: " + JSON.stringify(data));
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
          message: "get data successfully",
          data: data
        };

        res.status(200).send(responseData);
      }
    });
  } else {
    console.log("Epty value found");
    responseData = {
      status: false,
      message: "there is no userId to find"
    };
    res.status(400).send(responseData);
  }
  console.log("<--getLoginData");
};

module.exports.adminCreate = function (req, res) {
  console.log("adminCreate-->");

  var schoolObj = {
    "schoolName": req.body.schoolName,
    "schoolRegNumber": req.body.schoolRegNumber,
    "dor": req.body.dor,
    "address": req.body.address,
    "email": req.body.email,
    "mobNumber": req.body.mobNumber,
    "streetName": req.body.streetName,
    "city": req.body.city,
    "state": req.body.state,
    "pinCode": req.body.pinCode,
    "country": req.body.country,
    "status": "active",
    "css": [],
    "logoPath": req.body.logoPath,
    "created_at": createdDate
  }
  var adminObj = {
    "firstName": req.body.firstName,
    "lastName": req.body.lastName,
    "email": req.body.email,
    "schoolName": req.body.schoolName,
    "mobNumber": req.body.mobNumber,
    "pswd": req.body.pswd,
    "status": "active",
    "loginType": "admin",
    "logoPath": req.body.logoPath,
    "created_at": createdDate
  }
  console.log("schoolObj: " + JSON.stringify(schoolObj));
  console.log("adminObj: " + JSON.stringify(adminObj));
  schoolModel.create(schoolObj, function (err, data) {
    console.log("data: " + JSON.stringify(data));
    if (err) {
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
        console.log("err" + JSON.stringify(err));
        console.log("err.name: " + err.name);
        if (err.name == 'ValidationError') {
          var message;
          if (err.errors.schoolName) {
            responseData = {
              status: false,
              message: "SchoolName is required"
            };
            res.status(400).send(responseData);
          }
          else if (err.errors.schoolRegNumber) {
            responseData = {
              status: false,
              message: "SchoolRegNumber is required"
            };
            res.status(400).send(responseData);
          }
          else if (err.errors.address) {
            responseData = {
              status: false,
              message: "Address is required"
            };
            res.status(400).send(responseData);
          }
          else if (err.errors.email) {
            responseData = {
              status: false,
              message: "Email is required"
            };
            res.status(400).send(responseData);
          }
          else if (err.errors.mobNumber) {
            responseData = {
              status: false,
              message: "Mobile number is required as a Number"
            };
            res.status(400).send(responseData);
          }
          else if (err.errors.dor) {
            responseData = {
              status: false,
              message: "Date of registration is required"
            };
            res.status(400).send(responseData);
          }
          else if (err.errors.streetName) {
            responseData = {
              status: false,
              message: "Street name is required"
            };
            res.status(400).send(responseData);
          }
          else if (err.errors.city) {
            responseData = {
              status: false,
              message: "City of registration is required"
            };
            res.status(400).send(responseData);
          }
          else if (err.errors.state) {
            responseData = {
              status: false,
              message: "State name is required"
            };
            res.status(400).send(responseData);
          }
          else if (err.errors.pinCode) {
            responseData = {
              status: false,
              message: "PinCode of registration is required"
            };
            res.status(400).send(responseData);
          }
          else if (err.errors.country) {
            responseData = {
              status: false,
              message: "Country name number is required"
            };
            res.status(400).send(responseData);
          }

        }
      }
    }
    else {
      adminObj.schoolId = data._id;
      var password = "abc";
      teacher.create(adminObj, function (err, data) {
        console.log("data: " + JSON.stringify(data));
        if (err) {
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
              else if (err.errors.email) {
                responseData = {
                  status: false,
                  message: "Email is required as a string"
                };
                res.status(400).send(responseData);
              }
              else if (err.errors.mobNumber) {
                responseData = {
                  status: false,
                  message: "Mobile number is required as a string"
                };
                res.status(400).send(responseData);
              }
              else if (err.errors.email) {
                responseData = {
                  status: false,
                  message: "Email is required as a string"
                };
                res.status(400).send(responseData);
              }
              else if (err.errors.mobNumber) {
                responseData = {
                  status: false,
                  message: "Mobile number is required as a string"
                };
                res.status(400).send(responseData);
              }
            }
          }
        } else {
          var mailOptions = {
            from: "info@vc4all.in",
            to: req.body.email,
            subject: "Regarding VC4ALL Credential",
            html: "<table style='border:10px solid gainsboro;'><thead style='background-image: linear-gradient(to bottom, #00BCD4 0%, #00bcd40f 100%);'><tr><th><h2>Greetings from VC4ALL</h2></th></tr></thead><tfoot style=background:#00bcd4;color:white;><tr><td style=padding:15px;><p><p>Regards</p><b>Careator Technologies Pvt. Ltd</b></p></td></tr></tfoot><tbody><tr><td><b>Dear Admin,</b></td></tr><tr><td><p>Please note, you have to use the following credential for login. <p style=background:gainsboro;>Here your link and credential for login.</p> <p> Link: <a href='https://vc4all.in'>https://vc4all.in/</a> </p><p> Email: "+req.body.email+"</p><p> Password: " + req.body.pswd + "</p></td></tr></tbody></table>"
            // html: "<html><head><p><b>Dear Parents, </b></p><p>Please note, you have to attend meeting regarding <b>" + req.body.reason + " </b>please open the below link at sharp " + req.body.startAt + " to " + req.body.endAt + "</p><p style=background:gainsboro;>Here your link and password for meeting <a href=" + req.body.url + ">" + req.body.url + "</a> and Password: " + password + "</p><p>Regards</p><p><b>Careator Technologies Pvt. Ltd</b></p></head><body></body></html>"
          };
          console.log("mailOptions: " + JSON.stringify(mailOptions));
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
              // responseData = {
              //     "status": true,
              //     "errorCode": 200,
              //     "message": "Registeration Successfull and Failed to send mail",
              //     "data": userData
              // }
              // res.status(200).send(responseData);
            } else {
              console.log('Email sent: ' + info.response);
              // responseData = {
              //     "status": true,
              //     "errorCode": 200,
              //     "message": "Registeration Successfull and sent mail",

              //     "data": userData
              // }
              // res.status(200).send(responseData);
            }

          });
          responseData = {
            status: true,
            errorCode: 200,
            message: "Insert Successfull",
          };
          res.status(200).send(responseData);
        }
      });
    }


    console.log("<--adminCreate");
  })

}

