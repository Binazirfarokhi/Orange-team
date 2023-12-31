const express = require('express')
const { login, passwordReset, refreshToken, signup, child, childrenList, updateChildren, deleteChildren, saveChildren } = require('../services/children.service');
const router = express.Router()

// define the home page route
router.get('/:email', childrenList);
router.get('/child/:id', child);
router.post('/:email', saveChildren);
router.put('/:id', updateChildren);
router.delete('/:id', deleteChildren);


module.exports = router