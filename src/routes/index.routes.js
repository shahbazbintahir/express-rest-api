// third party import
const express = require('express');
const router = express.Router();

router.use('/app/db/', require('./api/db.routes'));

router.use('/api/user/', require('./api/user.routes'));
router.use('/api/auth/', require('./api/auth.routes'));
router.use('/api/role/', require('./api/role.routes'));
router.use('/api/permission/', require('./api/permission.routes'));
router.use('/api/profile/', require('./api/profile.routes'));
router.use('/api/product/', require('./api/product.routes'));

module.exports = router;
