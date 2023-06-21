// third party import
const bcrypt = require('bcryptjs');
// import models
const { User, userValidate, userUpdateValidate } = require('../../models/user');

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { validateErrorFormatting } = require('../../utils/helperFunction');
const { generatePassword } = require('../../utils/helperFunction');

const { Response } = require('../../../framework');
const factory = require('../handleFactory');
const newUserCreationEmail = require("../../utils/email/newUserCreationEmail");
const { getUserObject } = require('../../helper/User');
const APIFeatures = require('../../utils/apiFeatures');

// get all users 
exports.getAllUser = catchAsync(async (req, res) => { 
    
    let filter = {};
    if (req.params.tourId) filter.tourId = {tour: req.params.tourId};

    const user = await getUserObject(req.userId);
    let query = user.getAllUser(req.userId);

    const features = new APIFeatures(query, req.query)
            .filter()
            .sorting()
            .limitFields()
            .pagination();

    const doc = await features.query;

    res.status(200).json(
        Response.success({ 
            message: 'Success',
            status: 200,
            data: doc,
            accessToken: req.token,
        })
    );
});

// get specific users 
exports.getUser = catchAsync(async (req, res) => { 
    const user = await getUserObject(req.userId);
    let query = await user.getUser(req.params.id);

    res.status(200).json(
        Response.success({ 
            message: 'Success',
            status: 200,
            data: query,
            accessToken: req.token,
        })
    );
});
exports.getByUsername = factory.getByFiled(User, "username");

// add new user
exports.addUser = catchAsync(async (req, res) => {
    const body = req.body;

    // validate request body using Joi Validation define in User Mongoes models
    const { error } = userValidate(body);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    // find user from db
    const checkExistingUser = await User.findOne({ email: body.email });
    if (checkExistingUser) {
        return res.status(400).json(
            Response.error({ message: `User Already exist with email ${body.email}` })
        );
    }

    if (typeof (body.username) == 'undefined') {
        body.username = "";
    } // set user name

    const generatedPassword = generatePassword(8);
    body.password = await bcrypt.hash(generatedPassword, 12);
    // create new User object
    const user = new User({
        ...body,
        full_name: (body.first_name + " " + body.middle_name + " " + body.last_name).trim()
    });
    // adding user in db using mongoes user Object
    const result = await user.save();

    // send email
    newUserCreationEmail({
        email: result.email,
        subject: 'Welcome to Ecome',
        name: result.first_name,
        password: generatedPassword,
        websiteLink: ""
    });

    // set response with company and JWT token
    res.status(200).json(
        Response.success({
            message: "User created!",
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// update specific users 
exports.updateUser = catchAsync(async (req, res) => {
    // validate request body using Joi Validation define in User Mongoes models
    const { error } = userUpdateValidate(req.body);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if
    // find user and update
    const userId = req.params.userId;
    const result = await User.findByIdAndUpdate(
        userId,
        {
            ...req.body,
            full_name: (req.body.first_name + " " + req.body.middle_name + " " + req.body.last_name).trim()
        },
        {
            new: false,
            runValidators: true,
            returnOriginal: false
        }
    );
    // send success response
    res.status(200).json(
        Response.success({
            message: 'User updated!',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// deactivate specific users 
exports.deactivateUser = catchAsync(async (req, res) => {
    const result = await User.findByIdAndUpdate(
        req.params.id,
        {
            active: false,
        },
        { new: false, runValidators: true, returnOriginal: false }
    );
    res.status(200).json(
        Response.success({
            message: 'User Deactivated!',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// activate specific users 
exports.activateUser = catchAsync(async (req, res) => {
    const result = await User.findByIdAndUpdate(
        req.params.id,
        {
            active: true,
        },
        { new: false, runValidators: true, returnOriginal: false }
    );
    res.status(200).json(
        Response.success({
            message: 'User Activated!',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});
