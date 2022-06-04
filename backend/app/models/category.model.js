const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {}

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
