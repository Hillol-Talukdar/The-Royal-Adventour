const Tour = require("../models/tour");

exports.getAllTours = async (req, res) => {
    try {
        const queryObj = { ...req.query };
        const excludedFields = ["page", "sort", "limit", "fields"];

        excludedFields.forEach((el) => delete queryObj[el]);

        // replcaing all lte with $lte in the url for querying
        // \b \b is for exact match..
        // /g for all matched strings
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );

        // const tours = await Tour.find(queryObj);
        const query = Tour.find(JSON.parse(queryStr));
        const tours = await query;

        res.status(200).json({
            status: "Success",
            result: tours.length,
            data: {
                tours,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "Error Occured",
            message: error,
        });
    }
};

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: "Success",
            data: {
                tour,
            },
        });
    } catch (error) {
        // console.log("Error Occured", error);
        res.status(400).json({
            status: "Error Occured",
            message: error,
        });
    }
};

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: "Success",
            tour: newTour,
        });
    } catch (error) {
        // console.log("Error Occured", error);
        res.status(400).json({
            status: "Error Occured",
            message: error,
        });
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: "Success",
            data: {
                tour,
            },
        });
    } catch (error) {
        // console.log("Error Occured", error);
        res.status(400).json({
            status: "Error Occured",
            message: error,
        });
    }
};

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndRemove(req.params.id);

        res.status(200).json({
            status: "Success",
        });
    } catch (error) {
        // console.log("Error Occured", error);
        res.status(400).json({
            status: "Error Occured",
            message: error,
        });
    }
};
