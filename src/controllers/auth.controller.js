const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require("../models/user");
const { createAccessToken } = require('../helpers/jwt.helper');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({
                status: "VALIDATION_DATA",
                data: { message: "Invalid credentials" }
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({
                status: "VALIDATION_DATA",
                data: { message: "Invalid credentials" }
            })
        }
        const token = await createAccessToken({ uid: user._id });
        return res.status(200).send({
            status: "OK",
            data: {
                username: user.username,
                email,
                token
            }
        })
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).send({
                status: "VALIDATION_DATA",
                data: { message: "Email is already" }
            })
        }
        const username = 'Anonymous' + (Math.floor(Math.random() * 90000000) + 10000000);
        const hashedPassword = await bcrypt.hash(password, 10);
        const userNew = new User({ username, email, password: hashedPassword });
        const userSaved = await userNew.save();
        const token = await createAccessToken({ uid: userSaved._id });
        return res.status(200).send({
            status: "OK",
            data: {
                username: userSaved.username,
                email,
                token
            }
        })
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}

const check = async (req, res) => {
    try {
        const token = req.header('authorization');
        if (!token) return res.status(401).send({
            status: "VALIDATION_TOKEN_EMPTY",
            data: { message: "Token is required" }
        });

        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, token) => {
            if (err) return res.status(401).send({
                status: "VALIDATION_TOKEN_INVALID",
                data: { message: "Token is invalid" }
            });
            const user = await User.findById(token.uid);
            if (!user) return res.status(401).send({
                status: "VALIDATION_TOKEN_INVALID_USER",
                data: { message: "Token is invalid user" }
            });

            return res.status(200).send({
                uid: user.id,
                username: user.username,
                email: user.email
            })
        })
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }

}

module.exports = {
    login,
    register,
    check
}