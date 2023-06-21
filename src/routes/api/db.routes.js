// third party import
const express = require('express');

const router = express.Router();

// import Seeder function
const seeder = require('../../database/seeder/index');

router.get('/seed', seeder.runSeed);

module.exports = router;
