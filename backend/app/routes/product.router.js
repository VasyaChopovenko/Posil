const express = require('express');
const productRouter = express.Router();
const productsController = require('../controllers/product.controller');
const ProductImageRouter = require('../routes/productImage.router');
const CategoryRouter = require('../routes/category.router');
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

productRouter.use('/categories', CategoryRouter);
productRouter.get('/', productsController.findAll);
productRouter.post('/cart', productsController.findByIds);
productRouter.get('/:id', productsController.findOne);
productRouter.post('/', upload.single('productImage'), productsController.create);
productRouter.put('/', productsController.update);
productRouter.delete('/:id', productsController.delete);
productRouter.use('/:id/image', ProductImageRouter);

module.exports = productRouter;
