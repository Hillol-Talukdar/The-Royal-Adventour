const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();

    res.status(200).json({
        status: "success",
        result: reviews.length,
        data: {
            reviews,
        },
    });
});

exports.createReviews = catchAsync(async (req, res, next) => {
    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            newReview,
        },
    });
});