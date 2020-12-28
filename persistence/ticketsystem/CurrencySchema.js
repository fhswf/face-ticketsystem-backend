const mongoose = require('mongoose');
const {Schema} = mongoose;

/**
 * The Schema for the currency to display prices. By default, the used currency represents Euros. Has no _id.
 * Examples:
 *   25.95 EUR would be {value: 2595, currency: 'EUR'}
 *   30 USD would be {value: 3000, currency: 'USD'}
 * @type {module:mongoose.Schema<any>}
 */
const currencySchema = new Schema(
    {
        value: {
            type: Number,
            required: true,
            min: 0,
            integer: true
        },
        currency: {
            type: String,
            required: true,
            default: 'EUR'
        }
    },
    {
        _id: false
    }
);

module.exports = currencySchema;