const Tour = require("../models/tour");
const Booking = require("../models/booking");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.tourId);

    const session = await stripe.checkout.sessions.create({
        // information about session
        payment_method_types: ["card"],
        // success_url style is not very secure style
        success_url: `${req.protocol}://${req.get("host")}/?tour=${
            req.params.tourId
        }&user=${req.user.id}&price=${tour.price}`,
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

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
    // it is not secure ways. as user can book without paying
    const { tour, user, price } = req.query;

    if (!tour && !user && !price) {
        return next();
    }

    await Booking.create({ tour, user, price });

    res.redirect(req.originalUrl.split("?")[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getALLBooking = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);