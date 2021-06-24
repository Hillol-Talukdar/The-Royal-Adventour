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
router.use(protect);

router
    .route("/review")
    .get(getAllReviews)
    .post(restrictTo("user"), setTourUserIds, createReview);

router
    .route("/review/:id")
    .patch(restrictTo("admin", "user"), updateReview)
    .delete(restrictTo("admin", "user"), deleteReview)
    .get(getReview);

module.exports = router;
