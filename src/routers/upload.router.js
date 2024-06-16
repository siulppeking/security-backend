const express = require('express');
const uploadController = require('../controllers/upload.controller');
const uploadValidator = require('../validators/upload.validator');

const v1UploadRouter = express.Router();

v1UploadRouter.post('/', uploadController.uploadFileUser);
v1UploadRouter.put('/users/:userId', uploadValidator.uploadFileUser, uploadController.uploadFileUser);
v1UploadRouter.put('/users/cloudinary/:userId', uploadValidator.uploadFileUser, uploadController.uploadFileUserCloudinary);
v1UploadRouter.get('/users/:userId', uploadValidator.uploadFileUser, uploadController.renderFileUser);
v1UploadRouter.put('/products/:productId', uploadValidator.uploadFileProduct, uploadController.uploadFileProduct);
v1UploadRouter.put('/products/cloudinary/:productId', uploadValidator.uploadFileProduct, uploadController.uploadFileProductCloudinary);
v1UploadRouter.get('/products/:productId', uploadValidator.uploadFileProduct, uploadController.renderFileProduct);

module.exports = v1UploadRouter