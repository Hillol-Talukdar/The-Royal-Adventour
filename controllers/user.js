const User = require("../models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });

    return newObj;
};

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

exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.confirmPassword) {
        return next(
            new AppError(
                "this route is not for password updating. Please use /updatePassword",
                400
            )
        );
    }

    const filteredBody = filterObj(req.body, "name", "email");
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser,
        },
    });
});

exports.deleteUser = factory.deleteOne(User);

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: "success",
        data: null,
    });
});
