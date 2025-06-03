const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const UserActivity = sequelize.define('UserActivity', {
        activity_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            }
        },
        ad_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'ads',
                key: 'ad_id'
            }
        },
        activity_type: {
            type: DataTypes.ENUM('followed', 'viewed'),
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'user_activity',
        timestamps: false,
        underscored: true,
        indexes: [
            {
                fields: ['user_id']
            },
            {
                fields: ['ad_id']
            },
            {
                fields: ['activity_type']
            }
        ]
    });


    return UserActivity;
};