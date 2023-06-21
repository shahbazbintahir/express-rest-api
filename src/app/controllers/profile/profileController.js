// third party import
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// import config information
const clientSecret = require("../../config/clientSecret.config");

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { Response } = require('../../../framework');
const { validateErrorFormatting } = require('../../utils/helperFunction');

const { Role } = require('../../models/role');
const { User, userUpdateValidate, userUpdatePasswordValidate } = require('../../models/user');

// update Login profile information 
exports.getProfile = catchAsync(async (req, res) => {
    // validate request body using Joi Validation define in User Mongoes models
    const { error } = userUpdateValidate(req.body);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    // find user and update
    const token = req.get('Authorization').split(' ')[1];
    let decodedToken = jwt.verify(token, clientSecret.key);
    const userId = decodedToken.userId;

    const profile = await User.findById(userId);

    const role = await Role.findOne({ slug: profile.role });

    // send success response
    res.status(200).json(
        Response.success({
            message: 'Profile information found!',
            status: 200,
            data: { profile, role },
            accessToken: req.token,
        })
    );
});


// update specific users
exports.updateProfile = catchAsync(async (req, res) => {
    // validate request body using Joi Validation define in User Mongoes models
    const { error } = userUpdateValidate(req.body);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if
    // find user and update
    const token = req.get('Authorization').split(' ')[1];
    let decodedToken = jwt.verify(token, clientSecret.key);
    const userId = decodedToken.userId;
    const result = await User.findByIdAndUpdate(
        userId,
        {
            ...req.body,
            "full_name": (req.body.first_name + " " + req.body.middle_name + " " + req.body.last_name).replace(/\s+/g, " ")
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
            message: 'Profile information updated!',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// deactivate specific users 
exports.deactivateProfile = catchAsync(async (req, res) => {
    const token = req.get('Authorization').split(' ')[1];
    let decodedToken = jwt.verify(token, clientSecret.key);
    const userId = decodedToken.userId;

    const result = await User.findByIdAndUpdate(
        userId,
        {
            active: false,
        },
        { new: false, runValidators: true, returnOriginal: false }
    );
    res.status(200).json(
        Response.success({
            message: 'Profile Deactivated!',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

exports.notificationSetting = catchAsync(async (req, res) => {
    const token = req.get('Authorization').split(' ')[1];
    let decodedToken = jwt.verify(token, clientSecret.key);
    const userId = decodedToken.userId;

    const result = await User.findByIdAndUpdate(
        userId,
        {
            allowEmailPromotion: false,
            allowPhonePromotion: false,
            allowEmailNotification: false,
            allowPhoneNotification: false,
        },
        { new: false, runValidators: true, returnOriginal: false }
    );
    res.status(200).json(
        Response.success({
            message: 'Notification setting updated',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    )
})

// activate specific users
exports.activateProfile = catchAsync(async (req, res) => {
    const token = req.get('Authorization').split(' ')[1];
    let decodedToken = jwt.verify(token, clientSecret.key);
    const userId = decodedToken.userId;
    const result = await User.findByIdAndUpdate(
        userId,
        {
            active: true,
        },
        { new: false, runValidators: true, returnOriginal: false }
    );
    res.status(200).json(
        Response.success({
            message: 'Profile is Reactivated!',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// update specific users 
exports.changeProfilePassword = catchAsync(async (req, res) => {
    // validate request body using Joi Validation define in User Mongoes models
    const { error } = userUpdatePasswordValidate(req.body);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    const token = req.get('Authorization').split(' ')[1];
    let decodedToken = jwt.verify(token, clientSecret.key);
    if (!decodedToken) {
        // return error
        return res.status(401).json(
            Response.notFound({ message: `Not Unauthorized` })
        );
    } // end if

    req.userId = decodedToken.userId;
    // get user
    const userResult = await User.findById(decodedToken.userId).select('password');
    // match user password with request password
    const isEqual = await bcrypt.compare(req.body.currentPassword, userResult.password);
    if (!isEqual) {
        // throw error if password is not matched
        return res.status(403).json(
            Response.notFound({ message: `Invalid Password` })
        );
    } // end if

    // find user and update
    const userId = userResult.userId;
    // encrypt password using hashing
    const hashedPw = await bcrypt.hash(req.body.newPassword, 12);
    // update password again user
    const result = await User.findByIdAndUpdate(
        userId,
        {
            password: hashedPw,
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
            message: 'Password is successfully updated!',
            status: 200,
        })
    );
});