const express = require('express');
const productImage = express.Router({mergeParams: true});
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});
const productImageController = require('../controllers/productImage.controller');

productImage.post('/', upload.single('productImage'), productImageController.create);
productImage.get('/', productImageController.findOne);

module.exports = productImage;
