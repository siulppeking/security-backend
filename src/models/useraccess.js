const mongoose = require('mongoose');

const UserAccessSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    host: {
        type: String,
        required: true
    },
    browser: {
        type: String,
        required: true
    }
})

const UserAccess = mongoose.model('useraccess', UserAccessSchema);

module.exports = {
    UserAccess
}