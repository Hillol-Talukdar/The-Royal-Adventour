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

//every routes from bellow will be protected
// router.use(protect);

router
    .route("/review")
    .get(protect, getAllReviews)
    .post(protect, restrictTo("user"), setTourUserIds, createReview);

router
    .route("/review/:id")
    .patch(protect, restrictTo("admin", "user"), updateReview)
    .delete(protect, restrictTo("admin", "user"), deleteReview)
    .get(protect, getReview);

module.exports = router;
