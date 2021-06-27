const Tour = require("../models/tour");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res, next) => {
    const tours = await Tour.find();

    res.status(200).render("overview", {
        title: "Home",
        tours,
    });
});

exports.getTour = (req, res) => {
    res.status(200).render("tour", {
        title: "Tour",
    });
};
