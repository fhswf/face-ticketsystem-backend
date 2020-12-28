const jwt = require('jsonwebtoken');
const config = require('../config');

const verifyJWT = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if(!token) {
        res.status(403).send({message: 'Missing JWT token.'});
    }
    else {
        jwt.verify(token, config.session.secret, (err, decoded) => {
            if(err) {
                res.status(403).send({
                    auth: false,
                    message: 'Unable to authorize.'
                });
            }
            else {
                req.body.user = decoded.user;
                next();
            }
        });
    }
};

module.exports = verifyJWT;