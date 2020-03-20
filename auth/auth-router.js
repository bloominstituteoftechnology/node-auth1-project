const express = require('express');
const Users = require('../users/user-model');
const bcrypt = require('bcryptjs');
const { restrict } = require('../middleware/restrict');
const router = express.Router();

router.post('/register', async (req, res, next) => {
	try {
		const { username } = req.body;
		const user = await Users.findBy({ username }).first();
		if (user) {
			return res.status(409).json({
				message: 'Username is taken'
			});
		}
		res.status(201).json(await Users.addUser(req.body));
	} catch (err) {
		next(err);
	}
});

router.post('/login', async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await Users.findBy({ username }).first();
		const passwordValid = await bcrypt.compare(password, user.password);

		if (!user || !passwordValid) {
			return res.status(401).json({
				message: 'Invalid credentials'
			});
		}
		req.session.user = user;
		res.json({
			message: `Welcome ${user.username}`
		});
	} catch (err) {
		next(err);
	}
});

router.get('/logout', restrict(), async (req, res, next) => {
	req.session.destroy((err) => {
		if (err) {
			next(err);
		}
		else {
			res.json({
				message: 'Successfully logged out'
			});
		}
	});
});

module.exports = router;
