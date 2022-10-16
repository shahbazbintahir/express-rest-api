const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/user/userController');

// include middleware list
const isAuth = require('../middleware/auth');
const checkFeaturePermission = require('../middleware/checkFeaturePermission');

const router = express.Router();

router.get('/getUser/:id', [ checkFeaturePermission('user', 'view') ], userController.getUser);
router.post('/activateUser/:id', [ checkFeaturePermission('user', 'update') ], userController.activateUser);
router.post('/deactivateUser/:id', [ checkFeaturePermission('user', 'update') ], userController.deactivateUser);
router.get('/getAllUser', [ checkFeaturePermission('user', 'view') ], userController.getAllUser);
router.put('/update/:userId', [ checkFeaturePermission('user', 'update') ], userController.updateUser);


module.exports = router;
