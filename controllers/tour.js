const Tour = require("../models/tour");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");
const multer = require("multer");
const sharp = require("sharp");

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = "5";
    req.query.sort = "-ratingsAverage,price";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty";
    next();
};

const multerStorage = multer.memoryStorage(); // save image in memory

const multerFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    } else {
        callback(
            new AppError("Not an image! Please upload only images", 400),
            false
        );
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 3 },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
    // Cover image
    if (req.files.imageCover) {
        // req.body is used so that cover name can be excessed from other middlewares such as UdpateOne
        req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

        // image which is in memory can be excess using buffer
        // sharp will resize file and save it in exact location and format
        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`public/img/tours/${req.body.imageCover}`);
    }

    //  Images
    if (req.files.images) {
        req.body.images = [];

        await Promise.all(
            req.files.images.map(async (file, i) => {
                // we use map instead of foreach to save the 3 promises. loop, sharp, push
                const filename = `tour-${req.params.id}-${Date.now()}-${
                    i + 1
                }.jpeg`;

                await sharp(file.buffer)
                    .resize(2000, 1333)
                    .toFormat("jpeg")
                    .jpeg({ quality: 90 })
                    .toFile(`public/img/tours/${filename}`);

                req.body.images.push(filename);
            })
        );
    }

    next();
});

exports.getAllTours = factory.getAll(Tour);

exports.getTour = factory.getOne(Tour, { path: "reviews" });

exports.createTour = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
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
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
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
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(",");
    const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;
    //radius of earth = 3963.2 mile(6378.1 km)

    if (!lat || !lng) {
        next(
            new AppError(
                "Please provide latitude and longitude in the format lat,lng"
            ),
            400
        );
    }

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            data: tours,
        },
    });
});

exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(",");
    const multiplier = unit === "mi" ? 0.000621371 : 0.001;
    //1 meter = 0.000621371 mile (0.001 km)

    if (!lat || !lng) {
        next(
            new AppError(
                "Please provide latitude and longitude in the format lat,lng"
            ),
            400
        );
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [lng * 1, lat * 1],
                },
                distanceField: "distance",
                distanceMultiplier: multiplier,
            },
        },
        {
            $project: {
                distance: 1,
                name: 1,
            },
        },
    ]);

    res.status(200).json({
        status: "success",
        data: {
            data: distances,
        },
    });
});
