const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2
const { User } = require('../models/user');
const { Product } = require('../models/product');

cloudinary.config(process.env.CLOUDINARY_URL);

const extensionsValids = ['jpg', 'jpeg', 'png'];

const uploadFileUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({
                status: "NOT_FOUND",
                data: { message: `User ${userId} not found` }
            });
        }

        if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
            return res.status(400).send({
                status: "VALIDATION_DATA",
                data: {
                    message: 'No files were uploaded'
                }
            })
        }
        const { archivo } = req.files;
        const split = archivo.name.split('.');

        const extension = split[split.length - 1];

        if (!extensionsValids.includes(extension)) {
            return res.status(400).send({
                status: "VALIDATION_DATA",
                data: {
                    message: `Extension .${extension} is invalid, only ${extensionsValids} are accepted`
                }
            })
        }
        if (user.imageLocal) {
            const pathImg = __dirname + '/../uploads/users/' + user.imageLocal;
            if (fs.existsSync(pathImg)) {
                fs.unlinkSync(pathImg);
            }
        }

        const name = uuidv4() + '.' + extension;
        const uploadPath = __dirname + '/../uploads/users/' + name;
        archivo.mv(uploadPath, async function (error) {
            if (error) {
                return res.status(500).send({
                    status: "EXCEPTION_ERROR",
                    data: { message: error.message }
                });
            }
            const userUpdate = await User.findByIdAndUpdate(userId, { imageLocal: name }, {
                new: true
            });
            const userResponse = {
                uid: userUpdate._id,
                name: userUpdate.name,
                username: userUpdate.username,
                email: userUpdate.email,
                imageLocal: userUpdate.imageLocal
            }
            return res.status(200).send({
                status: "OK",
                data: {
                    message: 'User updated successfully',
                    body: userResponse
                }
            })
        });
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}

const renderFileUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({
                status: "NOT_FOUND",
                data: { message: `User ${userId} not found` }
            });
        }
        if (user.imageLocal) {
            const pathImg = path.join(__dirname, '../uploads', 'users', user.imageLocal);
            if (fs.existsSync(pathImg)) {
                return res.sendFile(pathImg)
            }
        }
        const pathImgAux = path.join(__dirname, '../public', 'img', 'no-image.jpg');
        return res.status(200).sendFile(pathImgAux);
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}

const uploadFileProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({
                status: "NOT_FOUND",
                data: { message: `Product ${productId} not found` }
            });
        }

        if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
            return res.status(400).send({
                status: "VALIDATION_DATA",
                data: {
                    message: 'No files were uploaded'
                }
            })
        }
        const { archivo } = req.files;
        const split = archivo.name.split('.');

        const extension = split[split.length - 1];

        if (!extensionsValids.includes(extension)) {
            return res.status(400).send({
                status: "VALIDATION_DATA",
                data: {
                    message: `Extension .${extension} is invalid, only ${extensionsValids} are accepted`
                }
            })
        }
        if (product.imageLocal) {
            const pathImg = __dirname + '/../uploads/products/' + product.imageLocal;
            if (fs.existsSync(pathImg)) {
                fs.unlinkSync(pathImg);
            }
        }

        const name = uuidv4() + '.' + extension;
        const uploadPath = __dirname + '/../uploads/products/' + name;
        archivo.mv(uploadPath, async function (error) {
            if (error) {
                return res.status(500).send({
                    status: "EXCEPTION_ERROR",
                    data: { message: error.message }
                });
            }
            const productUpdate = await Product.findByIdAndUpdate(productId, { imageLocal: name }, {
                new: true
            });
            const userResponse = {
                productId: productUpdate._id,
                name: productUpdate.name,
                description: productUpdate.description,
                price: productUpdate.price,
                imageLocal: productUpdate.imageLocal
            }
            return res.status(200).send({
                status: "OK",
                data: {
                    message: 'Product updated successfully',
                    body: userResponse
                }
            })
        });
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}

const renderFileProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({
                status: "NOT_FOUND",
                data: { message: `Product ${product} not found` }
            });
        }
        if (product.imageLocal) {
            const pathImg = path.join(__dirname, '../uploads', 'products', product.imageLocal);
            if (fs.existsSync(pathImg)) {
                return res.status(200).sendFile(pathImg)
            }
        }
        const pathImgAux = path.join(__dirname, '../public', 'img', 'no-image.jpg');
        return res.status(200).sendFile(pathImgAux);
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}

const uploadFileUserCloudinary = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({
                status: "NOT_FOUND",
                data: { message: `User ${userId} not found` }
            });
        }

        if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
            return res.status(400).send({
                status: "VALIDATION_DATA",
                data: {
                    message: 'No files were uploaded'
                }
            })
        }
        const { archivo } = req.files;
        const split = archivo.name.split('.');

        const extension = split[split.length - 1];

        if (!extensionsValids.includes(extension)) {
            return res.status(400).send({
                status: "VALIDATION_DATA",
                data: {
                    message: `Extension .${extension} is invalid, only ${extensionsValids} are accepted`
                }
            })
        }
        if (user.imageLocal) {
            const imageUrlArr = user.imageLocal.split('/');
            const imageArr = imageUrlArr[imageUrlArr.length - 1];
            const [publicId] = imageArr.split('.');
            await cloudinary.uploader.destroy(publicId)
        }
        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath)

        const userUpdate = await User.findByIdAndUpdate(userId, { imageLocal: secure_url }, {
            new: true
        });
        const userResponse = {
            uid: userUpdate._id,
            name: userUpdate.name,
            username: userUpdate.username,
            email: userUpdate.email,
            imageLocal: userUpdate.imageLocal
        }
        return res.status(200).send({
            status: "OK",
            data: {
                message: 'User updated cloudinary successfully',
                body: userResponse
            }
        })
    } catch (error) {
        return res.status(500).send({
            status: "EXCEPTION_ERROR",
            data: { message: error.message }
        });
    }
}

const uploadFileProductCloudinary = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({
                status: "NOT_FOUND",
                data: { message: `Product ${productId} not found` }
            });
        }

        if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
            return res.status(400).send({
                status: "VALIDATION_DATA",
                data: {
                    message: 'No files were uploaded'
                }
            })
        }
        const { archivo } = req.files;
        const split = archivo.name.split('.');

        const extension = split[split.length - 1];

        if (!extensionsValids.includes(extension)) {
            return res.status(400).send({
                status: "VALIDATION_DATA",
                data: {
                    message: `Extension .${extension} is invalid, only ${extensionsValids} are accepted`
                }
            })
        }

        if (product.imageLocal) {
            const imageUrlArr = product.imageLocal.split('/');
            const imageArr = imageUrlArr[imageUrlArr.length - 1];
            const [publicId] = imageArr.split('.');
            await cloudinary.uploader.destroy(publicId)
        }
        const { tempFilePath } = req.files.archivo;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath)

        const productUpdate = await Product.findByIdAndUpdate(productId, { imageLocal: secure_url }, {
            new: true
        });
        const userResponse = {
            productId: productUpdate._id,
            name: productUpdate.name,
            description: productUpdate.description,
            price: productUpdate.price,
            imageLocal: productUpdate.imageLocal
        }
        return res.status(200).send({
            status: "OK",
            data: {
                message: 'Product updated successfully',
                body: userResponse
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
    uploadFileUser,
    renderFileUser,
    uploadFileProduct,
    renderFileProduct,
    uploadFileUserCloudinary,
    uploadFileProductCloudinary
}