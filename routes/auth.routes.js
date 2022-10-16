const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth/authController');
const router = express.Router();

router.put('/signup', authController.Signup);
router.post('/login', authController.Login);

router.post("/password/recover", authController.PasswordRecover);
router.get("/password/reset/:userId/:token", authController.PasswordReset);

module.exports = router;
