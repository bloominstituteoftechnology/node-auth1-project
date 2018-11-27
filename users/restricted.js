const express = require('express');
const protected = require('../middleware/protected');

const router = express.Router();
router.use(protected);

module.exports = router;

