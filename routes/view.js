const express = require("express");
const router = express.Router();

const {
    getOverview,
    getTour,
    loginform,
    getAccount,
} = require("../controllers/view");
const { isLoggedIn, protect } = require("../controllers/auth");

router.get("/", isLoggedIn, getOverview);
router.get("/tour/:slug", isLoggedIn, getTour);
router.get("/login", isLoggedIn, loginform);
router.get("/me", protect, getAccount);

module.exports = router;
