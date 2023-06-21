const { User } = require("../../models/user");

class UserHelper {
    async getUser(userId) {
        return await User.findOne({ 
            _id: userId,
        });
    }

    getAllUser(userId) {
        return User.find();
    }
}

module.exports = UserHelper;