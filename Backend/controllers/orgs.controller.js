const express = require('express')
const { getVolunteerByOrgId, org, orgs, saveNewOrg } = require('../services/orgs.service')
const { setVolunteerPosition } = require('../services/profile.service')
const router = express.Router()

// define the home page route
router.get('/', orgs);
router.post('/', saveNewOrg);
router.get('/:id', org);
router.get('/volunteer/:id', getVolunteerByOrgId);
router.patch('/volunteer/:id', setVolunteerPosition);


module.exports = router