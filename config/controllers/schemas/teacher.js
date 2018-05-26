var mongoose = require('mongoose');
var Schema = mongoose.Schema;
titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

// create a schema
var teacherSchema = new Schema({
    schoolName: { type: String, required: true },
    schoolId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobNumber: { type: Number, required: true, unique: true },
    dob: { type: Date, required: false },
    doj: { type: Date, required: false },
    css: [{
        "_id": false,
        "class": { type: String, required: true },
        "section": { type: String, required: true },
        "subject": {type: String, required: true }
    }],
    timeTable: [],
    pswd: { type: String, required: true },
    status: { type: String, required: true },
    loginType: { type: String, required: true },
    logoPath: { type: String },
    created_at: Date,
});


teacherSchema.plugin(titlize, {
    paths: ['schoolName', 'firstName', 'lastName','css.class','css.section', 'css.subject']
});

module.exports = mongoose.model('user', teacherSchema, 'user');
