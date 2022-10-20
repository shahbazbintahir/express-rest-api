// third party import
const express = require('express');

// import Controller
const userController = require('../controllers/user/userController');
const authController = require('../controllers/auth/authController');

// include middleware 
const checkFeaturePermission = require('../middleware/checkFeaturePermission');
const isAuth = require('../middleware/auth');

const router = express.Router();

router.get('/getUser/:id', [ checkFeaturePermission('user', 'view') ], userController.getUser);
router.get('/getByUsername/:id', [ checkFeaturePermission('user', 'view') ], userController.getByUsername);
router.post('/activateUser/:id', [ checkFeaturePermission('user', 'update') ], userController.activateUser);
router.post('/deactivateUser/:id', [ checkFeaturePermission('user', 'update') ], userController.deactivateUser);
router.get('/getAllUser', [ checkFeaturePermission('user', 'view') ], userController.getAllUser);
router.put('/update/:userId', [ checkFeaturePermission('user', 'update') ], userController.updateUser);

router.post('/profile/update/password', [isAuth], authController.changeUserPassword);

module.exports = router;
