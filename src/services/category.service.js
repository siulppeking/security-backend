const { Category } = require("../models/category")

const getAllCategories = async () => {
    const categories = await Category.find();

    return categories;
}

const getCategoryById = async (categoryId) => {
    const category = await Category.findById(categoryId);

    return category;
}

const createCategory = async (categoryNew) => {
    try {
        const categoryCreated = new Category(categoryNew);
        await categoryCreated.save();
        return categoryCreated;
    } catch (error) {
        throw new Error(error.message);
    }
}

const updateCategory = async (categoryId, categoryUpd) => {
    try {
        categoryUpd.updated_at = Date.now();
        const categoryUpdated = await Category.findByIdAndUpdate(categoryId, categoryUpd, { new: true });
        return categoryUpdated;
    } catch (error) {
        throw new Error(error.message);
    }
}

const deleteCategory = async (categoryId) => {
    try {
        const categoryDeleted = await Category.findByIdAndDelete(categoryId);
        return categoryDeleted;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
}