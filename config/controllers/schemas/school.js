var mongoose = require('mongoose');
var Schema = mongoose.Schema;
titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

// create a schema
var schoolSchema = new Schema({
    schoolName: { type: String, required: true, unique: true },
    schoolRegNumber: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobNumber: { type: Number, required: true, unique: true },
    dor: { type: Date, required: true },
    streetName: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: Number, required: true },
    country: { type: String, required: true },
    css: [],
    status: { type: String, required: true },
    logoPath: { type: String},
    created_at: Date,
});

schoolSchema.plugin(titlize, {
    paths: ['schoolName', 'firstName', 'lastName', 'css.class', 'css.section', 'css.subject']
});

module.exports = mongoose.model('school', schoolSchema, 'school');
