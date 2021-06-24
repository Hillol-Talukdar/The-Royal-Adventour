const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndRemove(req.params.id);

        if (!doc) {
            return next(new AppError("No document found with that id", 404));
        }

        res.status(204).json({
            status: "Success",
        });
    });

exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!doc) {
            return next(new AppError("No document found with that id", 404));
        }

        res.status(200).json({
            status: "Success",
            data: {
                doc,
            },
        });
    });

exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(201).json({
            status: "Success",
            data: doc,
        });
    });

exports.getOne = (Model, populateOpitons) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (populateOpitons) {
            query = query.populate(populateOpitons);
        }

        const doc = await query;

        if (!doc) {
            return next(new AppError("No document found with that id", 404));
        }

        res.status(200).json({
            status: "Success",
            data: {
                data: doc,
            },
        });
    });

exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        //For allowing nested routes on tour
        let filter = {};
        if (req.params.tourId) {
            filter = { tour: req.params.tourId };
        }

        // EXECUTE QUERY
        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .pagination();

        const doc = await features.query;

        res.status(200).json({
            status: "Success",
            result: doc.length,
            data: {
                data: doc,
            },
        });
    });
