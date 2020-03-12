const express = require('express');
const User = require('./user-model');
const router = express.Router();

const restrict = require('../middleware/restrict');

router.get('/', restrict(), async (req, res, next) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
