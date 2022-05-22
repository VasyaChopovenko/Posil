const express = require('express');
const productRouter = express.Router();
const productsController = require('../controllers/product.controller');
const ProductImageRouter = require('../routes/productImage.router');

productRouter.get('/', productsController.findAll);
productRouter.get('/:id', productsController.findOne);
productRouter.post('/', productsController.create);
productRouter.put('/', productsController.update);
productRouter.delete('/:id', productsController.delete);
productRouter.use('/:id/image', ProductImageRouter);

module.exports = productRouter;
