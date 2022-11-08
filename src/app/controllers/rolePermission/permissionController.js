// import models
const {Permission, permissionValidator, permissionUpdateValidate} = require('../../models/permission');

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { Response } = require('../../../framework');
const factory = require('../handleFactory');

// get list of all permission
exports.getAllPermission = factory.getAll(Permission);

// get specific permission
exports.getPermission = factory.getOne(Permission);

// add new permission
exports.addPermission = catchAsync(async (req, res) => {
    // read request body
    const name = req.body.name;
    const slug = name.replace(/(\r\n|\n|\r)/gm, "");
    const feature = req.body.feature;

    // validate request body using Joi Validation define in User Mongoes models
    const {error} = permissionValidator({
        name: name,
        slug: slug,
        feature: feature,
    });
    if (error) {
        return res.status(400).json(
            Response.error({ message: `${error.details[0].message}` })
        );
    } // end if

    // create new Permission object
    const permission = new Permission({
        name: name,
        slug: slug,
        feature: feature,
    });

    // adding Permission in db using mongoes Permission Object
    const result = await permission.save();

    // set response with user and JWT token
    res.status(201).json({
        message: "Permission created!",
        nextRequestToken: req.token,
        code: 201,
        permissionId: result._id.toString()
    });
});

// update specific permission
exports.updatePermission = catchAsync(async (req, res) => {
    console.log("yes");
    // read request body
    const name = req.body.name;
    const slug = name.replace(/(\r\n|\n|\r)/gm, "");
    const feature = req.body.feature;

    // validate request body using Joi Validation define in User Mongoes models
    const {error} = permissionUpdateValidate({
        name: name,
        slug: slug,
        feature: feature,
    });
    if (error) {
        return res.status(400).json(
            Response.error({ message: `${error.details[0].message}` })
        );
    } // end if
    // find Permission and update
    const PermissionId = req.params.permissionId;
    const result = await Permission.findByIdAndUpdate(
        PermissionId,
        {
            name: name,
            slug: slug,
            feature: feature,
        },
        {
            new: false,
            runValidators: true,
            returnOriginal: false
        }
    );
    // end success response
    res.status(200).json({
        message: 'Permission updated!',
        nextRequestToken: req.token,
        Permission: result
    });
});
