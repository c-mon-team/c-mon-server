const express = require('express');
const group = require('../controllers/group');
const router = express.Router();

router.post('/', group.createGroup);

module.exports = router;
