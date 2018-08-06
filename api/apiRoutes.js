const express = require('express');
const userRoutes = require('./users/userRoutes');
const loginRoutes = require('./login/loginRoutes');
const registerRoutes = require('./register/registerRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/login', loginRoutes);
router.use('/register', registerRoutes);

module.exports = router;