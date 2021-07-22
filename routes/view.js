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
    getAllReviews,
    getManageTours,
    getCreateTourForm,
    updateTourForm,
} = require("../controllers/view");

const { isLoggedIn, protect, restrictTo } = require("../controllers/auth");

const { createBookingCheckout } = require("../controllers/booking");

router.get("/", createBookingCheckout, isLoggedIn, getOverview);
router.get("/tour/:slug", isLoggedIn, getTour);
router.get("/top-tours", getTopTours);

router.get("/login", isLoggedIn, loginform);
router.get("/signup", isLoggedIn, signupform);

router.get("/me", protect, getAccount);
router.get("/my-tours", protect, getMyTours);

router.get("/all-reviews", protect, restrictTo("admin"), getAllReviews);
router.get("/manage-tours", protect, restrictTo("admin"), getManageTours);
router.get("/create-new-tour", protect, restrictTo("admin"), getCreateTourForm);
router.get("/update-tour/:slug", protect, restrictTo("admin"), updateTourForm);

router.post("/submit-user-data", protect, updateUserData);

module.exports = router;
