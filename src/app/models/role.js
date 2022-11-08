// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for role
const roleSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            index: true,
            lowercase: true,
            trim: true,
        },
        rolePermission: [{
            type: String,
            lowercase: true,
            trim: true,
        }]
    },
    {
        timestamps: true,
    }
);

// define schema pre set rule for save operation
roleSchema.pre('save', function (next) {
    let role = this;
    if (typeof (role.slug) != 'undefined') {
        role.slug = role.slug.replace(/ /g, "").toLowerCase();
    } // end if
    next();
});

// define schema pre set rule for update operation
roleSchema.pre('findOneAndUpdate', async function (next) {
    let role = this;
    if (typeof (role.slug) != 'undefined') {
        role.slug = role.slug.replace(/ /g, "").toLowerCase();
    } // end if
    next();
});

// create mongoose model from schema
const Role = mongoose.model('role', roleSchema);

// validator for adding any role
const roleValidate = (role) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        slug: Joi.string().required(),
        rolePermission: Joi.array(),
    });
    return schema.validate(role);
};

// validator for updating and role
const roleUpdateValidate = (role) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        slug: Joi.string().required(),
        rolePermission: Joi.array(),
    });
    return schema.validate(role);
};

// export model
module.exports = {Role, roleValidate, roleUpdateValidate};
