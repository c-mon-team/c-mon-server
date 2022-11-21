const express = require('express');
const member = require('../controllers/member');
const router = express.Router();

router.post('/', member.createMemberChoice);

module.exports = router;
