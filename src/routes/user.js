const express = require('express');

const router = express.Router();

const { getAuthenticatedUser } = require('../controllers/user');
const { authenticatedRoute } = require('../utils/authenticatedRoute');

router.get('/me', authenticatedRoute, getAuthenticatedUser);

module.exports = router;
