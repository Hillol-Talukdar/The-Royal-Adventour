const User = require("../models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const multer = require("multer");
const sharp = require("sharp");

// const multerStorage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, "public/img/users");
//     },
//     filename: (req, file, callback) => {
//         const extension = file.mimetype.split("/")[1];
//         callback(null, `user-${req.user.id}-${Date.now()}.${extension}`);
//     },
// });

const multerStorage = multer.memoryStorage(); // save image in memory

const multerFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    } else {
        callback(
            new AppError("Not an image! Please upload only images", 400),
            false
        );
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = (req, res, next) => {
    if (!req.file) {
        return next();
    }

    // save file name in req so that we can get excess in updateMe function
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    // image which is in memory can be excess using buffer
    // sharp will resize file and save it in exact location and format
    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);

    next();
};

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });

    return newObj;
};

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.createUser = (req, res, next) => {
    return next(new AppError("Please use /signup instead of this URL", 500));
};

exports.updateUser = factory.updateOne(User);

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
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

    if (req.file) {
        filteredBody.photo = req.file.filename;
    }

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
