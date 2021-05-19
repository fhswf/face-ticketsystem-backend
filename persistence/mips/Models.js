const {Sequelize: Models} = require('sequelize');
const config = require('../../config');
let {employeesInfo} = require('./EmployeesInfo');
let {employeeDevice} = require('./EmployeeDevice');

/**
 * Start/Define the connection to the MIPS db.
 * @type {Sequelize | Model<any, string> | Transaction | BelongsTo<Model, Model>}
 */
const connection = new Models(config.db.mips.database, config.db.mips.user, config.db.mips.password, {
    host: config.db.mips.host,
    port: config.db.mips.port,
    dialect: config.db.mips.dialect
});

// Connect to MIPS DB
connection.authenticate().then(() => {
    console.info('Connected to MIPS database.');
}).catch(error => {
    console.error("Unable to connect to MIPS database.");
    // console.error(error);
    //process.exit(1);
});

// Models
let employeesInfoModel = employeesInfo(connection);
let employeeDeviceModel = employeeDevice(connection);

// Relations could be implemented in this place, but the MIPS database doesn't really use relations, it's faked

// DO NOT SYNC DATABASE so the tables don't get changed, which maybe could lead to unexpected behaviour in MIPS

module.exports = {
    connection,
    employeesInfoModel,
    employeeDeviceModel
};