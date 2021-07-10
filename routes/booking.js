const express = require("express");
const router = express.Router();

const { getCheckoutSession } = require("../controllers/booking");

const { protect } = require("../controllers/auth");

router.get("/booking/checkout-session/:tourId", protect, getCheckoutSession);

module.exports = router;
