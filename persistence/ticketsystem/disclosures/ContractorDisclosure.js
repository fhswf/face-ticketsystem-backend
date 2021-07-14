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
        vaccinated: {
            type: Boolean,
            default: false
        },
        recovered: {
            type: Boolean,
            default: false
        },
        tested: {
            type: Boolean,
            default: false
        },
        symptoms: {
            type: symptomsSchema,
            required: false
        },
        returnRiskarea: {
            type: Boolean,
            required: false
        },
        quarantine: {
            type: Boolean,
            required: false
        },
        contactLungs: {
            type: Boolean,
            required: false
        },
        contactCovid: {
            type: Boolean,
            required: false
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