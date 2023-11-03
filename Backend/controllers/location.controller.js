const express = require('express')
const router = express.Router()
const location = require('../services/location.service')

router.get('/', location.getLocation);

module.exports = router