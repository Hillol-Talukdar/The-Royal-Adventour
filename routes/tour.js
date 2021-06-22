const express = require("express");
const router = express.Router();

const {
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    aliasTopTours,
    getTourStats,
    getMonthlyPlan,
} = require("../controllers/tour");

const { protect, restrictTo } = require("../controllers/auth");

const { getAllReviews, createReviews } = require("../controllers/review");

router.route("/tour/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/tour/tour-stats").get(getTourStats);
router.route("/tour/monthly-plan/:year").get(getMonthlyPlan);
router.route("/tour").get(protect, getAllTours).post(createTour);
router
    .route("/tour/:id")
    .get(getTour)
    .patch(updateTour)
    // .delete(protect, deleteTour);
    .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

router
    .route("/tour/:tourId/review")
    .post(protect, restrictTo("user"), createReviews);

module.exports = router;
