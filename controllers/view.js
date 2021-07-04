const Tour = require("../models/tour");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getOverview = catchAsync(async (req, res, next) => {
    const tours = await Tour.find();

    res.status(200).render("overview", {
        title: "Home",
        tours,
    });
});

exports.getTour = catchAsync(async (req, res) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: "reviews",
        field: "review rating user",
    });

    if (!tour) {
        return next(new AppError("No tour found with that name!", 404));
    }

    res.status(200).render("tour", {
        title: `${tour.name} Tour`,
        tour,
    });
});

exports.loginform = (req, res) => {
    res.status(200).render("login", {
        title: "Log in",
    });
};
