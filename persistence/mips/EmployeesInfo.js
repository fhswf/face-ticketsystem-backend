const {DataTypes} = require('sequelize');

let employeesInfo = (connection) => {
    return connection.define('tb_employees_info',
        {
            id: {
                type: DataTypes.BIGINT({length: 128}),
                primaryKey: true,
                autoIncrement: true
            },
            person_id: {
                type: DataTypes.STRING({length: 32}),
                allowNull: true
            },
            name: {
                type: DataTypes.STRING({length: 128}),
                allowNull: true
            },
            sex: {
                type: DataTypes.TINYINT({length: 1}),
                allowNull: true
            },
            group_id: {
                type: DataTypes.INTEGER({length: 32}),
                allowNull: false
            },
            email: {
                type: DataTypes.STRING({length: 32}),
                allowNull: true
            },
            phone_num: {
                type: DataTypes.STRING({length: 32}),
                allowNull: true
            },
            id_card_no: {
                type: DataTypes.STRING({length: 64}),
                allowNull: true
            },
            ic_no: {
                type: DataTypes.STRING({length: 64}),
                allowNull: true
            },
            nation: {
                type: DataTypes.STRING({length: 11}),
                allowNull: true
            },
            native_place: {
                type: DataTypes.STRING({length: 64}),
                allowNull: true
            },
            birth_day: {
                type: DataTypes.DATE(),
                allowNull: true
            },
            address: {
                type: DataTypes.STRING({length: 128}),
                allowNull: true
            },
            remarks: {
                type: DataTypes.STRING({length: 128}),
                allowNull: true
            },
            type: {
                type: DataTypes.INTEGER({length: 3}),
                allowNull: false
            },
            visited_times: {
                type: DataTypes.INTEGER({length: 11}),
                allowNull: true
            },
            upload_time: {
                type: DataTypes.DATE(),
                allowNull: false
            },
            creator_login_id: {
                type: DataTypes.STRING({length: 32}),
                allowNull: true
            },
            prescription: {
                type: DataTypes.STRING({length: 128}),
                allowNull: true,
                default: '2099-01-01 00:00'
            },
            monitor_status: {
                type: DataTypes.INTEGER({length: 3}),
                allowNull: true
            },
            banci_id: {
                type: DataTypes.INTEGER({length: 11}),
                allowNull: true
            },
            device_group_ids: {
                type: DataTypes.STRING({length: 255}),
                allowNull: true
            },
            att_flag: {
                type: DataTypes.TINYINT({length: 1}),
                allowNull: true
            }
        },
        {
            timestamps: false,
            freezeTableName: true
        }
    );
};

module.exports = {employeesInfo};