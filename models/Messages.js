const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Message = sequelize.define('Message', {
        message_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        chat_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'chats',
                key: 'chat_id'
            }
        },
        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            }
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        sent_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'messages',
        timestamps: false,
        underscored: true,
        indexes: [
            {
                fields: ['chat_id']  // For fetching all messages in a chat
            },
            {
                fields: ['sender_id']  // For user-related queries
            },
            {
                fields: ['sent_at']  // For sorting messages chronologically
            }
        ]
    });

    // Define associations
    Message.associate = (models) => {
        Message.belongsTo(models.Chat, {
            foreignKey: 'chat_id',
            as: 'chat'
        });
        Message.belongsTo(models.User, {
            foreignKey: 'sender_id',
            as: 'sender'
        });
    };

    return Message;
};