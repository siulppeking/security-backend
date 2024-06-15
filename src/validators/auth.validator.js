const { check } = require("express-validator");
const { validateResult } = require("../helpers/validate.helper");

const register = [
    check('email')
        .exists().withMessage('Email request must contain')
        .notEmpty().withMessage('Email not empty')
        .isEmail().withMessage('Enter a valid email'),

    check('password')
        .exists().withMessage('Password request must contain')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

const login = [
    check('email')
        .exists().withMessage('Email request must contain')
        .notEmpty().withMessage('Email not empty')
        .isEmail().withMessage('Enter a valid email'),

    check('password')
        .exists().withMessage('Password request must contain')
        .notEmpty().withMessage('Password is required'),

    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {
    register,
    login
}