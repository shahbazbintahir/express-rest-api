const mongoose = require('mongoose');
const Joi = require("joi");
const Schema = mongoose.Schema;

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

roleSchema.pre('save', function (next) {
    let user = this;
    user.slug = user.slug.replace(/ /g, "");
    next();
});

const Role = mongoose.model('role', roleSchema);

const roleValidate = (role) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        slug: Joi.string().required(),
        rolePermission: Joi.array(),
    });
    return schema.validate(role);
};

const roleUpdateValidate = (role) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        slug: Joi.string().required(),
        rolePermission: Joi.array(),
    });
    return schema.validate(role);
};

module.exports = { Role, roleValidate, roleUpdateValidate };
