const jwt = require('jsonwebtoken');

const createAccessToken = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: '3600s'
            },
            (err, token) => {
                if (err) reject(err);
                resolve(token);
            }
        );
    });
}

module.exports = {
    createAccessToken
}