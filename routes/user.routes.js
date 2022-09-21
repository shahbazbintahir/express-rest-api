const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/user/userController');
const isAuth = require('../middlewares/auth');

const router = express.Router();

router.put(
    '/user/:userId',
    [
        isAuth,
    ],
    [
        body('name').trim().isLength({ min: 5 }),
    ],
    userController.updateUser
);

module.exports = router;
