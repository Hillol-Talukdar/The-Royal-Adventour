const express = require("express");
const router = express.Router();

const {
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
} = require("../controllers/tour");

router.route("/tour").get(getAllTours).post(createTour);
router.route("/tour/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
