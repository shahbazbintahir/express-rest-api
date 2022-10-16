const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that id ', 404));
    }
    res.status(204).json({
      status: 'Success',
      message: 'doc deleted successfully',
      data: null,
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return next(new AppError('No document found with that ID', 404));
    const result = await res.json({
      status: 200,
      message: 'Document updated successfully',
      data: doc,
    });
  });

const createOne = (Model) =>
  catchAsync(async (req, res) => {
    const newTour = await Model.create(req.body);
    res.json({
      status: 'Success',
      message: 'Document created successfully',
      data: newDocument,
    });
  });

const getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;
    // const doc = await Model.findById(req.params.id).populate('reviews');
    if (!doc) return next(new AppError('No document found with that ID', 404));
    res.status(200).json({
      status: 'Success',
      data: doc,
    });
  });

  const getAll = (Model) =>
  catchAsync(async (req, res) => {
    //To Allow nested  GET reviews rotes
    let filter = {};
    if (req.params.tourId) filter.tourId = { tour: req.params.tourId };
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sorting()
      .limitFields()
      .pagination();
    const doc = await features.query;
    // const query = Tour.find();
    // const allDoc = await query;
    res.status(200).json({
      status: 'Success',
      data: doc,
    });
  });
module.exports = { deleteOne, updateOne, createOne, getOne, getAll };