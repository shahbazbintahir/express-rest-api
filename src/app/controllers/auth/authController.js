// third party import
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require("joi");

// import models
const Token = require("../../models/token");
const { User, userSignUpValidate, userUpdatePasswordValidate, userRestPasswordValidate } = require('../../models/user');

// import config information
const clientSecret = require("../../config/clientSecret.config");

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { validateErrorFormatting } = require('../../utils/helperFunction');
const { Response } = require('../../../framework');
const sendForgetPasswordMail = require("../../utils/email/forgetPassword");

// API Function responsible for creating new user
exports.Signup = catchAsync(async (req, res) => {

    const body = req.body;

    // validate request body using Joi Validation define in User Mongoes models
    const { error } = userSignUpValidate(body);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    }

    // find user from db
    const checkExistingUser = await User.findOne({ email: body.email });
    if (checkExistingUser) {
        return res.status(400).json(
            Response.error({ message: `User Already Registered with email ${body.email}` })
        );
    }

    if (typeof (body.username) == 'undefined') {
        body.username = "";
    } // set user name

    // encrypt password using hashing
    body.password = await bcrypt.hash(body.password, 12);
    // create new User object
    const user = new User(body);
    // adding user in db using mongoes user Object
    const result = await user.save();

    // create JWT for user
    const token = jwt.sign(
        {
            email: result.email,
            userId: result._id.toString()
        },
        clientSecret.key,
        { expiresIn: '1h' }
    );

    // set response with user and JWT token
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Account created!",
            data: result,
            accessToken: token,
        })
    );
});

// API Function responsible for login (create access token)
exports.Login = catchAsync(async (req, res) => {

    // read request body
    const user_info = req.body.email;
    const password = req.body.password;

    let loadedUser;
    // find user from db
    const user = await User.findOne({ $or: [{ username: user_info }, { email: user_info }] }).select('password');
    if (!user) {
        // return with error of user not found in db
        return res.status(403).json(
            Response.forbidden({ message: `Incorrect email/password!` })
        );
    }
    loadedUser = user;

    // match user password with request password
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
        // throw error if password is not matched
        return res.status(403).json(
            Response.forbidden({ message: 'Incorrect email/password!' })
        );
    }

    // create JWT for user
    const token = jwt.sign(
        {
            email: loadedUser.email,
            userId: loadedUser._id.toString()
        },
        clientSecret.key,
        { expiresIn: '1h' }
    );


    const loginUserInfo = await User.findById(loadedUser._id);

    // set response with user and JWT token
    res.status(200).json(
        Response.success({
            status: 200,
            message: "succeed",
            data: loginUserInfo,
            accessToken: token,
        })
    );
});

// API Function responsible for sending recover password
exports.PasswordRecover = catchAsync(async (req, res) => {
    // validate request body using Joi Object
    const schema = Joi.object({
        email: Joi.string().email().required(),
        reference_url: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    }

    // find user form db
    const user = await User.findOne({
        email: req.body.email
    });
    if (!user) {
        // throw error if password is not matched
        return res.status(404).json(
            Response.notFound({ message: `User with given email doesn't exist` })
        );
    }

    // check already existing token for again user form db
    let token = await Token.findOne({
        userId: user._id
    });

    if (!token) {
        // if token not exist in db, create new JWT token
        const generateJwtToken = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString()
            },
            clientSecret.key,
            { expiresIn: '10m' }
        );

        // save token in db for record
        token = await new Token({
            userId: user._id,
            token: generateJwtToken,
        }).save();
    } else {
        return res.status(401).json(
            Response.unauthorize({ message: `Request already generated! Try again later` })
        );
    }

    // create link
    const link = `${req.body.reference_url}${user._id}/${token.token}`;
    // send email
    await sendForgetPasswordMail({
        email: user.email,
        subject: 'Password reset instructions',
        name: user.first_name,
        link: link,
        websiteLink: "https://ecom.com.sa/"
    });

    // send success response
    return res.status(200).json(
        Response.success({
            message: 'You will receive an email with instructions about how to reset your password in a few minutes. Please check your spam folder if you do not receive it after a few minutes.',
            status: 200,
        })
    );
});

// API Function responsible for resting password from recovery url
exports.PasswordReset = catchAsync(async (req, res) => {
    // validate request body using Joi Rule
    const { error } = userRestPasswordValidate(req.body);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    }

    // find user form db
    const user = await User.findById(req.body.userId);
    // throw error if password is not matched
    if (!user) return res.status(404).json(
        Response.notFound({ message: `User with given email doesn't exist` })
    );
    // find user token form db
    const token = await Token.findOne({
        userId: user._id,
        token: req.body.token,
    });
    // throw error if token not found is not matched
    if (!token) return res.status(403).json(
        Response.forbidden({ message: `Invalid link or expired` })
    );

    // encrypt password using hash
    const hashedPw = await bcrypt.hash(req.body.password, 12);
    // save user with new hash password
    user.password = hashedPw;
    await user.save();

    // delete token for retry
    await token.delete();

    // send success response
    return res.status(200).json(
        Response.success({
            message: 'Password reset successfully.',
            status: 200,
        })
    );
});

