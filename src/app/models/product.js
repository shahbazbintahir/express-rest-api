// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for product
const productSchema = new Schema(
    {
        title: {
            type: String,
            index: true,
        },
        description: {
            type: String,
            required: true,
        },
        stock: {
            type: Number,
            required: 0,
        },
        price: {
            type: Number,
            default: 1000,
        },
        sales_price: {
            type: Number,
            default: 1200,
        },
        file: {
            type: String,
            default: null,
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

// create mongoose model from schema
const Product = mongoose.model("product", productSchema);

// validator for adding any product
const productValidate = (product) => {
    const schema = Joi.object({
        title: Joi.string().messages({'string.empty': `Title cannot be an empty`}),
        description: Joi.string().messages({'string.empty': `Description cannot be an empty`}),
        stock: Joi.number().messages({'string.empty': `Stock cannot be an empty`}),
        price: Joi.number().messages({'string.empty': `Price cannot be an empty`}),
        file: Joi.string().messages({'string.empty': `Picture cannot be an empty`}),
        sales_price: Joi.number().messages({'string.empty': `Sales price cannot be an empty`}),
    });
    return schema.validate(product);
};

// validator for updating and product
const productUpdateValidate = (product) => {
    const schema = Joi.object({
       
        title: Joi.string().messages({'string.empty': `Title cannot be an empty`}),
        description: Joi.string().messages({'string.empty': `Description cannot be an empty`}),
        stock: Joi.number().messages({'string.empty': `Stock cannot be an empty`}),
        price: Joi.number().messages({'string.empty': `Price cannot be an empty`}),
        file: Joi.string().messages({'string.empty': `Picture cannot be an empty`}),
        sales_price: Joi.number().messages({'string.empty': `Sales price cannot be an empty`}),
    });
    return schema.validate(product);
};


// export model
module.exports = {Product, productValidate, productUpdateValidate};
