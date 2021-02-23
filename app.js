const express = require('express');
const cors = require('cors');
const config = require('./config');
const http = require('http');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');

let mainRouter = require('./routes/MainRouter');
let disclosureRouter = require('./routes/DisclosureRouter');
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
app.use('/disclosure', disclosureRouter);
app.use('/auth', authenticationRouter);

mongoose.connect('mongodb://localhost:27017/ticketsystem');

// Start server
let server = http.createServer(app);
server.listen(config.serverPort);