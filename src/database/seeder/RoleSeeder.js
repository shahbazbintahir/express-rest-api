const { Role } = require('../../app/models/role');

class PermissionSeeder {
    static async run() {
        var roles = await Role.find();

        if (roles.length === 0) {
            roles = await Role.insertMany([
                {
                    name: 'Administration',
                    slug: 'administration',
                    rolePermission: [],
                },
                {
                    name: 'Admin',
                    slug: 'admin',
                    rolePermission: [],
                },
                {
                    name: 'Employee',
                    slug: 'employee',
                    rolePermission: [],
                },
                {
                    name: 'Member',
                    slug: 'member',
                    rolePermission: [],
                },
            ]);
        }
        return roles;
    } // end function run
} // end class PermissionSeeder

// export class
module.exports = PermissionSeeder;