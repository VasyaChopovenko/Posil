const db = require("../models");
const Product = db.Product;

exports.create = (req, res) => {
    Product.create(req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating products."
            });
        });
};

exports.findAll = (req, res) => {
    Product.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving products."
            });
        });
};

exports.findOne = (req, res) => {
    const productId = req.params.id;
    Product.findByPk(productId)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || `Some error occurred while retrieving product by id = ${productId}.`
            });
        });
};

exports.update = (req, res) => {
    Product.update(req.body, {
        where: {
            id: req.body.id
        }
    }).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || `Some error occurred while updating product by id = ${req.body.id}.`
        });
    });
};

exports.delete = (req, res) => {
    const productId = req.params.id;
    Product.destroy({
        where: {
            id: productId
        }
    }).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || `Some error occurred while deleting product by id = ${req.body.id}.`
        });
    });
};
