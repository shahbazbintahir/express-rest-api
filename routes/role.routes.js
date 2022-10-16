const express = require('express');
const { body } = require('express-validator');

const roleController = require('../controllers/rolePermission/roleController');
const isAdministration = require('../middleware/Administration');

const router = express.Router();

router.get('/getRole/:id', [ isAdministration, ], roleController.getRole);
router.get('/getAllRole', [ isAdministration, ], roleController.getAllRole);
router.put('/update/:roleId', [ isAdministration, ], roleController.updateRole);
router.post('/add', [ isAdministration, ], roleController.addRole);


module.exports = router;
