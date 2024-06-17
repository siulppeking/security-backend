const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require("../models/user");
const { createAccessToken } = require('../helpers/jwt.helper');
const googleHelper = require('../helpers/google.helper');
const { UserAccess } = require('../models/useraccess');

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
        const userAccessNew = new UserAccess({
            user: user._id,
            token,
            host: 'host-xys',
            browser: 'browser-xyz'
        });
        await userAccessNew.save();
        return res.status(200).send({
            status: "OK",
            data: {
                name: user.name,
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
const google = async (req, res) => {
    try {
        const { googleToken } = req.body;

        const { name, avatar, email } = await googleHelper.googleVerify(googleToken);

        const user = await User.findOne({ email });

        if (user) {
            const token = await createAccessToken({ uid: user._id });
            const userAccessNew = new UserAccess({
                user: user._id,
                token,
                host: 'host-xys',
                browser: 'browser-xyz'
            });
            await userAccessNew.save();
            return res.status(200).send({
                status: "OK",
                data: {
                    name: user.name,
                    username: user.username,
                    email,
                    token
                }
            })
        }
        const random = (Math.floor(Math.random() * 90000000) + 10000000).toString();
        const username = 'anonymous' + random;
        const hashedPassword = await bcrypt.hash(random, 10);
        const userNew = new User({
            name,
            username,
            avatar,
            email,
            google: true,
            password: hashedPassword
        });
        const userSaved = await userNew.save();

        const token = await createAccessToken({ uid: userSaved._id });
        const userAccessNew = new UserAccess({
            user: userSaved._id,
            token,
            host: 'host-xys',
            browser: 'browser-xyz'
        });
        await userAccessNew.save();
        return res.status(200).send({
            status: "OK",
            data: {
                name: userSaved.name,
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
        const random = (Math.floor(Math.random() * 90000000) + 10000000).toString();
        const name = 'user' + random;
        const username = 'anonymous' + random;
        const hashedPassword = await bcrypt.hash(password, 10);
        const userNew = new User({ name, username, email, password: hashedPassword });
        const userSaved = await userNew.save();
        const token = await createAccessToken({ uid: userSaved._id });
        const userAccessNew = new UserAccess({
            user: userSaved._id,
            token,
            host: 'host-xys',
            browser: 'browser-xyz'
        });
        await userAccessNew.save();
        return res.status(200).send({
            status: "OK",
            data: {
                name: userSaved.name,
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
                name: user.name,
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
    google,
    register,
    check
}