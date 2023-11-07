const express = require('express')
const router = express.Router()

router.get('/', location.getLocation);
router.get('/displaymap', location.displayMap);

module.exports = router