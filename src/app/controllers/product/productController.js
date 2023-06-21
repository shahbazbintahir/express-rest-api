// import models
const {Product, productUpdateValidate, productValidate} = require('../../models/product');


// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { Response } = require('../../../framework');
const factory = require('../handleFactory');
const { validateErrorFormatting } = require('../../utils/helperFunction');

// get all products 
exports.getAllProduct = factory.getAll(Product);

// get specific products 
exports.getProduct = factory.getOne(Product);

// add new product
exports.addProduct = catchAsync(async (req, res, next) => {
    const body = req.body;
    // validate request body using Joi Validation define in Product Mongoes models
    const {error} = productValidate(body);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    }
    // create new Product object
    const product = new Product(body);
    // adding product in db using mongoes product Object
    const result = await product.save();

    // set response with product and JWT token
    res.status(201).json(
        Response.success({ 
            message: "Product created!",
            status: 201,
            data: result,
            accessToken: req.token,
        })
    );
});

// update specific products 
exports.updateProduct = catchAsync(async (req, res) => {
    // validate request body using Joi Validation define in Product Mongoes models
    const {error} = productUpdateValidate(req.body);
    if (error) {
        return res.status(400).json(
            Response.error({ message: `${error.details[0].message}` })
        );
    } // end if
    // find product and update
    const productId = req.params.productId;
    const result = await Product.findByIdAndUpdate(
        productId,
        req.body,
        {
            new: false,
            runValidators: true,
            returnOriginal: false
        }
    );
    // send success response
    res.status(200).json({
        message: 'Product updated!',
        nextRequestToken: req.token,
        product: result
    });
});

// deactivate specific products 
exports.deactivateProduct = catchAsync(async (req, res) => {
    const result = await Product.findByIdAndUpdate(
        req.params.productId,
        {
            active: false,
        },
        {new: false, runValidators: true, returnOriginal: false}
    );
    res.status(200).json({
        message: 'Product Deactivated!',
        nextRequestToken: req.token,
        product: result,
    });
});

// activate specific products 
exports.activateProduct = catchAsync(async (req, res) => {
    const result = await Product.findByIdAndUpdate(
        req.params.productId,
        {
            active: true,
        },
        {new: false, runValidators: true, returnOriginal: false}
    );
    res.status(200).json({
        message: 'Product Activated!',
        nextRequestToken: req.token,
        product: result,
    });
});

// delete specific products 
exports.deleteProduct = catchAsync(async (req, res) => {
    const product = await Product.findById(
        req.params.productId,
    );
    if (!product) {
        return res.status(403).json(
            Response.forbidden({ message: `Product Information not found` })
        );
    } // end if

    const result = await product.delete();
    
    res.status(200).json({
        message: 'Product Deleted!',
        nextRequestToken: req.token,
        product: result,
    });
});
