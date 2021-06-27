const express = require("express");
const router = express.Router();

const { getHome, getTour } = require("../controllers/view");

router.get("/", getHome);

router.get("/tour", getTour);

module.exports = router;
