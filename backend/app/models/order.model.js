const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsToMany(models.OrderItem, {
                through: "order_items",
                as: "items",
                foreignKey: "order_id",
                uniqueKey: false,
            })
        }
    }

    return Order.init({
        status: {
            type: DataTypes.ENUM('Нове', 'В процесі', 'Виконано'),
            defaultValue: 'Нове'
        },
        clientAddress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        clientPhone: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'order',
        createdAt: true
    });
};
