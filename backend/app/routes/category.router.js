const express = require('express');
const categoryRouter = express.Router();
const categoryController = require('../controllers/category.controller');

categoryRouter.get('/', categoryController.findAll);

module.exports = categoryRouter;
