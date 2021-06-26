const mongoose = require("mongoose");
const Tour = require("../models/tour");

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, "Review can not be empty"],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: "Tour",
            required: [true, "Review must belong to a tour."],
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "Review must belong to a user."],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "name photo",
    });

    next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId },
        },
        {
            $group: {
                _id: "$tour",
                numRating: { $sum: 1 },
                avgRating: { $avg: "$rating" },
            },
        },
    ]);

    await Tour.findByIdAndUpdate(tourId, {
        ratingsQuantity: stats[0].numRating,
        ratingsAverage: stats[0].avgRating,
    });
};

reviewSchema.post("save", function () {
    this.constructor.calcAverageRatings(this.tour);
});

module.exports = mongoose.model("Review", reviewSchema);
