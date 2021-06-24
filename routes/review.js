const express = require("express");
const router = express.Router({ mergeParams: true });

const {
    getAllReviews,
    createReview,
    updateReview,
    deleteReview,
    setTourUserIds,
    getReview,
} = require("../controllers/review");

const { protect, restrictTo } = require("../controllers/auth");

router
    .route("/review")
    .get(getAllReviews)
    .post(protect, restrictTo("user"), setTourUserIds, createReview);

router
    .route("/review/:id")
    .patch(updateReview)
    .delete(deleteReview)
    .get(getReview);

module.exports = router;
