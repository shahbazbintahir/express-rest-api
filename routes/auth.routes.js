// third party import
const express = require('express');

// import Controller
const authController = require('../controllers/auth/authController');

const router = express.Router();

router.put('/signup', authController.Signup);
router.post('/login', authController.Login);

router.post("/password/recover", authController.PasswordRecover);
router.get("/password/reset", authController.PasswordReset);

module.exports = router;
