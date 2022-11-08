// third party import
const mongoose = require('mongoose');
const Joi = require("joi");
const {joiPasswordExtendCore} = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);

const bcrypt = require('bcryptjs');

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for user
const userSchema = new Schema(
    {
        username: {
            type: String,
            index: true,
            unique: true,
            sparse: true
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
        first_name: {
            type: String,
            default: null,
        },
        middle_name: {
            type: String,
            default: null,
        },
        last_name: {
            type: String,
            default: null,
        },
        avatar: {
            type: String,
            default: null,
        },
        language: {
            type: String,
            default: 'en',
        },
        department: {
            type: String,
            index: true,
            default: null,
        },
        occupation: {
            type: String,
            index: true,
            default: null,
        },
        role: {
            type: String,
            default: 'user',
            required: true
        },
        position: {
            type: String,
            default: 'member',
            required: true
        },
        verified: {
            type: Boolean,
            default: false,
        },
        active: {
            type: Boolean,
            default: true,
            index: true,
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
    if (typeof (user.email) != 'undefined') {
        user.email = user.email.replace(/ /g, "").toLowerCase();
    }
    if (typeof (user.username) != 'undefined') {
        user.username = (user.username + user._id).replace(/ /g, "").toLowerCase();
    }
    next();
});

// define schema pre set rule for update operation
userSchema.pre('findOneAndUpdate', async function (next) {
    let user = this._update;
    if (typeof (user.email) != 'undefined') {
        this._update.email = user.email.replace(/ /g, "").toLowerCase();
    }
    next();
});

// create mongoose model from schema
const User = mongoose.model("user", userSchema);

// validator for adding any user
const userValidate = (user) => {
    const schema = Joi.object({
        username: Joi.string().messages({
            'string.empty': `username cannot be an empty`
        }),
        email: Joi.string().email().required().messages({'string.empty': `Email cannot be an empty`}),
        password: joiPassword.string()
            .min(4)
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
        first_name: Joi.string().messages({'string.empty': `First name cannot be an empty`}),
        middle_name: Joi.string().messages({'string.empty': `Middle name cannot be an empty`}),
        last_name: Joi.string().messages({'string.empty': `Last name cannot be an empty`}),
        avatar: Joi.string().messages({'string.empty': `Avatar cannot be an empty`}),
        language: Joi.string().messages({'string.empty': `Language cannot be an empty`}),
        department: Joi.string().messages({'string.empty': `Department cannot be an empty`}),
        occupation: Joi.string().messages({'string.empty': `Occupation cannot be an empty`}),
        role: Joi.string().messages({'string.empty': `Role cannot be an empty`}),
        position: Joi.string().messages({'string.empty': `Position cannot be an empty`}),
    });
    return schema.validate(user);
};

// validator for updating and user
const userUpdateValidate = (user) => {
    const schema = Joi.object({
        username: Joi.string().messages({'string.empty': `First name cannot be an empty`}),
        email: Joi.string().email().messages({'string.empty': `First name cannot be an empty`}),
        first_name: Joi.string().messages({'string.empty': `First name cannot be an empty`}),
        middle_name: Joi.string().messages({'string.empty': `Middle name cannot be an empty`}),
        last_name: Joi.string().messages({'string.empty': `Last name cannot be an empty`}),
        avatar: Joi.string().messages({'string.empty': `Avatar cannot be an empty`}),
        language: Joi.string().messages({'string.empty': `Language cannot be an empty`}),
        department: Joi.string().messages({'string.empty': `Department cannot be an empty`}),
        occupation: Joi.string().messages({'string.empty': `Occupation cannot be an empty`}),
        role: Joi.string().messages({'string.empty': `Role cannot be an empty`}),
        position: Joi.string().messages({'string.empty': `Position cannot be an empty`}),
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
            .min(4)
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
            .min(4)
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
module.exports = {User, userValidate, userUpdateValidate, userUpdatePasswordValidate, userRestPasswordValidate};
