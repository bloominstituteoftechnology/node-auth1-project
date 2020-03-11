const express = require('express');

const router = express.Router();
const userRoute = require('../user/userRoute');
const authRoute = require('../auth/auth-router');

router.use('/users', userRoute);
router.use('/auth', authRoute);

module.exports = router;

