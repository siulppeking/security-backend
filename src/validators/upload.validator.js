const { check } = require('express-validator');
const { validateResult } = require('../helpers/validate.helper');

const uploadFileUser = [
    check('userId')
        .isMongoId().withMessage('Invalid MongoDB ID'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

const uploadFileProduct = [
    check('productId')
        .isMongoId().withMessage('Invalid MongoDB ID'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {
    uploadFileUser,
    uploadFileProduct
}