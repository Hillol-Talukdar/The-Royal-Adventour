const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        tour: {
            type: moongoose.Schema.ObjectId,
            ref: "Tour",
            required: [true, "Booking must belong to a Tour"],
        },
        User: {
            type: moongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "Booking must belong to a User"],
        },
        Pice: {
            type: Number,
            required: [true, "Booking must have a price"],
        },
        paid: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

bookingSchema.pre(/^find/, function (next) {
    this.populate("user").populate({
        path: "tour",
        select: "name",
    });
});

module.exports = mongoose.model("Booking", bookingSchema);
