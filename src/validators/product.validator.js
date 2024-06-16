const { check } = require('express-validator');
const { validateResult } = require('../helpers/validate.helper');

const byId = [
    check('productId')
        .isMongoId().withMessage('Invalid MongoDB ID'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

const create = [
    check('name')
        .exists().withMessage('Name is body must be a valid')
        .not()
        .isEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be a length minimum of 2'),
    check('description')
        .exists().withMessage('Description is body must be a valid')
        .not()
        .isEmpty().withMessage('Description is required'),
    check('price')
        .exists().withMessage('Price is body must be a valid')
        .notEmpty().withMessage('Price is required'),
    check('categoryId')
        .exists().withMessage('CategoryId is body must be a valid')
        .notEmpty().withMessage('CategoryId is required')
        .isMongoId().withMessage('CategoryId is Invalid MongoDB ID'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

const update = [
    check('productId')
        .isMongoId().withMessage('Invalid MongoDB ID'),
    check('name')
        .exists().withMessage('Name is body must be a valid update')
        .not()
        .isEmpty().withMessage('Name is required update')
        .isLength({ min: 2 }).withMessage('Name must be a length minimum of 2'),
    check('description')
        .exists().withMessage('Description is body must be a valid')
        .not()
        .isEmpty().withMessage('Description is required'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {
    byId,
    create,
    update
}