const db = require("../models");
const Product = db.Product;
const ProductImage = db.ProductImage;

exports.create = (req, res) => {
    const newProduct = JSON.parse(req.body.product);
    Product.create(newProduct)
        .then(newProduct => {
            console.log('1');
            ProductImage.create({
                    name: req.file.originalname,
                    mimetype: req.file.mimetype,
                    content: req.file.buffer,
                    product_id: newProduct.id
                }
            ).then(img => {
                console.log('3');
                res.send(newProduct);
            })
                .catch(err => {
                    console.log('2');
                    res.status(500).send({
                        message:
                            err.message || `Some error occurred while creating product image`
                    });
                });
        })
        .catch(err => {
            console.log('4');
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
        Product.findByPk(req.body.id).then((data) => res.send(data));
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || `Some error occurred while updating product by id = ${req.body.id}.`
        });
    });
};

exports.delete = (req, res) => {
    const productId = req.params.id;

    ProductImage.destroy({
            where: {product_id: productId}
        }
    ).catch(err => {
            res.status(500).send({
                message:
                    err.message || `Some error occurred while deleting product image`
            });
        });

    Product.destroy({
        where: {
            id: productId
        }
    }).then(data => {
        res.send(productId);
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || `Some error occurred while deleting product by id = ${req.body.id}.`
        });
    });
};
