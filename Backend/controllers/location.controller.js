const express = require("express");
const router = express.Router();
const location = require("../services/location.service");

router.get("/", location.getLocation);
router.get("/displaymap", location.displayMap);
router.get("/geocoding", location.geoCoding);
module.exports = router;
