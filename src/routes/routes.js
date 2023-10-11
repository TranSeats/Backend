const express = require('express');
const router = express.Router();
const transeatsController = require('../controller/transeatsController');
const middleware = require ('../middleware/auth')
const multer = require('multer');
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage });

router.post('/register', transeatsController.register);
router.post('/login', transeatsController.login);
router.post('/build', transeatsController.build)
router.post('/publish',  upload.single('file'), transeatsController.publish)
router.get('/testProtected', middleware.verifyToken, transeatsController.testProtected)

module.exports = router;