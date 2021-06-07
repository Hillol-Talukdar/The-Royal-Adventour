const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
} = require("../controllers/user");

const { signup } = require("../controllers/auth");

router.post("/user/signup", signup);
router.route("/user").get(getAllUsers).post(createUser);
router.route("/user/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
