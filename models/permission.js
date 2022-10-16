const { array } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PermissionSchema = new Schema(
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
            trim: true ,
        },
        feature: [{
            name: {
                type: String,
                required: true
            },
            slug: {
                type: String,
                required: true
            },
        }]
    },
    {
        timestamps: true,
    }
);
const Permission = mongoose.model('permission', PermissionSchema);

const permissionValidator = (module) => {
  const schema = Joi.object({
      name: Joi.string().required(),
      slug: Joi.string().required(),
  });
  return schema.validate(user);
};

module.exports = { Permission, permissionValidator };
