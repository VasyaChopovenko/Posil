const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            Product.hasOne(models.ProductImage, {
                onDelete: 'CASCADE',
                foreignKey: {
                    name: 'product_id',
                    unique: true,
                },
                as: 'productImage'
            });

            Product.belongsTo(models.Category, {
                foreignKey: {
                    name: 'category_id'
                },
                as: "category"
            });
        }
    }

    return Product.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        countDesc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        count: {
            type: DataTypes.REAL,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(7, 2),
            allowNull: false,
        },
        weighable: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        minAmount: {
            type: DataTypes.REAL,
            defaultValue: 1.0
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        sequelize,
        tableName: 'product',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
};
