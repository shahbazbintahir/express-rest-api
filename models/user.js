// third party import
const mongoose = require('mongoose');
const Joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);

const bcrypt = require('bcryptjs');

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for user
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      sparse: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    photo: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'administration'],
      default: 'user',
      required: true
    },
    position: {
      type: String,
      default: 'member',
      required: true
    },
  },
  {
    timestamps: true,
  }
);

// define schema method for checking password and confirm password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// define schema pre set rule for save operation
userSchema.pre('save', function (next) {
    let user = this;
    if(typeof(user.email) != 'undefined'){
      user.email = user.email.replace(/ /g, "").toLowerCase();
    }
    next();
});

// define schema pre set rule for update operation
userSchema.pre('findOneAndUpdate', async function (next) {
    let user = this._update;
    if(typeof(user.email) != 'undefined'){
      this._update.email = user.email.replace(/ /g, "").toLowerCase();
    }
    next();
});

// create mongoose model from schema
const User = mongoose.model("user", userSchema);

// validator for adding any user
const userValidate = (user) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(user);
};

// validator for updating and user
const userUpdateValidate = (user) => {
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    role: Joi.string(),
    position: Joi.string(),
  });
  return schema.validate(user);
};

// validator for updating and user
const userUpdatePasswordValidate = (user) => {
  const schema = Joi.object({
    currentPassword: Joi.string()
    .min(4)
    .required()
    .messages({
      'string.empty': `Current password cannot be an empty`,
      'string.min': `Current password should have a minimum length of {#limit} characters`,
      'any.required': `Current password is a required`,
    }),
    newPassword: joiPassword.string()
      .invalid(Joi.ref('currentPassword'))
      .minOfSpecialCharacters(1)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required()
      .messages({
        'string.empty': `Password cannot be an empty`,
        'string.min': `Password should have a minimum length of {#limit} characters`,
        'any.required': `Password is a required`,
        'any.invalid': `Password must be different from current password`,
        "password.minOfUppercase": 'Password must contain at least one uppercase letter',
        "password.minOfLowercase": 'Password must contain at least one lowercase letter',
        "password.minOfNumeric": 'Password must contain at least one number',
        "password.minOfSpecialCharacters": 'Password must contain at least one special character',
        "password.noWhiteSpaces": 'Password must not contain spaces',
      }),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
      'string.empty': `Confirm password cannot be an empty`,
      'any.only': `Confirm password must be same as password`,
      'any.required': `Confirm password is a required`,
    }),
  });
  return schema.validate(user);
};


// validator for updating and user
const userRestPasswordValidate = (user) => {
  const schema = Joi.object({
    userId: Joi.string()
    .required()
    .messages({
      'string.empty': `User information cannot be an empty`,
      'any.required': `User information is a required`,
    }),
    token: Joi.string()
    .required()
    .messages({
      'string.empty': `Token information cannot be an empty`,
      'any.required': `Token information is a required`,
    }),
    password: joiPassword.string()
      .minOfSpecialCharacters(1)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required()
      .messages({
        'string.empty': `Password cannot be an empty`,
        'string.min': `Password should have a minimum length of {#limit} characters`,
        'any.required': `Password is a required`,
        "password.minOfUppercase": 'Password must contain at least one uppercase letter',
        "password.minOfLowercase": 'Password must contain at least one lowercase letter',
        "password.minOfNumeric": 'Password must contain at least one number',
        "password.minOfSpecialCharacters": 'Password must contain at least one special character',
        "password.noWhiteSpaces": 'Password must not contain spaces',
      }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'string.empty': `Confirm password cannot be an empty`,
      'any.only': `Confirm password must be same as password`,
      'any.required': `Confirm password is a required`,
    }),
  });
  return schema.validate(user);
};


// export model
module.exports = { User, userValidate, userUpdateValidate, userUpdatePasswordValidate, userRestPasswordValidate };
