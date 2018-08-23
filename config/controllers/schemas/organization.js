var mongoose = require('mongoose');
var Schema = mongoose.Schema;
titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

// create a schema
var organizationSchema = new Schema({
    organizationName: { type: String, required: true, unique: true },
    domain: { type: String, required: true, unique: true },
    adminFirstName: { type: String, required: true },
    adminLastName: { type: String, required: true },
    dor: { type: Date, required: true },
    registrationRegNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    mobNumber: { type: Number, required: true, unique: true },
    streetName: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: Number, required: true },
    country: { type: String, required: true },
    status: { type: String, required: true },
    logoPath: { type: String },
    subscription: {type: String, required: true},
    created_at: Date,
});

organizationSchema.plugin(titlize, {
    paths: ['organizationName']
});

module.exports = mongoose.model('organizations', organizationSchema, 'organizations');
