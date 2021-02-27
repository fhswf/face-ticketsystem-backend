const express = require('express');
const User = require('../persistence/ticketsystem/User');
const crypto = require('crypto');
const config = require('../config');
let router = express.Router({mergeParams: true});
const jwt = require('jsonwebtoken');
const path = require('path');
const upload = require('multer')();
const fs = require('fs');
const mime = require('mime-types');
const utils = require('../utils');
const {employeesInfoModel} = require('../persistence/mips/Models');
const FormData = require('form-data');
const fetch = require("node-fetch");

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

/**
 * Persists a user in the MIPS database and creates it for every device.
 * @param user The ticketsystem.User to be persisted as a mips.EmployeesInfo user.
 * @param img The image (File) of the user to be registered.
 * @returns {Promise<void>}
 */
async function createMIPSPerson(user, img) {
    // Transform ticket user to MIPS user
    let mipsUserObj = {
        group_id: config.mips.defaultData.employeesInfo.groupId,
        type: user.role === 'employee' ? 3 : 1,
        upload_time: new Date(),
        name: user.personal.firstname + ' ' + user.personal.lastname,
        sex: user.personal.sex,
        email: user.email,
        phone_num: user.personal.phonenumber,
        nation: user.personal.country,
        address: user.personal.address1 + user.personal.address2 ? ' ' + user.personal.address2 : '',
    };

    // Create MIPS-Entry
    let mipsUserDbEntry = await employeesInfoModel.create(mipsUserObj);

    // Create MIPS-Device-Entries
    for (let i = 0; i < config.mips.devices.length; i++) {
        let device = config.mips.devices[i];
        let formData = new FormData();

        // Create MIPS-API entry for creating a person
        let person = {
            name: mipsUserDbEntry.name,
            sex: mipsUserDbEntry.sex,
            type: mipsUserDbEntry.type,
            vipID: mipsUserDbEntry.id,
            imgBase64: utils.file2base64(img)
        };

        // Create form data for API call
        formData.append('pass', device.pass);
        formData.append('person', JSON.stringify(person));

        let payload = {
            body: formData,
            headers: '',
            method: 'POST'
        };

        fetch(`http://${device.ip}${config.mips.deviceAPI.createPerson}`, payload)
            .then(response => {
                console.log("response.body", response.body)
                console.info("Successfully called MIPS device.");
            })
            .catch(err => {
                console.error(err);
            })
    }
}

router.post('/checkEmail', (req, res, next) => {
    if (req.body && req.body.hasOwnProperty('email')) {
        let conditions = {email: req.body.email};
        if (req.body.hasOwnProperty('user') && req.body.user.hasOwnProperty('_id')) {
            conditions = {
                ...conditions,
                _id: {$ne: req.body.user._id}
            };
        }

        User.findOne(conditions)
            .then(user => {
                res.send({
                    occupied: !!user
                });
            })
            .catch(err => {
                res.send({occupied: false});
            });
    }
    else {
        res.send({occupied: false});
    }
});

router.post('/checkImage',
    upload.single('file'),
    (req, res, next) => {
        // Check params
        if (!req.file) {
            return res.status(400).send({
                hasImageOnlyOneFace: false,
                message: 'Missing picture.'
            });
        }

        // Check image
        utils.hasImageOnlyOneFace(req.file)
            .then(hasOnlyOneFace => {
                return res.send({
                    hasImageOnlyOneFace: hasOnlyOneFace
                })
            })
            .catch(err => {
                return res.send({
                    hasImageOnlyOneFace: false,
                    message: err.message
                })
            })
    }
);

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
        if (!userObj.hasOwnProperty('password')) {
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
        if (!fileUploaded) {
            return res.status(400).send({
                loggedIn: false,
                message: 'Unable to save image.'
            });
        }

        userObj.pictureFile = filename;

        // Persist
        let user = new User(userObj);
        user.save(userObj)
            .then(async function (user) {
                // don't await, just do it
                createMIPSPerson(user, req.file);

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
        return res.send({
            loggedIn: true,
            user: req.session.user
        });
    }
    return res.send({loggedIn: false});
});

router.post('/updateUser', (req, res, next) => {
    // Check params
    if (!req.hasOwnProperty('body') || !req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('user')) {
        return res.status(400).send({message: 'Missing data.'});
    }
    if (req.body.id !== req.body.user._id) {
        return res.status(400).send({message: 'IDs do not match.'});
    }

    User.updateOne({_id: req.body.id}, req.body.user)
        .then(result => {
            res.send({updated: result.n});
        })
        .catch(err => {
            console.warn(err);
            res.send({updated: 0, message: err});
        })
});

router.post('/login', (req, res, next) => {
    // Already logged in?
    if (isLoggedIn(req)) {
        return res.send({
            loggedIn: true,
            user: req.session.user
        });
    }

    // Check params
    if (!req.hasOwnProperty('body') || !req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('password')) {
        return res.status(400).send({loggedIn: false});
    }

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
});

module.exports = router;