const express = require("express");
const router = express.Router();

const {
    getCheckoutSession,
    createBooking,
    getBooking,
    getALLBooking,
    updateBooking,
    deleteBooking,
} = require("../controllers/booking");

const { protect, restrictTo } = require("../controllers/auth");

router.get("/booking/checkout-session/:tourId", protect, getCheckoutSession);

router
    .route("/booking")
    .get(protect, restrictTo("admin", "lead-guide"), getALLBooking)
    .post(protect, restrictTo("admin", "lead-guide"), createBooking);

router
    .route("/booking/:id")
    .get(protect, restrictTo("admin", "lead-guide"), getBooking)
    .patch(protect, restrictTo("admin", "lead-guide"), updateBooking)
    .delete(protect, restrictTo("admin", "lead-guide"), deleteBooking);

module.exports = router;
