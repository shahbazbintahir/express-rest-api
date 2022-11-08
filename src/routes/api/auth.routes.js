// third party import
const express = require('express');
const cors = require('cors');

// import Controller
const authController = require('../../app/controllers/auth/authController');

const router = express.Router();

router.put('/signup', [cors()], authController.Signup);
router.post('/login', [cors()], authController.Login);

router.post("/password/recover", [cors()], authController.PasswordRecover);
router.get("/password/reset", [cors()], authController.PasswordReset);

module.exports = router;
