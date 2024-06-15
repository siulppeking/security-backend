const express = require('express');
const categoryController = require('../controllers/category.controller');
const categoryValidator = require('../validators/category.validator');
const { verifyToken } = require('../middlewares/verify.token.middleware');

const v1CategoryRouter = express.Router();

v1CategoryRouter.get('/', verifyToken, categoryController.getAllCategories);
v1CategoryRouter.get('/:categoryId', verifyToken, categoryValidator.byId, categoryController.getCategoryById);
v1CategoryRouter.post('/', verifyToken, categoryValidator.create, categoryController.createCategory);
v1CategoryRouter.put('/:categoryId', verifyToken, categoryValidator.update, categoryController.updateCategory);
v1CategoryRouter.delete('/:categoryId', verifyToken, categoryValidator.byId, categoryController.deleteCategory);
v1CategoryRouter.patch('/:categoryId', verifyToken, categoryValidator.byId, categoryController.changeStatusCategory)

module.exports = v1CategoryRouter