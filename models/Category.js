const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Category = sequelize.define('Category', {
        category_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        category_name: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        sub_category_name: {
            type: DataTypes.STRING(200),
            allowNull: false
        }
    }, {
        tableName: 'categories',
        timestamps: false,
        underscored: true
    });

    return Category;
};