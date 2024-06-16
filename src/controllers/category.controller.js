const { Category } = require('../models/category');
const { momentFormat, momentFromNow } = require('../helpers/moment.helper');

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('user');

        const categoriesResponse = categories.map((category) => {
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
        });
        return res.status(200).send({
            status: "OK",
            data: categoriesResponse
        });
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}

const getCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).send({
                status: "NOT_FOUND",
                data: { message: `Category ${categoryId} not found` }
            });
        }
        const categoryResponse = {
            categoryId: category._id,
            name: category.name,
            description: category.description
        }
        return res.status(200).send({
            status: "OK",
            data: categoryResponse
        });
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}

const createCategory = async (req, res) => {
    try {
        const { body: categoryBody } = req;
        const category = await Category.findOne({ name: categoryBody.name });
        if (category) {
            return res.status(400).send({
                status: "VALIDATION_DATA",
                data: { message: `Category ${categoryBody.name} already exists` }
            });
        }
        const { uid } = req.token;
        const categoryData = {
            name: categoryBody.name,
            description: categoryBody.description,
            user: uid
        }
        const categoryNew = new Category(categoryData);
        const categorySaved = await categoryNew.save();
        const categoryPop = await Category.findById(categorySaved._id).populate('user');
        const categoryResponse = {
            categoryId: categoryPop._id,
            name: categoryPop.name,
            description: categoryPop.description,
            active: categoryPop.active,
            createdAt: momentFormat(categoryPop.created_at, 'DD/MM/YYYY HH:mm:ss'),
            dateAt: momentFormat(categoryPop.created_at, 'DD/MM/YYYY'),
            hourAt: momentFormat(categoryPop.created_at, 'HH:mm:ss'),
            fromNow: momentFromNow(categoryPop.created_at),
            user: {
                userId: categoryPop.user._id,
                name: categoryPop.user.name
            }
        }
        return res.status(201).send({
            status: "OK",
            data: {
                message: 'Category created successfully',
                body: categoryResponse
            }
        });
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}

const updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { body: categoryBody } = req;
        const { uid } = req.token;
        const categoryData = {
            name: categoryBody.name,
            description: categoryBody.description,
            updated_at: Date.now(),
            user: uid,
        }

        const categoryUpdated = await Category.findByIdAndUpdate(categoryId, categoryData, { new: true });
        if (!categoryUpdated) {
            return res.status(404).send({
                status: "NOT_FOUND",
                data: { message: `Category ${categoryId} not found` }
            });
        }
        const categoryPop = await Category.findById(categoryId).populate('user');
        const categoryResponse = {
            categoryId: categoryPop._id,
            name: categoryPop.name,
            description: categoryPop.description,
            active: categoryPop.active,
            createdAt: momentFormat(categoryPop.created_at, 'DD/MM/YYYY HH:mm:ss'),
            dateAt: momentFormat(categoryPop.created_at, 'DD/MM/YYYY'),
            hourAt: momentFormat(categoryPop.created_at, 'HH:mm:ss'),
            fromNow: momentFromNow(categoryPop.created_at),
            user: {
                userId: categoryPop.user._id,
                name: categoryPop.user.name
            }
        }
        return res.status(200).send({
            status: "OK",
            data: {
                message: 'Category updated successfully',
                body: categoryResponse
            }
        });
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findByIdAndDelete(categoryId);
        if (!category) {
            return res.status(404).send({
                status: "NOT_FOUND",
                data: { message: `Category ${categoryId} not found` }
            });
        }
        return res.status(200).send({
            status: "OK",
            data: {
                message: 'Category deleted successfully'
            }
        });
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}

const changeStatusCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).send({
                status: "NOT_FOUND",
                data: { message: `Category ${categoryId} not found` }
            });
        }
        const { uid } = req.token;
        const categoryData = {
            updated_at: Date.now(),
            status: !category.active,
            user: uid,
        }
        const categoryPop = await Category.findByIdAndUpdate(categoryId, categoryData, { new: true }).populate('user');

        //const categoryPop = await Category.findById(categoryId).populate('user');
        const categoryResponse = {
            categoryId: categoryPop._id,
            name: categoryPop.name,
            description: categoryPop.description,
            active: categoryPop.active,
            createdAt: momentFormat(categoryPop.created_at, 'DD/MM/YYYY HH:mm:ss'),
            dateAt: momentFormat(categoryPop.created_at, 'DD/MM/YYYY'),
            hourAt: momentFormat(categoryPop.created_at, 'HH:mm:ss'),
            fromNow: momentFromNow(categoryPop.created_at),
            user: {
                userId: categoryPop.user._id,
                name: categoryPop.user.name
            }
        }
        return res.status(200).send({
            status: "OK",
            data: {
                message: 'Category change status successfully',
                body: categoryResponse
            }
        });
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    changeStatusCategory
}