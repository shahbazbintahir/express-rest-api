// third party import
const express = require('express');
const router = express.Router();

router.use('/api/user/', require('./api/user.routes'));
router.use('/api/auth/', require('./api/auth.routes'));
router.use('/api/role/', require('./api/role.routes'));
router.use('/api/permission/', require('./api/permission.routes'));

module.exports = router;
