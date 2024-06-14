const express = require('express');
const userController = require('../controllers/user.controller');
const userValidator = require('../validators/user.validator')

const v1UserRouter = express.Router();

v1UserRouter.post('/register', userValidator.register, userController.register);

v1UserRouter.post('/login', userValidator.login, userController.login);

v1UserRouter.get('/', userController.getAllUsers);

module.exports = {
    v1UserRouter
}