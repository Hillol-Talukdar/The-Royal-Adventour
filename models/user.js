const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

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
            select: false, // will not shows in response object
        },
        confirmPassword: {
            type: String,
            required: [true, "Please provide your password"],
            validate: {
                validator: function (el) {
                    return el === this.password;
                },
                message: "passwords are not the same!",
            },
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

//instance method
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    //candidate password came from request
    return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model("User", userSchema);
