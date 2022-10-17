// third party import
const express = require('express');

// import Controller
const userController = require('../controllers/user/userController');

// include middleware 
const checkFeaturePermission = require('../middleware/checkFeaturePermission');

const router = express.Router();

router.get('/getUser/:id', [ checkFeaturePermission('user', 'view') ], userController.getUser);
router.post('/activateUser/:id', [ checkFeaturePermission('user', 'update') ], userController.activateUser);
router.post('/deactivateUser/:id', [ checkFeaturePermission('user', 'update') ], userController.deactivateUser);
router.get('/getAllUser', [ checkFeaturePermission('user', 'view') ], userController.getAllUser);
router.put('/update/:userId', [ checkFeaturePermission('user', 'update') ], userController.updateUser);


module.exports = router;
