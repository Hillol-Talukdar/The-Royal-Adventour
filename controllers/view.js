const Tour = require("../models/tour");
const User = require("../models/user");
const Booking = require("../models/booking");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getOverview = catchAsync(async (req, res, next) => {
    const tours = await Tour.find();

    res.status(200).render("overview", {
        title: "Home",
        tours,
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
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

exports.getAccount = (req, res) => {
    res.status(200).render("account", {
        title: "My account",
    });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
    const bookings = await Booking.find({ user: req.user.id });
    const tourIds = bookings.map((el) => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIds } });

    res.status(200).render("overview", {
        title: "My tours",
        tours,
    });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).render("account", {
        title: "My account",
        user: updatedUser,
    });
});
