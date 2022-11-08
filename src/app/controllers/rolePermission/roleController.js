// import models
const {Role, roleValidate, roleUpdateValidate} = require('../../models/role');

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { Response } = require('../../../framework');
const factory = require('../handleFactory');

// get list of all roles
exports.getAllRole = factory.getAll(Role);

// get specific role
exports.getRole = factory.getOne(Role);

// add new role
exports.addRole = catchAsync(async (req, res) => {

    // read request body
    const name = req.body.name;
    const slug = name.replace(/(\r\n|\n|\r)/gm, "");
    const rolePermission = req.body.rolePermission;

    // validate request body using Joi Validation define in User Mongoes models
    const {error} = roleValidate({
        name: name,
        slug: slug,
        rolePermission: rolePermission,
    });
    if (error) {
        return res.status(400).json(
            Response.error({ message: `${error.details[0].message}` })
        );
    } // end if

    // find role from db
    const checkExistingRole = await Role.findOne({slug: slug});
    if (checkExistingRole) {
        return res.status(403).json(
            Response.forbidden({ message: `Role Already Exist ${req.body.name}` })
        );
    } // end if

    // create new Role object
    const role = new Role({
        name: name,
        slug: slug,
        rolePermission: rolePermission,
    });

    // adding role in db using mongoes role Object
    const result = await role.save();

    // end success response
    res.status(201).json({
        message: "Role created!",
        nextRequestToken: req.token,
        code: 201,
        roleId: result._id.toString()
    });
});

// update specific role
exports.updateRole = catchAsync(async (req, res) => {

    // read request body
    const name = req.body.name;
    const slug = name.replace(/(\r\n|\n|\r)/gm, "");
    const rolePermission = req.body.rolePermission;

    // validate request body using Joi Validation define in User Mongoes models
    const {error} = roleUpdateValidate({
        name: name,
        slug: slug,
        rolePermission: rolePermission,
    });
    if (error) {
        return res.error(400).json(
            Response.error({ message: `${error.details[0].message}` })
        );
    } // end if

    // find role and update
    const roleId = req.params.roleId;
    const result = await Role.findByIdAndUpdate(
        roleId,
        {
            name: name,
            slug: slug,
            rolePermission: rolePermission,
        },
        {
            new: false,
            runValidators: true,
            returnOriginal: false
        }
    );
    // end success response
    res.status(200).json({
        message: 'Role updated!',
        nextRequestToken: req.token,
        role: result
    });
});
