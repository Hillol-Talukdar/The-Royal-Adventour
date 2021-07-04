const express = require("express");
const router = express.Router();

const { getOverview, getTour, loginform } = require("../controllers/view");

router.get("/", getOverview);
router.get("/tour/:slug", getTour);
router.get("/login", loginform);

module.exports = router;
