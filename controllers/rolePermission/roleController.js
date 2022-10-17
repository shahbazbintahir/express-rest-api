// import models
const { Role, roleValidate, roleUpdateValidate } = require('../../models/role');

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const factory = require('../handleFactory');

// get list of all roles
exports.getAllRole = factory.getAll(Role);

// get specific role
exports.getRole = factory.getOne(Role);

// add new role
exports.addRole = catchAsync(async (req, res, next) => {

  // read request body
  const name = req.body.name;
  const slug = name.replace(/(\r\n|\n|\r)/gm, "");
  const rolePermission = req.body.rolePermission;

  // validate request body using Joi Validation define in User Mongoes models
  const { error } = roleValidate({
    name: name,
    slug: slug,
    rolePermission: rolePermission,
  });
  if (error) {
    return next(
      new AppError(`${error.details[0].message}`, 400)
    );
  } // end if

  // find user from db
  const checkExistingRole = await Role.findOne({ slug: slug });
  if (checkExistingRole) {
    return next(
      new AppError(`Role Already Exist ${req.body.name} `, 400)
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
    code: 201,
    roleId: result._id.toString()
  });
});

// update specific role
exports.updateRole = catchAsync(async (req, res, next) => {

  // read request body
  const name = req.body.name;
  const slug = name.replace(/(\r\n|\n|\r)/gm, "");
  const rolePermission = req.body.rolePermission;

  // validate request body using Joi Validation define in User Mongoes models
  const { error } = roleUpdateValidate({
    name: name,
    slug: slug,
    rolePermission: rolePermission,
  });
  if (error) {
    return next(
      new AppError(`${error.details[0].message}`, 400)
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
    role: result 
  });
});
