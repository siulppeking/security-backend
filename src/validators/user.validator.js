const { check } = require("express-validator")
const { validateResult } = require("../helpers/validate.helper")

const register = [
    check('email').isEmail().withMessage('Enter a valid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

const login = [
    check('email').isEmail().withMessage('Enter a valid email'),
    check('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {
    register,
    login
}