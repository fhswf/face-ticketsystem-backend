const mongoose = require('mongoose');
const { Schema } = mongoose;
const symptomsSchema = require('./SymptomsSchema');

/**
 * Define the Sub-Schema for contractor disclosures.
 * @type {module:mongoose.Schema<any>}
 */
const contractorDisclosureSchema = new Schema(
    {
        contractor: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        name: {
            type: String,
            required: true
        },
        firm: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        phone: {
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

// Create Contractor Disclosure Model
const contractorDisclosureModel = mongoose.model('ContractorDisclosure', contractorDisclosureSchema);


// Only export ContractorDisclosureModel

module.exports = contractorDisclosureModel;