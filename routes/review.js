const express = require("express");
const router = express.Router({ mergeParams: true });

const {
    getAllReviews,
    createReviews,
    deleteReview,
} = require("../controllers/review");

const { protect, restrictTo } = require("../controllers/auth");

router
    .route("/review")
    .get(getAllReviews)
    .post(protect, restrictTo("user"), createReviews);

router.route("/review/:id").delete(deleteReview);

module.exports = router;
