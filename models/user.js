const mongoose = require('mongoose');
const Joi = require("joi");
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

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

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("user", userSchema);

const userValidate = (user) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(user);
};

const userUpdateValidate = (user) => {
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    role: Joi.string(),
    position: Joi.string(),
  });
  return schema.validate(user);
};

module.exports = { User, userValidate, userUpdateValidate };
