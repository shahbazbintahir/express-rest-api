// third party import
const express = require('express');

// import Controller
const permissionController = require('../../app/controllers/rolePermission/permissionController');

// include middleware
const isAdministration = require('../../app/middleware/Administration');

const router = express.Router();

router.get('/getPermission/:id', [isAdministration], permissionController.getPermission);
router.get('/getAllPermission', [isAdministration], permissionController.getAllPermission);
router.put('/update/:permissionId', [isAdministration], permissionController.updatePermission);
router.post('/add', [isAdministration], permissionController.addPermission);

module.exports = router;
