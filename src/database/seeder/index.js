const catchAsync = require('../../app/utils/catchAsync');

const PermissionSeeder = require('./PermissionSeeder');
const RoleSeeder = require('./RoleSeeder');
const UserSeeder = require('./UserSeeder');
const AdministrationPermissionSeeder = require('./AdministrationPermissionSeeder');

// add run database seed
exports.runSeed = catchAsync(async (req, res) => {
    await PermissionSeeder.run();
    await RoleSeeder.run();
    await UserSeeder.run();
    
    await AdministrationPermissionSeeder.run();

    return res.status(200).json({
        status: 'Success',
        message: 'DB Seed Added successfully',
    });
});