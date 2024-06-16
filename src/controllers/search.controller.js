const mongoose = require('mongoose');
const { User } = require('../models/user');
const { momentFormat, momentFromNow } = require('../helpers/moment.helper');
const { Category } = require('../models/category');

const collectionsValids = [
    'users',
    'categories',
    'products'
]

const searchUsers = async (filter, res) => {
    try {
        const isMongoId = mongoose.Types.ObjectId.isValid(filter);
        if (isMongoId) {
            const user = await User.findById(filter);
            return res.status(200).send({
                status: "OK",
                data: {
                    results: (user) ? [{
                        userId: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        avatar: user.avatar,
                        role: user.role,
                        active: user.active,
                        google: user.google,
                        createdAt: momentFormat(user.created_at, 'DD/MM/YYYY HH:mm:ss'),
                        dateAt: momentFormat(user.created_at, 'DD/MM/YYYY'),
                        hourAt: momentFormat(user.created_at, 'HH:mm:ss'),
                        fromNow: momentFromNow(user.created_at)
                    }] : []
                }
            })
        }
        const regex = new RegExp(filter, 'i');
        const users = await User.find({
            $or: [{ name: regex }, { username: regex }, { email: regex }, { avatar: regex }, { role: regex }]
        })
        const usersResponse = users.map(user => {
            return {
                userId: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                active: user.active,
                google: user.google,
                createdAt: momentFormat(user.created_at, 'DD/MM/YYYY HH:mm:ss'),
                dateAt: momentFormat(user.created_at, 'DD/MM/YYYY'),
                hourAt: momentFormat(user.created_at, 'HH:mm:ss'),
                fromNow: momentFromNow(user.created_at)
            }
        })
        return res.status(200).send({
            status: "OK",
            data: {
                results: usersResponse
            }
        })
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}
const searchCategories = async (filter, res) => {
    try {
        const isMongoId = mongoose.Types.ObjectId.isValid(filter);
        if (isMongoId) {
            const category = await Category.findById(filter)
                .populate('user');
            return res.status(200).send({
                status: "OK",
                data: {
                    results: (category) ? [{
                        categoryId: category._id,
                        name: category.name,
                        description: category.description,
                        active: category.active,
                        createdAt: momentFormat(category.created_at, 'DD/MM/YYYY HH:mm:ss'),
                        dateAt: momentFormat(category.created_at, 'DD/MM/YYYY'),
                        hourAt: momentFormat(category.created_at, 'HH:mm:ss'),
                        fromNow: momentFromNow(category.created_at),
                        user: {
                            userId: category.user._id,
                            name: category.user.name
                        }
                    }] : []
                }
            })
        }
        const regex = new RegExp(filter, 'i');
        const categories = await Category.find({
            $or: [{ name: regex }, { description: regex }]
        })
        const categoriesResponse = categories.map(category => {
            return {
                categoryId: category._id,
                name: category.name,
                description: category.description,
                active: category.active,
                createdAt: momentFormat(category.created_at, 'DD/MM/YYYY HH:mm:ss'),
                dateAt: momentFormat(category.created_at, 'DD/MM/YYYY'),
                hourAt: momentFormat(category.created_at, 'HH:mm:ss'),
                fromNow: momentFromNow(category.created_at),
                user: {
                    userId: category.user._id,
                    name: category.user.name
                }
            }
        })
        return res.status(200).send({
            status: "OK",
            data: {
                results: categoriesResponse
            }
        })
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}

const searchCollection = async (req, res) => {
    try {
        const { collection = '', filter = '' } = req.params;

        if (!collectionsValids.includes(collection)) {
            return res.status(400).send({
                status: "VALIDATION_DATA",
                data: { message: 'Invalid collection' }
            })
        }
        switch (collection) {
            case 'users':
                searchUsers(filter, res);
                break;
            case 'categories':
                searchCategories(filter, res);
                break;
            default:
                break;
        }
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}

module.exports = {
    searchCollection
}