const Tour = require("../models/tour");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.tourId);

    const session = await stripe.checkout.sessions.create({
        // information about session
        payment_method_types: ["card"],
        success_url: `${req.protocol}://${req.get("host")}/`,
        cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,

        // informantion about producct
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                images: [`http://localhost:8000/img/tours/${tour.imageCover}`],
                amount: tour.price * 100, //doller to cent
                currency: "usd",
                quantity: 1,
            },
        ],
    });

    res.status(200).json({
        status: "success",
        session,
    });
});
