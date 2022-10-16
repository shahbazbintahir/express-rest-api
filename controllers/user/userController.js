// third party import
const Joi = require("joi");

// import models
const { User, userUpdateValidate } = require('../../models/user');

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const factory = require('../handleFactory');


exports.getAllUser = factory.getAll(User);
exports.getUser = factory.getOne(User);

exports.updateUser = catchAsync(async (req, res, next) => {
  // validate request body using Joi Validation define in User Mongoes models
  const { error } = userUpdateValidate(req.body);
  if (error) {
    return next(
      new AppError(`${error.details[0].message}`, 400)
    );
  }
  // find user and update
  const userId = req.params.userId;
  const result = await User.findByIdAndUpdate(
    userId,
    req.body,
    { 
      new: false, 
      runValidators: true, 
      returnOriginal: false 
    }
  );

  res.status(200).json({ 
    message: 'User updated!', 
    user: result 
  });
});

exports.deactivateUser = catchAsync(async (req, res, next) => {
  const result = await User.findByIdAndUpdate(
    req.params.id, 
    {
      active: false,
    },
    { new: false, runValidators: true, returnOriginal: false }
  );
  res.status(200).json({
    message: 'User Deactivated!',
    user: result,
  });
});

exports.activateUser = catchAsync(async (req, res, next) => {
  const result = await User.findByIdAndUpdate(
    req.params.id, 
    {
      active: true,
    },
    { new: false, runValidators: true, returnOriginal: false }
  );
  res.status(200).json({ 
    message: 'User Activated!',
    user: result,
  });
});