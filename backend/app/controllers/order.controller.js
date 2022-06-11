const db = require("../models");
const Order = db.Order;

exports.create = (req, res) => {
    Order.create({
        ...req.body,
        items: req.body.items
    }, {include: "items"}).then(data => res.send(data)).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating order."
        });
    });
};

exports.update = (req, res) => {
    Order.update(req.body, {
        where: {
            id: req.body.id
        },
        returning: true,
    }).then((data) => res.send(data)).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while updating order."
        });
    });
};

exports.findAll = (req, res) => {
    Order.findAll({include: "items", }).then(data => res.send(data)).catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving orders."
        });
    });
};
