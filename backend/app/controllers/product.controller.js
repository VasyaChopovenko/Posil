const db = require("../models");
const Product = db.Product;
const ProductImage = db.ProductImage;

exports.create = (req, res) => {
    const newProduct = JSON.parse(req.body.product);
    Product.create(newProduct)
        .then(newProduct => {
            ProductImage.create({
                    name: req.file.originalname,
                    mimetype: req.file.mimetype,
                    content: req.file.buffer,
                    product_id: newProduct.id
                }
            ).then(img => {
                res.send(newProduct);
            })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || `Some error occurred while creating product image`
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating product."
            });
        });
};

exports.findAll = (req, res) => {
    const categoryId = req.query.categoryId;
    const result = !categoryId ? Product.findAll() : Product.findAll(
        {
            where: { category_id: categoryId }
        });

    result.then(data => {
        res.send(data);
    }).catch(err => {
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
