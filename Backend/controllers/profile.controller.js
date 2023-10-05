const express = require('express')
const router = express.Router()
const profile = require('../services/profile.service')
// define the home page route
router.post('/create', profile.createUser)
router.get('/', profile.listUser)
router.get('/:id', profile.user)
router.delete('/:id', profile.deleteUser)
router.put('/:id', profile.updateUser)

module.exports = router