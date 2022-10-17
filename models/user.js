// third party import
const mongoose = require('mongoose');
const Joi = require("joi");
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

// export model
module.exports = { User, userValidate, userUpdateValidate };
