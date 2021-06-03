const Tour = require("../models/tour");
const APIFeatures = require("../utils/apiFeatures");

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty";
    next();
};

exports.getAllTours = async (req, res) => {
    try {
        // EXECUTE QUERY
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .pagination();

        const tours = await features.query;

        res.status(200).json({
            status: "Success",
            result: tours.length,
            data: {
                tours,
            },
        });
    } catch (error) {
        // console.log(error);
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

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } },
            },
            {
                $group: {
                    //id is group type.i.e. $rating, $difficulty
                    // null means all
                    _id: "$difficulty",
                    numTour: { $sum: 1 },
                    numRating: { $sum: "$ratingsQuantity" },
                    avgRating: { $avg: "$ratingsAverage" },
                    avgPrice: { $avg: "$price" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" },
                },
            },
            {
                $sort: {
                    avgPrice: 1, // 1 for asc
                },
            },
        ]);

        res.status(200).json({
            status: "Success",
            data: {
                stats,
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

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind: "$startDates", // destructure array
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    },
                },
            },
            {
                $group: {
                    _id: { $month: "$startDates" },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: "$name" },
                },
            },
            {
                $addFields: { month: "$_id" },
            },
            {
                $project: {
                    // 0 means field won't show
                    // 1 means only this field will show
                    _id: 0,
                },
            },
            {
                $sort: { numTourStarts: -1 },
            },
        ]);

        res.status(200).json({
            status: "Success",
            data: {
                plan,
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
