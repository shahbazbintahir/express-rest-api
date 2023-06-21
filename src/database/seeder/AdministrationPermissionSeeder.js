const { Permission } = require('../../app/models/permission');
const { Role } = require('../../app/models/role');

class AdministrationPermissionSeeder {
    static async run() {
        var permissions = await Permission.find();

        var permissionList = permissions?.map((permission) => {
            return permission.feature.map((feature) => {
                return permission?.slug + "-" + feature?.slug
            });
        });
        
        var role = await Role.findOneAndUpdate(
            {
                slug: 'administration',
            },
            {
                rolePermission: [].concat(...permissionList),
            },
            { new: false, runValidators: true, returnOriginal: false }
        );
        return role;
    } // end function run
} // end class AdministrationPermissionSeeder

// export class
module.exports = AdministrationPermissionSeeder;