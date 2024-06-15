const express = require('express');
const authController = require('../controllers/auth.controller');
const authValidator = require('../validators/auth.validator');

const v1AuthRouter = express.Router();

v1AuthRouter.post('/login', authValidator.login, authController.login);

v1AuthRouter.post('/google', authValidator.google, authController.google);

v1AuthRouter.post('/register', authValidator.register, authController.register);

v1AuthRouter.get('/check', authController.check);

module.exports = v1AuthRouter
