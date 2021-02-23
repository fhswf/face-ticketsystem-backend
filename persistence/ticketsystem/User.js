const mongoose = require('mongoose');
const {Schema} = mongoose;
const purchasedTicketSchema = require('./PurchasedTicketSchema');
const {extendSchema} = require('../persistenceUtils');

// Personal information (sub document of User)
const personalSchema = new Schema(
    {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        salutation: {
            type: String
        },
        sex: {
            type: Number
        },
        phonenumber: {
            type: String
        },
        country: {
            type: String
        },
        zipcode: {
            type: String
        },
        city: {
            type: String
        },
        address1: {
            type: String
        },
        address2: {
            type: String
        }
    },
    {
        _id: false
    }
);
const personalModel = mongoose.model('Personal', personalSchema);

// Purchased Tickets
const ticketSchema = extendSchema(
    purchasedTicketSchema,
    {
        ticket: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'Ticket'
        }
    },
    {
        _id: false
    }
);

// User information
const userSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            required: true
        },
        encryptIterations: {
            type: Number,
            required: true
        },
        role: {
            type: String,
            enum: ['customer', 'employee'],
            default: 'customer',
            required: true
        },
        personal: personalSchema
    },
    {
        discriminatorKey: 'role',
        _id: true
    }
);

// Create Model
const userModel = mongoose.model('User', userSchema);

// Differentiate attributes between customer and employee
userModel.discriminator('customer', Schema({
    customerNumber: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },
    pictureFile: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },
    faceId: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },
    purchasedTickets: [ticketSchema]
}));

module.exports = userModel;