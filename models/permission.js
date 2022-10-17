// third party import
const mongoose = require('mongoose');
const Joi = require("joi");
const { object, array } = require('joi');

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for permission
const permissionSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true,
            index: true,
            lowercase: true,
            trim: true,
        },
        feature: {
            type: Array,
        }
    },
    {
        timestamps: true,
    }
);

// define schema pre set rule for save operation
permissionSchema.pre('save', async function (next) {
    if (typeof (this.feature) != 'undefined') {
        const permissionFeaturesPromise = this.feature.map((str) => ({ name: str, slug: str.replace(/ /g, "").toLowerCase() }));
        this.feature = await Promise.all(permissionFeaturesPromise);
    } // end if
    next();
});

// define schema pre set rule for update operation
permissionSchema.pre('findOneAndUpdate', async function (next) {
    if (typeof (this._update.feature) != 'undefined') {
        const permissionFeaturesPromise = this._update.feature.map((str) => ({ name: str, slug: str.replace(/ /g, "").toLowerCase() }));
        this._update.feature = await Promise.all(permissionFeaturesPromise);
    } // end if
    next();
});

// create mongoose model from schema
const Permission = mongoose.model('permission', permissionSchema);

// validator for adding any permission
const permissionValidator = (permission) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        slug: Joi.string().required(),
        feature: Joi.array(),
    });
    return schema.validate(permission);
};

// validator for updating and permission
const permissionUpdateValidate = (permission) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        slug: Joi.string().required(),
        feature: Joi.array(),
    });
    return schema.validate(permission);
};

// export model
module.exports = { Permission, permissionValidator, permissionUpdateValidate };
