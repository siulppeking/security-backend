const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require("../models/user");
const { UserAccess } = require('../models/useraccess');
const userController = require('../services/user.service');

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                status: 'FAILDED_DATA',
                data: {
                    error: 'Invalid credentials'
                }
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                status: 'FAILDED_DATA',
                data: {
                    error: 'Invalid credentials pass'
                }
            });
        }

        const token = jwt.sign({ userId: user._id }, 'S3CR3TK3Y', { expiresIn: '1h' });

        // Obtener IP del cliente
        const host = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Obtener User-Agent del cliente
        const browser = req.headers['user-agent'];

        const userAccess = new UserAccess({ user: user._id, token, host, browser })
        await userAccess.save();
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
}

const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userEmail = await User.findOne({ email });
        if (userEmail) {
            return res.status(400).json({
                status: 'FAILDED_DATA',
                data: {
                    error: 'Email already exists'
                }
            });
        }
        const username = 'Anonymous' + (Math.floor(Math.random() * 90000000) + 10000000);
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
}

//getAllUsers
const getAllUsers = async (req, res) => {
    const users = await userController.getAllUsers();

    res.status(200).json({
        status: 'OK',
        data: users
    })
}

module.exports = {
    login,
    register,
    getAllUsers
}