const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            Category.hasOne(models.Product, {
                as: "product",
                foreignKey: "category_id",
                uniqueKey: false,
            })
        }
    }

    return Category.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'category',
        timestamps: false
    });
};
