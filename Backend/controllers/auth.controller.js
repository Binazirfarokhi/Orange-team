const express = require("express");
const {
  login,
  passwordReset,
  refreshToken,
  signup,
} = require("../services/auth.service");
const router = express.Router();

// define the home page route
router.post("/", login);
router.post("/signup", signup);
router.post("/reset", passwordReset);
router.get("/refreshToken", refreshToken);

module.exports = router;
