const express = require('express');
const productController = require('../controllers/product.controller');
const productValidator = require('../validators/product.validator');
const { verifyToken } = require('../middlewares/verify.token.middleware');
const { isCategoryProductById } = require('../validators/db.validator');

const v1ProductRouter = express.Router();

v1ProductRouter.get('/', verifyToken, productController.getAllProducts);
v1ProductRouter.get('/:productId', verifyToken, productValidator.byId, productController.getProductById);
v1ProductRouter.post('/', verifyToken, productValidator.create, productController.createProduct);
v1ProductRouter.put('/:productId', verifyToken, productValidator.update, productController.updateProduct);
v1ProductRouter.delete('/:productId', verifyToken, productValidator.byId, productController.deleteProduct);
v1ProductRouter.patch('/:productId', verifyToken, productValidator.byId, productController.changeAvailableProduct)

module.exports = v1ProductRouter