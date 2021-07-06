const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe,
    getMe,
    uploadUserPhoto,
} = require("../controllers/user");

const {
    signup,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword,
    protect,
    restrictTo,
} = require("../controllers/auth");

router.post("/user/signup", signup);
router.post("/user/login", login);
router.get("/user/logout", logout);
router.post("/user/forgotPassword", forgotPassword);
router.patch("/user/resetPassword/:token", resetPassword);

//every routes from bellow will be protected
router.use(protect);

router.get("/user/me", getMe, getUser);
router.patch("/user/updatePassword", updatePassword);
router.patch("/user/updateMe", uploadUserPhoto, updateMe);
router.delete("/user/deleteMe", deleteMe);

//every routes from bellow will be restricted to Admin
router.use(restrictTo("admin"));

router.route("/user").get(getAllUsers).post(createUser);
router.route("/user/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
