const {DataTypes} = require('sequelize');

let employeeDevice = (connection) => {
    return connection.define('tb_employee_device',
        {
            id: {
                type: DataTypes.INTEGER({length: 12}),
                primaryKey: true,
                autoIncrement: true
            },
            device_id: {
                type: DataTypes.INTEGER({length: 12}),
                allowNull: false
            },
            vip_id: {
                type: DataTypes.INTEGER({length: 12}),
                allowNull: false
            },
            prescription: {
                type: DataTypes.STRING({length: 128}),
                allowNull: true
            },
            monitor_status: {
                // 0:抓拍上报 1:抓拍上报 并开启声音 - 0: Snapshot and report 1: Capture and report and turn on the sound
                type: DataTypes.INTEGER({length: 3}),
                allowNull: true
            },
            picture_status: {
                // 人像校验状态 0:未校验 1:校验通过 2:校验失败 - Portrait verification status
                // 0: Not verified 1: Pass the verification 2: verification failed
                type: DataTypes.INTEGER({length: 12}),
                allowNull: true,
                default: 0
            }
        },
        {
            timestamps: false,
            freezeTableName: true,
            indexes: [
                {
                    unique: true,
                    fields: ['device_id', 'vip_id']
                }
            ]
        }
    );
};

module.exports = {employeeDevice};