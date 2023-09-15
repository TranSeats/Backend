const express = require('express');
const router = express.Router();
const transeatsController = require('../controller/transeatsController');
const middleware = require ('../middleware/auth')

router.post('/register', transeatsController.register);
router.post('/login', transeatsController.login);
router.get('/testProtected', middleware.verifyToken, transeatsController.testProtected)

module.exports = router;