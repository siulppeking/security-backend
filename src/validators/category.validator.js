const { check, param } = require('express-validator');
const { mongoose } = require('mongoose');
const { validateResult } = require('../helpers/validate.helper');

const byId = [
    param('categoryId').custom(value => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid MongoDB ID');
        }
        return true;
    }),
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
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

const update = [
    param('categoryId').custom(value => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid MongoDB IDss');
        }
        return true;
    }),
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