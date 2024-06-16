const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        default: 0
    },
    available: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        require: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories',
        require: true
    },
    imageLocal: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: null
    },
})

const Product = model('products', ProductSchema);

module.exports = {
    Product
}