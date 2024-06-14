const { User } = require("../models/user")

const getAllUsers = async () => {
    const users = await User.find();

    return users;
}

module.exports = {
    getAllUsers
}


