const { User } = require("../models/User")

const getAllUsers = async () => {
    const users = await User.find();

    return users;
}

module.exports = {
    getAllUsers
}


