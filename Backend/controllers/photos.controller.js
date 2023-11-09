const express = require("express");
const {
  getPhoto,
  savePhoto,
  savePhoto64,
  getPhotoByUserId,
} = require("../services/photos.service");
const router = express.Router();

router.post("/:id/:type", savePhoto);
router.post("/64/:id/:type/:ext", savePhoto64);
router.get("/:id", getPhoto);
router.get("/user/:id", getPhotoByUserId);

module.exports = router;
