const crypto = require('crypto');

const config = {
    serverPort: 12000,
    allowedOrigins: ['localhost:3000', 'https://jupiter.fh-swf.de'],
    db: {
        mips: {
            host: "mips",
            password: "",
            dialect: "mysql",
            user: "root",
            port: 3307,
            database: "mips_v4"
        },
        ticketSystem: {
            mongourl: 'mongodb://mongo-fts:27017/ticketsystem',
            host: "mongo-fts",
            password: "",
            dialect: "mysql",
            user: "root",
            port: 27017,
            database: "ticketsystem",
            data: {
                saltBytes: 64,
                pbkdf2Iterations: 100000
            }
        }
    },
    photos: {
        location: "/opt/fts/pictures",
        temp: "/opt/fts/pictures/tmp"
    },
    session: {
        secret: crypto.randomBytes(128).toString('base64')
    }
};

module.exports = config;