const User = require("../models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find();

    res.status(200).json({
        status: "Success",
        result: users.length,
        data: {
            users,
        },
    });
});

exports.getUser = (req, res) => {
    //
};

exports.createUser = (req, res) => {
    //
};

exports.updateUser = (req, res) => {
    //
};

exports.deleteUser = (req, res) => {
    //
};
