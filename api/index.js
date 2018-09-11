const express = require('express');

const authRoutes = require('./auth');
const userRoutes = require('./users');
const restrictedRoutes = require('./restricted');

const middleware = require('../middleware');

const router = express.Router();

router.use('/', authRoutes);
router.use('/users', userRoutes);
router.use('/restricted', middleware.protected, restrictedRoutes);


module.exports = router;
