const express = require("express");
const reviewRouter = require("./review");
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

router.use("/tour/:tourId", reviewRouter);

router.route("/tour/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/tour/tour-stats").get(getTourStats);

router
    .route("/tour/monthly-plan/:year")
    .get(protect, restrictTo("admin", "lead-guide", "guide"), getMonthlyPlan);

router
    .route("/tour")
    .get(getAllTours)
    .post(protect, restrictTo("admin", "lead-guide"), createTour);

router
    .route("/tour/:id")
    .get(getTour)
    .patch(protect, restrictTo("admin", "lead-guide"), updateTour)
    .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

module.exports = router;
