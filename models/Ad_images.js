const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AdImage = sequelize.define('AdImage', {
        image_id: {
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
        image_url: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                isUrl: true
            }
        }
    }, {
        tableName: 'ad_images',
        timestamps: false,
        underscored: true
    });

    // Define associations
    AdImage.associate = (models) => {
        AdImage.belongsTo(models.Ad, {
            foreignKey: 'ad_id',
            as: 'ad'
        });
    };

    return AdImage;
};