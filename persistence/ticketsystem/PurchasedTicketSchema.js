const mongoose = require('mongoose');
const {Schema} = mongoose;
const currencySchema = require('./CurrencySchema');

/**
 * A Schema for purchased tickets, has no _id.
 * @type {module:mongoose.Schema<any>}
 */
const purchasedTicketSchema = new Schema(
    {
        dateOfPurchase: {
            type: Date,
            required: true
        },
        purchaseStatus: {
            type: String,
            required: true,
            enum: ['open', 'paid', 'canceled'],
            default: 'open'
        },
        // whether the customer came to the event or not
        eventStatus: {
            type: String,
            enum: ['pending', 'participated', 'did not come'],
            default: 'pending'
        },
        paidPrice: currencySchema
    },
    {
        _id: false
    }
);

module.exports = purchasedTicketSchema;