const express = require('express');
const categoryController = require('../controllers/category.controller');
const categoryValidator = require('../validators/category.validator');

const v1CategoryRouter = express.Router();

v1CategoryRouter.get('/', categoryController.getAllCategories);
v1CategoryRouter.get('/:categoryId', categoryValidator.byId, categoryController.getCategoryById);
v1CategoryRouter.post('/', categoryValidator.create, categoryController.createCategory);
v1CategoryRouter.put('/:categoryId', categoryValidator.update, categoryController.updateCategory);
v1CategoryRouter.delete('/:categoryId', categoryValidator.byId, categoryController.deleteCategory);

module.exports = {
    v1CategoryRouter
}