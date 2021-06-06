const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Please provide your name"],
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            lowercase: true,
            required: [true, "Please provide your email"],
            validate: [validator.isEmail, "Please provide a valid email"],
        },
        photo: String,
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: 6,
        },
        confirmPassword: {
            type: String,
            required: [true, "Please provide your password"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
