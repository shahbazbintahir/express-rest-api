// third party import
const Joi = require("joi");

// import models
const {User, userUpdateValidate} = require('../../models/user');


// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { Response } = require('../../../framework');
const factory = require('../handleFactory');

// get all users 
exports.getAllUser = factory.getAll(User);

// get specific users 
exports.getUser = factory.getOne(User);
exports.getByUsername = factory.getByFiled(User, "username");

// update specific users 
exports.updateUser = catchAsync(async (req, res) => {
    // validate request body using Joi Validation define in User Mongoes models
    const {error} = userUpdateValidate(req.body);
    if (error) {
        return res.status(400).json(
            Response.error({ message: `${error.details[0].message}` })
        );
    } // end if
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
    // send success response
    res.status(200).json({
        message: 'User updated!',
        nextRequestToken: req.token,
        user: result
    });
});

// deactivate specific users 
exports.deactivateUser = catchAsync(async (req, res) => {
    const result = await User.findByIdAndUpdate(
        req.params.id,
        {
            active: false,
        },
        {new: false, runValidators: true, returnOriginal: false}
    );
    res.status(200).json({
        message: 'User Deactivated!',
        nextRequestToken: req.token,
        user: result,
    });
});

// activate specific users 
exports.activateUser = catchAsync(async (req, res) => {
    const result = await User.findByIdAndUpdate(
        req.params.id,
        {
            active: true,
        },
        {new: false, runValidators: true, returnOriginal: false}
    );
    res.status(200).json({
        message: 'User Activated!',
        nextRequestToken: req.token,
        user: result,
    });
});