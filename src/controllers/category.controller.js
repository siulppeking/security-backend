const { Category } = require('../models/category');

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();

        const categoriesData = categories.map((category) => {
            return {
                categoryId: category._id,
                name: category.name,
                description: category.description,
                active: category.active
            }
        });
        return res.status(200).send({
            status: "OK",
            data: categoriesData
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
        const categoryData = {
            categoryId: category._id,
            name: category.name,
            description: category.description,
            active: category.active
        }
        return res.status(200).send({
            status: "OK",
            data: categoryData
        });
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}

const createCategory = async (req, res) => {
    const { body: categoryBody } = req;
    try {
        const category = await Category.findOne({ name: categoryBody.name });
        if (category) {
            return res.status(400).send({
                status: "VALIDATION_DATA",
                data: { message: `Category ${categoryBody.name} already exists` }
            });
        }
        const categoryNew = new Category(categoryBody);
        const categorySaved = await categoryNew.save();

        const categoryData = {
            categoryId: categorySaved._id,
            name: categorySaved.name,
            description: categorySaved.description,
            active: categorySaved.active
        }
        return res.status(201).send({
            status: "OK",
            data: {
                message: 'Category created successfully',
                body: categoryData
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
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).send({
                status: "NOT_FOUND",
                data: { message: `Category ${categoryId} not found` }
            });
        }
        const { body: categoryBody } = req;

        categoryBody.updated_at = Date.now();
        const categoryUpdated = await Category.findByIdAndUpdate(categoryId, categoryBody, { new: true });
        const categoryData = {
            categoryId: categoryUpdated._id,
            name: categoryUpdated.name,
            description: categoryUpdated.description,
            active: categoryUpdated.active
        }
        return res.status(200).send({
            status: "OK",
            data: {
                message: 'Category updated successfully',
                body: categoryData
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
        category.active = !category.active;
        const categoryUpdated = await Category.findByIdAndUpdate(categoryId, category, { new: true });
        const categoryData = {
            categoryId: categoryUpdated._id,
            name: categoryUpdated.name,
            description: categoryUpdated.description,
            active: categoryUpdated.active
        }
        return res.status(200).send({
            status: "OK",
            data: {
                message: 'Category change status successfully',
                body: categoryData
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