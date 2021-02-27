const mongoose = require('mongoose');
const {Schema} = mongoose;
const currencySchema = require('./CurrencySchema');
const purchasedTicketSchema = require('./PurchasedTicketSchema');
const {extendSchema} = require('../persistenceUtils');

// Buyers
const buyerSchema = extendSchema(
    purchasedTicketSchema,
    {
        customer: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    {
        _id: false
    }
);

// Ticket
const ticketSchema = new Schema(
    {
        number: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        creator: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },
        buyers: [buyerSchema],
        price: currencySchema,
        status: {
            type: String,
            enum: ['purchasable', 'inactive'],
            default: 'inactive',
            required: true
        },
        buyLimit: {
            type: Number
        },
        customFields: [new Schema({}, {_id: false, strict: false})]
    }
);

// Create Model
const ticketModel = mongoose.model('Ticket', ticketSchema);

// Only export UserModel
module.exports = ticketModel;