const mongoose = require("mongoose");
const slugify = require("slugify");
// const User = require("./user");

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "A tour must have a name"],
            unique: true,
            trim: true,
            maxLength: [
                50,
                "A tour name must have equal or less than 50 chaacters",
            ],
            minLength: [
                2,
                "A tour name must have equal or more than 2 chaacters",
            ],
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, "A tour must have a duration"],
        },
        maxGroupSize: {
            type: Number,
            required: [true, "A tour must have a group size"],
        },
        difficulty: {
            type: String,
            enum: {
                values: ["easy", "medium", "difficult"],
                message: "Difficulty must be either easy, medium or hard",
            },
            required: [true, "A tour must have a difficulty"],
        },
        ratingsAverage: {
            type: Number,
            default: 0,
            max: [5, "rating must be below 5"],
            min: [0, "rating must be above or equal 0"],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, "A tour must have a price"],
        },
        priceDiscount: {
            type: Number,
            validate: {
                // only works while creating
                validator: function (val) {
                    return val < this.price;
                },
                message: "discount price should be less then regular price",
            },
        },
        summary: {
            type: String,
            trim: true,
            required: [true, "A tour must have a summary"],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, "A tour must have a cover image"],
        },
        images: [String],
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
        },
        startLocation: {
            //GeoJSON
            type: {
                type: String,
                default: "Point",
                enum: ["Point"],
            },
            coordinates: [Number],
            address: String,
            description: String,
        },
        location: [
            {
                type: {
                    type: String,
                    default: "Point",
                    enum: ["Point"],
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number,
            },
        ],
        // guides: Array,
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

//1 = ascending, -1= descending
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

tourSchema.virtual("durationWeeks").get(function () {
    return this.duration / 7;
});

// Virtual populate
tourSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "tour",
});

// DOCUMENT MIDDLEWARE. Runs before .create(), .save()
tourSchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// tourSchema.pre("save", async function (next) {
//     const guidesPromises = this.guides.map(
//         async (id) => await User.findById(id)
//     );

//     this.guides = await Promise.all(guidesPromises);
//     next();
// });

// QUERY MIDDLEWARE. /^abc/ means queary starts with abc
tourSchema.pre(/^find/, function (next) {
    // Here we hid secret tours
    this.find({ secretTour: { $ne: true } });
    next();
});

tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: "guides",
        select: "-__v -passwordChangedAt",
    });
    next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
    // unshift to add ele to array
    // Here we hide all secTour doc for any route
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
});

module.exports = mongoose.model("Tour", tourSchema);
