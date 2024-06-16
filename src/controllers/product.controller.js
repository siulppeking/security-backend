const { Product } = require('../models/product');
const { Category } = require('../models/category');
const { momentFormat, momentFromNow } = require('../helpers/moment.helper');

const getAllProducts = async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const query = {
        active: true
    }
    try {
        const [totalResults, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .skip(skip).limit(limitNumber)
                .populate('user')
                .populate('category')
        ]);

        const totalPages = Math.ceil(totalResults / limitNumber);

        const productsResponse = products.map((product) => {
            return {
                productId: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                active: product.active,
                available: product.available,
                createdAt: momentFormat(product.created_at, 'DD/MM/YYYY HH:mm:ss'),
                dateAt: momentFormat(product.created_at, 'DD/MM/YYYY'),
                hourAt: momentFormat(product.created_at, 'HH:mm:ss'),
                fromNow: momentFromNow(product.created_at),
                user: {
                    userId: product.user._id,
                    name: product.user.name
                },
                category: {
                    categoryId: product.category._id,
                    name: product.category.name,
                    description: product.category.description,
                    categoryComplete: product.category.name + ' - ' + product.category.description
                }
            }
        });
        return res.status(200).send({
            status: "OK",
            data: {
                totalResults,
                totalPages,
                currentPage: pageNumber,
                results: productsResponse
            }
        });
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}

const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const producto = await Product.findOne({ _id: productId, active: true })
            .populate('category')

        if (!producto) {
            return res.status(404).send({
                status: "NOT_FOUND",
                data: { message: `Product ${productId} not found` }
            });
        }
        const productResponse = {
            productId: producto._id,
            name: producto.name,
            description: producto.description,
            price: producto.price,
            category: {
                categoryId: producto.category._id
            }
        }
        return res.status(200).send({
            status: "OK",
            data: productResponse
        });
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}

const createProduct = async (req, res) => {
    try {
        const { body: productBody } = req;
        const category = await Category.findOne({ _id: productBody.categoryId, active: true });
        if (!category) {
            return res.status(404).send({
                status: "NOT_FOUND",
                data: { message: `Category ${productBody.categoryId} not found` }
            });
        }
        const product = await Product.findOne({ name: productBody.name, active: true });
        if (product) {
            return res.status(400).send({
                status: "VALIDATION_DATA",
                data: { message: `Product ${productBody.name} already exists` }
            });
        }
        const { uid } = req.token;
        const productData = {
            name: productBody.name,
            description: productBody.description,
            price: productBody.price,
            user: uid,
            category: productBody.categoryId
        }
        const productNew = new Product(productData);
        const productSaved = await productNew.save();
        const productPop = await Product.findById(productSaved._id)
            .populate('user')
            .populate('category');

        const productResponse = {
            productId: productPop._id,
            name: productPop.name,
            description: productPop.description,
            price: productPop.price,
            active: productPop.active,
            available: productPop.available,
            createdAt: momentFormat(productPop.created_at, 'DD/MM/YYYY HH:mm:ss'),
            dateAt: momentFormat(productPop.created_at, 'DD/MM/YYYY'),
            hourAt: momentFormat(productPop.created_at, 'HH:mm:ss'),
            fromNow: momentFromNow(productPop.created_at),
            user: {
                userId: productPop.user._id,
                name: productPop.user.name
            },
            category: {
                categoryId: productPop.category._id,
                name: productPop.category.name,
                description: productPop.category.description,
                categoryComplete: productPop.category.name + ' - ' + productPop.category.description
            }
        }
        return res.status(201).send({
            status: "OK",
            data: {
                message: 'Product created successfully',
                body: productResponse
            }
        });
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}

const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const producto = await Product.findOne({ _id: productId, active: true });
        if (!producto) {
            return res.status(404).send({
                status: "NOT_FOUND",
                data: { message: `Product ${productId} not found` }
            });
        }

        const { body: productBody } = req;
        const category = await Category.findOne({ _id: productBody.categoryId, active: true });
        if (!category) {
            return res.status(404).send({
                status: "NOT_FOUND",
                data: { message: `Category ${productBody.categoryId} not found` }
            });
        }

        // Named duplicates where different productId  allowed
        const isValidProduct = await Product.findOne({ name: productBody.name, active: true, _id: { $ne: productId } })
        if (isValidProduct) {
            return res.status(400).send({
                status: "VALIDATION_DATA",
                data: { message: `Product ${productBody.name} already exists` }
            });
        }

        const { uid } = req.token;
        const productData = {
            category: productBody.categoryId,
            name: productBody.name,
            description: productBody.description,
            price: productBody.price,
            user: uid,
            updated_at: Date.now()
        }

        const productPop = await Product.findByIdAndUpdate(productId, productData, { new: true })
            .populate('user')
            .populate('category');

        const productResponse = {
            productId: productPop._id,
            name: productPop.name,
            description: productPop.description,
            price: productPop.price,
            active: productPop.active,
            available: productPop.available,
            createdAt: momentFormat(productPop.created_at, 'DD/MM/YYYY HH:mm:ss'),
            dateAt: momentFormat(productPop.created_at, 'DD/MM/YYYY'),
            hourAt: momentFormat(productPop.created_at, 'HH:mm:ss'),
            fromNow: momentFromNow(productPop.created_at),
            user: {
                userId: productPop.user._id,
                name: productPop.user.name
            },
            category: {
                categoryId: productPop.category._id,
                name: productPop.category.name,
                description: productPop.category.description,
                categoryComplete: productPop.category.name + ' - ' + productPop.category.description
            }
        }
        return res.status(200).send({
            status: "OK",
            data: {
                message: 'Product updated successfully',
                body: productResponse
            }
        });
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const producto = await Product.findOne({ _id: productId, active: true });
        if (!producto) {
            return res.status(404).send({
                status: "NOT_FOUND",
                data: { message: `Product ${productId} not found` }
            });
        }

        const productUpdated = await Product.findByIdAndUpdate(productId, { active: false });
        return res.status(200).send({
            status: "OK",
            data: {
                message: 'Product deleted successfully'
            }
        });
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}

const changeAvailableProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findOne({ _id: productId, active: true });
        if (!product) {
            return res.status(404).send({
                status: "NOT_FOUND",
                data: { message: `Product ${productId} not found` }
            });
        }
        const { uid } = req.token;
        const productData = {
            updated_at: Date.now(),
            available: !product.available,
            user: uid,
        }
        const productPop = await Product.findByIdAndUpdate(productId, productData, { new: true })
            .populate('user')
            .populate('category');

        const productResponse = {
            productId: productPop._id,
            name: productPop.name,
            description: productPop.description,
            price: productPop.price,
            active: productPop.active,
            available: productPop.available,
            createdAt: momentFormat(productPop.created_at, 'DD/MM/YYYY HH:mm:ss'),
            dateAt: momentFormat(productPop.created_at, 'DD/MM/YYYY'),
            hourAt: momentFormat(productPop.created_at, 'HH:mm:ss'),
            fromNow: momentFromNow(productPop.created_at),
            user: {
                userId: productPop.user._id,
                name: productPop.user.name
            },
            category: {
                categoryId: productPop.category._id,
                name: productPop.category.name,
                description: productPop.category.description,
                categoryComplete: productPop.category.name + ' - ' + productPop.category.description
            }
        }
        return res.status(200).send({
            status: "OK",
            data: {
                message: 'Product change available successfully',
                body: productResponse
            }
        })
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    changeAvailableProduct
}