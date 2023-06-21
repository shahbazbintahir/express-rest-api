const { User } = require("../../models/user");
const UserHelper = require("./UserHelper");


class AdministrationUserHelper extends UserHelper {
    async getUser(userId) {
        return await User.findOne({ 
            _id: userId,
        });
    }

    getAllUser(userId) {
        return User.find();
    }
}

module.exports = AdministrationUserHelper;