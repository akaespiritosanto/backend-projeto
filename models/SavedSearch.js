const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const SavedSearch = sequelize.define('SavedSearch', {
        search_id: {
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
        search_query: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'saved_searches',
        timestamps: false,
        underscored: true,
        indexes: [
            {
                fields: ['user_id']  // Index for faster queries by user
            }
        ]
    });

    // Define associations
    SavedSearch.associate = (models) => {
        SavedSearch.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
    };

    return SavedSearch;
};