const express = require('express');
const cors = require('cors');
const config = require('./config');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
// const fileUpload = require('express-fileupload');

const User = require('./persistence/ticketsystem/User');
const Ticket = require('./persistence/ticketsystem/Ticket');

let mainRouter = require('./routes/MainRouter');
let authenticationRouter = require('./routes/AuthenticationRouter');

let corsOptions = {
    origin: (origin, callback) => {
        if (!origin || config.allowedOrigins.indexOf(origin) !== -1)
            callback(null, true);
        else
            callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    optionsSuccessStatus: 200
};

let app = express();
app.set('port', config.serverPort);

// Express Settings
app.use(cors(corsOptions));
app.use(express.json());
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
// app.use(fileUpload({
//     createParentPath: true,
//     useTempFiles: true,
//     tempFileDir: config.photos.temp
// }));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: config.session.secret,
    cookie: {secure: true}
}));


// Express Routes
app.use('/', mainRouter);
app.use('/auth', authenticationRouter);


// Test, TODO remove me
const customer = new User({
    email: 'peters.hans@test.com',
    password: 'hash hash hash',
    salt: 'salt salt salt',
    role: 'customer',
    customerNumber: '555-NASE',
    pictureFile: 'ugly.png',
    faceId: '2746327432',
    personal: {
        firstname: "Hans",
        lastname: "Peters"
    }
});

const customer2 = new User({
    email: 'heidelberg.anna@test.com',
    password: 'very save yes',
    salt: 'salt salt saaaalt',
    role: 'customer',
    customerNumber: '555-NASEWEIS',
    pictureFile: 'ugly2.png',
    faceId: '2746327434',
    personal: {
        firstname: "Anna",
        lastname: "Heidelberg"
    }
});

const employee = new User({
    email: 'randomEmployee@test.com',
    password: 'hash hash hash',
    salt: 'salt salt salt',
    role: 'employee',
    personal: {
        firstname: "Verkäufer",
        lastname: "Sparfuchs",
        country: "Polen"
    }
});

const ticket = new Ticket({
    number: "111222333",
    name: "Bla Concert",
    creator: employee,
    price: {
        value: 2595,
        currency: 'EUR'
    }
});

mongoose.connect('mongodb://localhost:27017/ticketsystem');

// customer.save().then(doc => console.log(doc)).catch(err => console.error(err));
// customer2.save().then(doc => console.log(doc)).catch(err => console.error(err));
// employee.save().then(doc => console.log(doc)).catch(err => console.error(err));
// ticket.save().then(doc => console.log(doc)).catch(err => console.error(err));

// Start server
let server = http.createServer(app);
server.listen(config.serverPort);
