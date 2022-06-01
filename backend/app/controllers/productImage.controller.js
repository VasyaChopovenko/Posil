const db = require("../models");
const ProductImage = db.ProductImage;

exports.create = (req, res) => {
    const productId = req.params.id;
    ProductImage.create({
            name: req.file.originalname,
            mimetype: req.file.mimetype,
            content: req.file.buffer,
            product_id: productId
        }
    ).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || `Some error occurred while creating product image`
        });
    });
};

exports.update = (req, res) => {
    const productId = req.params.id;
    ProductImage.update({
            name: req.file.originalname,
            mimetype: req.file.mimetype,
            content: req.file.buffer,
            product_id: productId
        }, {
            where: {product_id: productId}
        }
    ).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message:
                err.message || `Some error occurred while creating product image`
        });
    });
};

exports.findOne = (req, res) => {
    console.log('ehre');
    const productId = req.params.id;
    ProductImage.findOne({where: {product_id: productId}})
        .then(data => {
            // res.set('Content-Type', data.mimetype);
            res.set('Content-Disposition', 'attachment; filename=' + data.name);
            res.send(data.content);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || `Some error occurred while retrieving product image by id = ${productId}.`
            });
        });
};
