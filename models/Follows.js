const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Follow = sequelize.define('Follow', {
        follow_id: {
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
        followed_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'follows',
        timestamps: false,
        underscored: true,
        indexes: [
            {
                fields: ['user_id']
            },
            {
                fields: ['ad_id']
            },
            // Composite index for checking if a user already follows an ad
            {
                fields: ['user_id', 'ad_id'],
                unique: true
            }
        ]
    });

   
    return Follow;
};