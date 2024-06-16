const { Category } = require("../models/category");
const { Product } = require("../models/product")

const isProductById = async (req, res, next) => {
    const { productId } = req.params;
    const producto = await Product.findById(productId);
    if (!producto) {
        return res.status(404).send({
            status: "NOT_FOUND",
            data: { message: `Product ${productId} not found` }
        });
    }
    req.productTemp = producto;
    next();
}

const isCategoryProductById = async (req, res, next) => {
    const { categoryId } = req.body;
    const category = await Category.findById(categoryId);
    if (!category) {
        return res.status(404).send({
            status: "NOT_FOUND",
            data: { message: `Category ${categoryId} not found` }
        });
    }
    req.categoryTemp = category;
    next();
}

module.exports = {
    isProductById,
    isCategoryProductById
}