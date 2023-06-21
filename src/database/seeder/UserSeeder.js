const { User } = require('../../app/models/user');
const bcrypt = require('bcryptjs');

class UserSeeder {
    static async run() {
        var users = await User.find();
        if (users.length === 0) {
            users = await User.insertMany([
                {
                    first_name: "Laiba",
                    middle_name: "Binta",
                    last_name: "Tahir",
                    full_name: "Laiba Binta Tahir",
                    email: "laibabintatahir@gmail.com",
                    password: await bcrypt.hash("Laiba@123", 12),
                    role: "administration"
                },
                {
                    email: "ali@gmail.com",
                    password: await bcrypt.hash("Ali@123", 12),
                    role: "member"
                },
            ]);
        }
        return users;
    } // end function run
} // end class UserSeeder

// export class
module.exports = UserSeeder;