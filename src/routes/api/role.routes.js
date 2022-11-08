// third party import
const express = require('express');

// import Controller
const roleController = require('../../app/controllers/rolePermission/roleController');

// include middleware
const isAdministration = require('../../app/middleware/Administration');

const router = express.Router();

router.get('/getRole/:id', [isAdministration], roleController.getRole);
router.get('/getAllRole', [isAdministration], roleController.getAllRole);
router.put('/update/:roleId', [isAdministration], roleController.updateRole);
router.post('/add', [isAdministration], roleController.addRole);

module.exports = router;
