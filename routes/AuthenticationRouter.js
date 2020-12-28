const express = require('express');
const mongoose = require('mongoose');
const User = require('../persistence/ticketsystem/User');
const crypto = require('crypto');
const config = require('../config');
let router = express.Router({mergeParams: true});
const jwt = require('jsonwebtoken');
const path = require('path');
const upload = require('multer')();
const fs = require('fs');
const mime = require('mime-types');


function isLoggedIn(request) {
    return request.hasOwnProperty('session') && request.session.hasOwnProperty('user');
}

function hashPassword(password, salt = null, iterations = null) {
    salt = salt ? salt : crypto.randomBytes(config.db.ticketSystem.data.saltBytes).toString('base64');
    iterations = iterations ? iterations : config.db.ticketSystem.data.pbkdf2Iterations;
    let hash = crypto.pbkdf2Sync(password, salt, iterations, 512, 'sha512');
    return {
        salt: salt,
        iterations: iterations,
        hash: hash.toString('base64')
    }
}

/**
 * Check whether the user entered password is correct or not.
 * @param clearPassword The user entered password (as a clear text).
 * @param userFromDb The user fetched from the database.
 * @returns {boolean} True, if the password is correct; otherwise false.
 */
function isPasswordCorrect(clearPassword, userFromDb) {
    return hashPassword(clearPassword, userFromDb.salt, userFromDb.encryptIterations).hash === userFromDb.password;
}

function calculateFaceId(pictureFile) {
    // TODO implement
    return pictureFile;
}

function generateCustomerId(user) {
    // TODO implement
    return user.email;
}

function generateJwtToken(user) {
    let userId = user._id;
    return jwt.sign({userId}, config.session.secret, {
        expiresIn: 1800 // 30 Minutes
    });
}

router.post('/register',
    upload.single('file'),
    async (req, res, next) => {
        /*
         * NOTE:
         * req.body.hasOwnProperty doesn't work, since req.body is prototype-less when using muter.
         * Use instead: 'key' in req.body
         */
        // Check params
        if (!req.body || !req.body.user) {
            return res.status(400).send({
                loggedIn: false,
                message: 'Missing user.'
            });
        }
        if (!req.file) {
            return res.status(400).send({
                loggedIn: false,
                message: 'Missing picture.'
            });
        }

        // Transform stringified JSON to object
        let userObj = JSON.parse(req.body.user);

        // Hash password
        if(!userObj.hasOwnProperty('password')) {
            return res.status(400).send({
                loggedIn: false,
                message: 'Missing password.'
            })
        }
        let hashedPassword = hashPassword(userObj.password);
        userObj.password = hashedPassword.hash;
        userObj.salt = hashedPassword.salt;
        userObj.encryptIterations = hashedPassword.iterations;

        // Customer specific attributes
        if (userObj.hasOwnProperty('role') && userObj.role === 'customer') {
            userObj.faceId = calculateFaceId(userObj.email);
            userObj.customerNumber = generateCustomerId(userObj);
        }

        // Save the image
        // let fileExtension = '.' + req.file.originalname.split('.').pop();
        let fileExtension = '.' + mime.extension(req.file.mimetype);
        let filename = userObj.customerNumber.toString() + fileExtension;
        let filepath = path.join(config.photos.location, filename);
        let fileUploaded = true;
        await fs.writeFile(filepath, req.file.buffer, err => {
            console.error(err);
            fileUploaded = false;
        });
        if(!fileUploaded) {
            return res.status(400).send({
                loggedIn: false,
                message: 'Unable to save image.'
            });
        }

        userObj.pictureFile = filename;

        // Persist
        let user = new User(userObj);
        user.save(userObj)
            .then(user => {
                res.status(200).send({
                    auth: true,
                    token: generateJwtToken(userObj),
                    loggedIn: true,
                    user: user
                })
            })
            .catch(err => {
                console.error(err);
                res.status(400).send({loggedIn: false, message: err.toString()})
            });
    });

router.get('/logout', (req, res, next) => {
    if (isLoggedIn(req)) {
        req.session.user = undefined
    }
    res.send({
        loggedIn: false,
        user: undefined
    })
});

router.get('/login', (req, res, next) => {
    // Check whether the user is already logged in
    if (isLoggedIn(req)) {
        res.send({
            loggedIn: true,
            user: req.session.user
        });
    }
    else {
        res.send({loggedIn: false});
    }
});

router.post('/login', (req, res, next) => {
    // Already logged in?
    if (isLoggedIn(req)) {
        res.send({
            loggedIn: true,
            user: req.session.user
        });
    }

    // Check params
    if (!req.hasOwnProperty('body') || !req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('password')) {
        res.status(400).send({loggedIn: false});
    }
    else {
        // Find user with email
        User.findOne({email: req.body.email})
            .then(user => {
                // Check password
                let loggedIn = isPasswordCorrect(req.body.password, user);
                let userResponse = loggedIn ? user : req.body;
                res.send({
                    loggedIn: loggedIn,
                    user: userResponse
                });
            })
            .catch(err => {
                console.error(err);
                res.send({loggedIn: false});
            });
    }
});

module.exports = router;