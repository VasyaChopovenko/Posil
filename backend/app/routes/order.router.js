const express = require('express');
const productRouter = express.Router();
const ordersController = require('../controllers/order.controller');

productRouter.get('/', ordersController.findAll);
productRouter.post('/', ordersController.create);
productRouter.put('/', ordersController.update);

module.exports = productRouter;
