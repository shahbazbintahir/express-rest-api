// import models
const { Role, roleValidate, roleUpdateValidate } = require('../../models/role');

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const factory = require('../handleFactory');


exports.getAllRole = factory.getAll(Role);
exports.getRole = factory.getOne(Role);


// API Function responsible for creating new user
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
  }

  // find user from db
  const checkExistingRole = await Role.findOne({ slug: slug });
  if (checkExistingRole) {
    return next(
      new AppError(`Role Already Exist ${req.body.name} `, 400)
    );
  }

  // create new Role object
  const role = new Role({
    name: name,
    slug: slug,
    rolePermission: rolePermission,
  });

  // adding role in db using mongoes role Object
  const result = await role.save();

  // set response with user and JWT token
  res.status(201).json({
    message: "Role created!",
    code: 201,
    roleId: result._id.toString()
  });
});


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
  }

  // find role and update
  const roleId = req.params.roleId;
  const result = await Role.findByIdAndUpdate(
    roleId,
    {
      name: name,
      slug: slug,
      rolePermission: rolePermission,
    },
    { new: false, runValidators: true, }
  );

  res.status(200).json({ 
    message: 'Role updated!', 
    role: result 
  });
});
