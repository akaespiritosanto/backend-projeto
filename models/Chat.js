const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Chat = sequelize.define('Chat', {
        chat_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        ad_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'ads',
                key: 'ad_id'
            }
        },
        buyer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            }
        },
        seller_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            }
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'chats',
        timestamps: false,
        underscored: true,
        indexes: [
            {
                fields: ['ad_id']
            },
            {
                fields: ['buyer_id']
            },
            {
                fields: ['seller_id']
            },
            // Composite index for checking existing chats
            {
                fields: ['ad_id', 'buyer_id'],
                unique: true
            }
        ]
    });

    // Define associations
    Chat.associate = (models) => {
        Chat.belongsTo(models.Ad, {
            foreignKey: 'ad_id',
            as: 'ad'
        });
        Chat.belongsTo(models.User, {
            foreignKey: 'buyer_id',
            as: 'buyer'
        });
        Chat.belongsTo(models.User, {
            foreignKey: 'seller_id',
            as: 'seller'
        });
        Chat.hasMany(models.Message, {
            foreignKey: 'chat_id',
            as: 'messages'
        });
    };

    return Chat;
};