const express = require('express')
const { getPhoto, savePhoto } = require('../services/photos.service')
const router = express.Router()

router.post('/:id/:type', savePhoto)
router.get('/:id', getPhoto)


module.exports = router