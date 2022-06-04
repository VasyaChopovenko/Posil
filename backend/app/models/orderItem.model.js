const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderItem extends Model {
        static associate(models) {
            OrderItem.belongsTo(models.Product, {
                foreignKey: {name: "product_id"},
                as: "product"
            });
            OrderItem.belongsToMany(models.Order, {
                through: "order_items",
                as: "orders",
                foreignKey: "order_item_id",
                uniqueKey: false
            })
        }
    }

    return OrderItem.init({
        count: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'order_item',
        timestamps: false
    });
};
