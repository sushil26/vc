var mongoose = require('mongoose');
var Schema = mongoose.Schema;
titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

// create a schema
var monkeySchema = new Schema({
    name: { type: String, required: true},
    id: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobNumber: { type: Number, required: true, unique: true },
    created_at: Date,
});

monkeySchema.plugin(titlize, {
    paths: ['schoolName', 'firstName', 'lastName', 'css.class', 'css.section', 'css.subject']
});

module.exports = mongoose.model('monkey', monkeySchema, 'monkey');
