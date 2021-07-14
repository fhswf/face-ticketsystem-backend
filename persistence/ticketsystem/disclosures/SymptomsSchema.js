const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Define the Sub-Schema for symptoms.
 * @type {module:mongoose.Schema<any>}
 */
const symptomsSchema = new Schema(
    {
        cough: {
            type: Boolean,
            required: true
        },
        musclePain: {
            type: Boolean,
            required: true
        },
        fever: {
            type: Boolean,
            required: true
        },
        vomit: {
            type: Boolean,
            required: true
        },
        throat: {
            type: Boolean,
            required: true
        },
        bellyache: {
            type: Boolean,
            required: true
        },
        headache: {
            type: Boolean,
            required: true
        },
        taste: {
            type: Boolean,
            required: true
        },
        smell: {
            type: Boolean,
            required: true
        },
        air: {
            type: Boolean,
            required: true
        },
        breathless: {
            type: Boolean,
            required: false
        }
    },
    {
        _id: false
    }
);

module.exports = symptomsSchema;