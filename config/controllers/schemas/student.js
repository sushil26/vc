var mongoose = require('mongoose');
var Schema = mongoose.Schema;
titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

// create a schema
var studentSchema = new Schema({
 
  schoolName: { type: String, required: true },
  schoolId: {type: String, required: true, unique: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  parentName: {type: String, required: true},
  parentEmail: {type: String, required: true},
  mobileNum: {type: Number, required: true},
  motherName: {type: String, required: true},
  motherEmail: {type: String, required: true},
  motherNum: {type: Number, required: true},
  cs: [{
    "_id":false,
    "class": {type: String, required: true},
    "section": {type: String, required: true}
  }],
  dob: {type: Date, required: true},
  doj: {type: Date, required: true},
  pswd: { type: String, required: true },
  status: { type: String, required: true },
  loginType: { type: String, required: true },
  attendance: [
    { "_id":false, "month": {type: String, required: true}, "dateAttendance": [] },
    { "_id":false, "month": {type: String, required: true}, "dateAttendance": [] },
    { "_id":false, "month": {type: String, required: true}, "dateAttendance": [] },
    { "_id":false, "month": {type: String, required: true}, "dateAttendance": [] },
    { "_id":false, "month": {type: String, required: true}, "dateAttendance": [] },
    { "_id":false, "month": {type: String, required: true}, "dateAttendance": [] },
    { "_id":false, "month": {type: String, required: true}, "dateAttendance": [] },
    { "_id":false, "month": {type: String, required: true}, "dateAttendance": [] },
    { "_id":false, "month": {type: String, required: true}, "dateAttendance": [] },
    { "_id":false, "month": {type: String, required: true}, "dateAttendance": [] },
    { "_id":false, "month": {type: String, required: true}, "dateAttendance": [] },
    { "_id":false, "month": {type: String, required: true}, "dateAttendance": [] }
],
mark: [
    { "_id":false, "testType": {type: String, required: true}, "subjectWithMark": [] },
    { "_id":false, "testType": {type: String, required: true}, "subjectWithMark": [] },
    { "_id":false, "testType": {type: String, required: true}, "subjectWithMark": [] },
    { "_id":false, "testType": {type: String, required: true}, "subjectWithMark": [] },
    { "_id":false, "testType": {type: String, required: true}, "subjectWithMark": [] },
], 
fee: [
  { "_id":false, "feeType": {type: String, required: true}, "details": [] },
  { "_id":false, "feeType": {type: String, required: true}, "details": [] },
  { "_id":false, "feeType": {type: String, required: true}, "details": [] },
  { "_id":false, "feeType": {type: String, required: true}, "details": [] },
  { "_id":false, "feeType": {type: String, required: true}, "details": [] },
  { "_id":false, "feeType": {type: String, required: true}, "details": [] }
], 
  created_at: Date,
 
});


studentSchema.plugin(titlize, {
  paths: ['schoolName','firstName','lastName','parentName', 'motherName', 'cs.class', 'cs.section' ]
});

module.exports = mongoose.model('student',studentSchema);
