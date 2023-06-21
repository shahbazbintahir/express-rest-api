const { User } = require("../../models/user");

const AdminUserHelper = require("./AdminUserHelper");
const AdministrationUserHelper = require("./AdministrationUserHelper");
const EmployeeUserHelper = require("./EmployeeUserHelper");
const MemberUserHelper = require("./MemberUserHelper");

// get article Object
exports.getUserObject = async (userId) => {

    const user = await User.findById(userId);

    let articleObject = null;

    switch (user?.role) {
        case 'administration':
            articleObject = new AdministrationUserHelper();
            break;
        case 'admin':
            articleObject = new AdminUserHelper();
            break;
        case 'employee':
            articleObject = new EmployeeUserHelper();
            break;
        default:
            articleObject = new MemberUserHelper();
            break;
    }

    return articleObject;
};
