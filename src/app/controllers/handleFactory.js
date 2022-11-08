// import utils (helper functions)
const catchAsync = require('../utils/catchAsync');
const { Response } = require('../../framework');
const APIFeatures = require('../utils/apiFeatures');

// delete one
const deleteOne = (Model) =>
    catchAsync(async (req, res) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return res.status(404).json(
                Response.notFound({ message: `No document found with that ID` })
            );
        }
        res.status(204).json({
            status: 'Success',
            nextRequestToken: req.token,
            message: 'doc deleted successfully',
            data: null,
        });
    });

// update one
const updateOne = (Model) =>
    catchAsync(async (req, res) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doc) return res.status(404).json(
            Response.notFound({ message: `No document found with that ID` })
        );
        const result = await res.json({
            status: 200,
            nextRequestToken: req.token,
            message: 'Document updated successfully',
            data: doc,
        });
    });

// delete one
const createOne = (Model) =>
    catchAsync(async (req, res) => {
        const newTour = await Model.create(req.body);
        res.json({
            status: 'Success',
            nextRequestToken: req.token,
            message: 'Document created successfully',
            data: newDocument,
        });
    });

// get one
const getOne = (Model, populateOptions) =>
    catchAsync(async (req, res) => {
        let query = Model.findById(req.params.id);
        if (populateOptions) {
            query = query.populate(populateOptions);
        }
        const doc = await query;
        // const doc = await Model.findById(req.params.id).populate('reviews');
        if (!doc) return res.status(404).json(
            Response.notFound({ message: `No document found with that ID` })
        );
        res.status(200).json({
            status: 'Success',
            nextRequestToken: req.token,
            data: doc,
        });
    });

const getByFiled = (Model, getBy, populateOptions) =>
    catchAsync(async (req, res) => {
        let query = Model.findOne({[getBy]: req.params.id});
        if (populateOptions) query = query.populate(populateOptions);
        const doc = await query;
        // const doc = await Model.findById(req.params.id).populate('reviews');
        if (!doc) return res.status(404).json(
            Response.notFound({ message: `No document found with that ID` })
        );
        res.status(200).json({
            status: 'Success',
            nextRequestToken: req.token,
            data: doc,
        });
    });

// get all
const getAll = (Model, populateOptions) =>
    catchAsync(async (req, res) => {
        //To Allow nested  GET reviews rotes
        let filter = {};
        if (req.params.tourId) filter.tourId = {tour: req.params.tourId};
        let query = Model.find()
        if (populateOptions) query = query.populate(populateOptions);
        const features = new APIFeatures(query, req.query)
            .filter()
            .sorting()
            .limitFields()
            .pagination();
        const doc = await features.query;
        // const query = Tour.find();
        // const allDoc = await query;
        res.status(200).json({
            status: 'Success',
            nextRequestToken: req.token,
            data: doc,
        });
    });

// export all function
module.exports = {deleteOne, updateOne, createOne, getOne, getByFiled, getAll};