const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
} = require("../controllers/user");

const {
    signup,
    login,
    forgotPassword,
    resetPassword,
    updatePassword,
    protect,
} = require("../controllers/auth");

router.post("/user/signup", signup);
router.post("/user/login", login);

router.post("/user/forgotPassword", forgotPassword);
router.patch("/user/updatePassword", protect, updatePassword);
router.patch("/user/resetPassword/:token", resetPassword);

router.route("/user").get(getAllUsers).post(createUser);
router.route("/user/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
