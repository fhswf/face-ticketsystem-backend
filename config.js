const crypto = require('crypto');

const config = {
    serverPort: 12000,
    allowedOrigins: ['http://localhost:8080', 'localhost:12000', 'https://localhost:12000', 'https://jupiter.fh-swf.de'],
    mips: {
        devices: [
            {
                id: 1, // Taken from the MIPS DB - TODO: Use MAC-Address from device API getConf to find the id from the DB
                ip: '192.168.0.134:8080',
                pass: '123456'
            }
        ],
        deviceAPI: {
            createPerson: '/person/create'
        },
        defaultData: {
            employeesInfo: {
                groupId: 20 // Taken from the MIPS DB Table tb_employees_group
            }
        }
    },
    db: {
        mips: {
            host: "mips",
            password: "mips123!",
            dialect: "mysql",
            user: "root",
            port: 3307,
            database: "mips_v4"
        },
        ticketSystem: {
            mongourl: 'mongodb://mongo-fts:27017/ticketsystem',
            host: "mongo-fts",
            password: "",
            user: "root",
            port: 27018,
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