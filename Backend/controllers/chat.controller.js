const express = require('express')
const router = express.Router()
const chat = require('../services/chat.service')

router.get('/userlist', chat.listUsers);
router.get('/:senderId/:receiverId', chat.getMessages);  
router.get('/:id', chat.singleUserProfile);
router.post('/', chat.sendMessages);



module.exports = router