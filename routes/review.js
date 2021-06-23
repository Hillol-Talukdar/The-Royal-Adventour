const express = require("express");
const router = express.Router({ mergeParams: true });

const { getAllReviews, createReviews } = require("../controllers/review");

const { protect, restrictTo } = require("../controllers/auth");

router
    .route("/review")
    .get(getAllReviews)
    .post(protect, restrictTo("user"), createReviews);

module.exports = router;
