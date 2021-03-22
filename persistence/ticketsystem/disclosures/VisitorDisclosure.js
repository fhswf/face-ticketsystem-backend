const mongoose = require('mongoose');
const {Schema} = mongoose;
const symptomsSchema = require('./SymptomsSchema');

/**
 * Define the Sub-Schema for visitor disclosures.
 * @type {module:mongoose.Schema<any>}
 */
const visitorDisclosureSchema = new Schema(
    {
        visitor: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        patient: {
            type: String,
            required: true
        },
        station: {
            type: String,
            required: true
        },
        symptoms: symptomsSchema,
        returnRiskarea: {
            type: Boolean,
            required: true
        },
        quarantine: {
            type: Boolean,
            required: true
        },
        contactLungs: {
            type: Boolean,
            required: true
        },
        contactCovid: {
            type: Boolean,
            required: true
        },
        formDate: {
            type: Date,
            required: true
        },
        temperature: {
            type: Number,
            required: false
        },
        riskarea: {
            type: String,
            required: false
        },
        riskdate: {
            type: String,
            required: false
        }
    },
    {
        _id: true
    }
);

// Create Visitor Disclosure Model
const visitorDisclosureModel = mongoose.model('VisitorDisclosure', visitorDisclosureSchema);


// Only export VisitorDisclosureModel

module.exports = visitorDisclosureModel;