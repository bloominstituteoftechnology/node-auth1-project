const express = require('express');
const userRoutes = require('./users/userRoutes');
const loginRoutes = require('./login/loginRoutes');
const logoutRoutes = require('./logout/logoutRoutes');
const registerRoutes = require('./register/registerRoutes');
const restrictedRoutes = require('./restricted/restrictedRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/login', loginRoutes);
router.use('/logout', logoutRoutes);
router.use('/register', registerRoutes);
router.use('/restricted', restrictedRoutes);

module.exports = router;