const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ProductImage extends Model {}

    return ProductImage.init({
        name: {
            type: DataTypes.STRING,
        },
        mimetype: {
            type: DataTypes.STRING,
        },
        content: {
            type: DataTypes.BLOB,
        }
    }, {
        sequelize,
        tableName: 'product_image',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
};
