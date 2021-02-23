const crypto = require('crypto');

const config = {
    serverPort: 3000,
    allowedOrigins: ['localhost:3000', 'localhost:8080', 'localhost:8000',
        'http://localhost:3000', 'http://localhost:8080', 'http://localhost:8000',
        'https://localhost:3000', 'https://localhost:8080', 'https://localhost:8000'],
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
            host: "localhost",
            password: "mips123!",
            dialect: "mysql",
            user: "root",
            port: 3307,
            database: "mips_v4"
        },
        ticketSystem: {
            host: "localhost",
            password: "",
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
        location: "F:\\workspace\\fh-swf\\projekt\\pictures",
        temp: "F:\\workspace\\fh-swf\\projekt\\pictures\\tmp"
    },
    session: {
        secret: crypto.randomBytes(128).toString('base64')
    }
};

module.exports = config;