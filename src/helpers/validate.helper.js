const { validationResult } = require('express-validator');

const validateResult = (req, res, next) => {
    try {
        validationResult(req).throw()
        return next()
    } catch (err) {
        res.status(400)
        res.send({
            status: 'VALIDATION_ERRORS',
            data: {
                errors: err.array()
            }
        })
    }
}

module.exports = { validateResult }