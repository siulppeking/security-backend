const { Category } = require('../models/category');
const categoryService = require('../services/category.service');

const getAllCategories = async (req, res) => {
    const categories = await categoryService.getAllCategories();

    return res.status(200).send({ status: "OK", data: categories });
}

const getCategoryById = async (req, res) => {
    const categoryId = req.params.categoryId;

    const category = await categoryService.getCategoryById(categoryId);

    if (!category) {
        return res.status(404)
            .send({
                status: "FAILDED", data: {
                    error: `Category ${categoryId} not found`
                }
            });
    }


    return res.status(200).json({
        status: "OK", data: category
    })
}

const createCategory = async (req, res) => {
    const { body: categoryNew } = req;
    try {
        const category = await Category.findOne({ name: categoryNew.name });
        if (category) {
            return res.status(403)
                .send({ status: "FAILDED_DATA", data: { error: `Category ${categoryNew.name} already exists` } });
        }

        const categoryCreated = await categoryService.createCategory(categoryNew);

        res.status(201).send({ status: "OK", data: categoryCreated });
    } catch (error) {
        res
            .status(error?.status || 500)
            .send({ status: "FAILDED", data: { error: error?.message || error } });
    }
}

const updateCategory = async (req, res) => {
    const categoryId = req.params.categoryId;

    const category = await categoryService.getCategoryById(categoryId);
    if (!category) {
        return res.status(404)
            .send({
                status: "FAILDED", data: {
                    error: `Category ${categoryId} not found`
                }
            });
    }
    const { body: categoryUpd } = req;

    const categoryUpdated = await categoryService.updateCategory(categoryId, categoryUpd);
    res.status(200).send({ status: "OK", data: categoryUpdated });
}

const deleteCategory = async (req, res) => {
    const categoryId = req.params.categoryId;

    const category = await categoryService.getCategoryById(categoryId);
    if (!category) {
        return res.status(404)
            .send({
                status: "FAILDED", data: {
                    error: `Category ${categoryId} not found`
                }
            });
    }
    await categoryService.deleteCategory(categoryId);
    return res.status(204);
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
}