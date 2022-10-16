// third party import
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require("joi");

// import models
const Token = require("../../models/token");
const { User, userValidate } = require('../../models/user');

// import config information
const clientSecret = require("../../config/clientSecret.config");

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const sendEmail = require("../../utils/email");

// API Function responsible for creating new user
exports.Signup = catchAsync(async (req, res, next) => {

  // read request body
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  // validate request body using Joi Validation define in User Mongoes models
  const { error } = userValidate(req.body);
  if (error) {
    return next(
      new AppError(`${error.details[0].message}`, 400)
    );
  }

  // find user from db
  const checkExistingUser = await User.findOne({ email: email });
  if (checkExistingUser) {
    return next(
      new AppError(`User Already Registered with email ${req.body.email} `, 400)
    );
  }

  // encrypt password using hashing
  const hashedPw = await bcrypt.hash(password, 12);

  // create new User object
  const user = new User({
    email: email,
    password: hashedPw,
    name: name
  });

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
  res.status(201).json({
    message: "User created!",
    code: 201,
    token: token,
    userId: result._id.toString()
  });
});

// API Function responsible for login (create access token)
exports.Login = catchAsync(async (req, res, next) => {

  // read request body
  const email = req.body.email;
  const password = req.body.password;

  let loadedUser;
  // find user from db
  const user = await User.findOne({ email: email }).select('password');
  if (!user) {
    // return with error of user not found in db
    return next(new AppError('A user with this email could not be found.', 404));
  }
  loadedUser = user;

  // match user password with request password
  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    // throw error if password is not matched
    return next(new AppError('Incorrect password!', 403));
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

  // set response with user and JWT token
  res.status(200).json({
    message: "succeed",
    code: 200,
    token: token,
    userId: loadedUser._id.toString()
  });
});

// API Function responsible for sending recover password
exports.PasswordRecover = catchAsync(async (req, res, next) => {
  // validate request body using Joi Object
  const schema = Joi.object({
    email: Joi.string().email().required()
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return next(new AppError(`${error.details[0].message}`, 400));
  }

  // find user form db
  const user = await User.findOne({
    email: req.body.email
  });
  if (!user) {
    // throw error if password is not matched
    return next(new AppError(`user with given email doesn't exist`, 404));
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
    return next(new AppError(`Request already generated! Try again later`, 401));
  }
  
  // create link 
  const link = `${process.env.BASE_URL}/api/auth/password/reset/${user._id}/${token.token}`;
  // send email
  const message = `Forgot your password? Submit a PATCH request with your new password and confirm password to: ${link}.\nIf you didn't forgot your password, please ignore this email`;
  await sendEmail({
    email: user.email,
    subject: 'Your password reset token (valid for 10 min) ',
    message,
  });

  // send success response
  return res.status(200).json({
    message: 'password reset link sent to your email account',
    code: 200,
  });
});

// API Function responsible for resting password from recovery url
exports.PasswordReset = catchAsync(async (req, res, next) => {
  // validate request body using Joi Object
  const schema = Joi.object({ password: Joi.string().required() });
  const { error } = schema.validate(req.body);
  if (error) {
    return next(new AppError(`${error.details[0].message}`, 400));
  }

  // find user form db
  const user = await User.findById(req.params.userId);
  // throw error if password is not matched
  if (!user) return next(new AppError(`User with given email doesn't exist`, 404));

  // find user token form db
  const token = await Token.findOne({
    userId: user._id,
    token: req.params.token,
  });
  // throw error if token not found is not matched
  if (!token) return next(new AppError(`Invalid link or expired`, 403));

  // encrypt password using hash
  const hashedPw = await bcrypt.hash(req.body.password, 12);
  // save user with new hash password
  user.password = hashedPw;
  await user.save();

  // delete token for retry
  await token.delete();

  // send success response
  return res.status(200).json({
    message: 'Password reset successfully.',
    code: 200,
  });
});