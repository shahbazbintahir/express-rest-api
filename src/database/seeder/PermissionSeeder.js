const { Permission } = require('../../app/models/permission');

class PermissionSeeder {
    static async run() {
        var permission = await Permission.find();

        if (permission.length === 0) {
            permission = await Permission.insertMany([
                {
                    "name": "Product",
                    "slug": "product",
                    "feature": [
                        {
                            name: "Add",
                            slug: "add",
                        },
                        {
                            name: "Update",
                            slug: "update",
                        },
                        {
                            name: "Delete",
                            slug: "delete",
                        },
                        {
                            name: "View",
                            slug: "view",
                        },
                    ]
                },
                {
                    "name": "User",
                    "slug": "user",
                    "feature": [
                        {
                            name: "Add",
                            slug: "add",
                        },
                        {
                            name: "Update",
                            slug: "update",
                        },
                        {
                            name: "Delete",
                            slug: "delete",
                        },
                        {
                            name: "View",
                            slug: "view",
                        },
                    ]
                },
            ]);
        }
        return permission;
    } // end function run
} // end class PermissionSeeder

// export class
module.exports = PermissionSeeder;