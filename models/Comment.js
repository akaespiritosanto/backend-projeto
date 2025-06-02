const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Comment = sequelize.define('Comment', {
        comment_id: {
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
        comment: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'comments',
        timestamps: false,
        underscored: true
    });

    // Define associations
    Comment.associate = (models) => {
        Comment.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        Comment.belongsTo(models.Ad, {
            foreignKey: 'ad_id',
            as: 'ad'
        });
    };

    return Comment;
};