const express = require("express");
const router = express.Router();

const {
    getOverview,
    getTour,
    loginform,
    getAccount,
    updateUserData,
    getMyTours,
    signupform,
    getTopTours,
} = require("../controllers/view");

const { isLoggedIn, protect } = require("../controllers/auth");

const { createBookingCheckout } = require("../controllers/booking");

router.get("/", createBookingCheckout, isLoggedIn, getOverview);
router.get("/tour/:slug", isLoggedIn, getTour);
router.get("/login", isLoggedIn, loginform);
router.get("/signup", isLoggedIn, signupform);
router.get("/me", protect, getAccount);
router.get("/my-tours", protect, getMyTours);
router.get("/top-tours", getTopTours);

router.post("/submit-user-data", protect, updateUserData);

module.exports = router;
