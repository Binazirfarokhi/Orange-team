const express = require('express')
const router = express.Router()
const profile = require('../services/profile.service')
// define the home page route
router.get('/', profile.listUser)
router.get('/:email', profile.user)
router.delete('/:id', profile.deleteUser)
router.put('/:email', profile.updateUser)
router.put('/personal/:email', profile.updatePersonalInfo)

module.exports = router