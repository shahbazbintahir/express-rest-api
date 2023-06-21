// third party import
const express = require('express');
// import Controller
const profileController = require('../../app/controllers/profile/profileController');
// include middleware 
const isAuth = require('../../app/middleware/auth');
const fileMiddleware = require('../../app/middleware/upload')


const router = express.Router();

router.get('/getProfile', [isAuth], profileController.getProfile);
router.post('/updateProfile', [isAuth,fileMiddleware], profileController.updateProfile);
router.post('/activateProfile', [isAuth], profileController.activateProfile);
router.post('/deactivateProfile', [isAuth], profileController.deactivateProfile);
router.post('/changeProfilePassword', [isAuth], profileController.changeProfilePassword);

module.exports = router;
