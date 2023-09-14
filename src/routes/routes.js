const express = require('express');
const router = express.Router();
const transeatsController = require('../controller/transeatsController');

router.post('/register', transeatsController.register);
router.post('/login', transeatsController.login);

module.exports = router;