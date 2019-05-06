const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../routes/users-model');

const router = express.Router();

router.get('/', (req, res) => {
	res.send("It's alive!");
});

router.get('/api/users', (req, res) => {
	db
		.find()
		.then((users) => {
			res.status(200).json(users);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'Users information can not be retrieved' });
		});
});

router.get('/api/users/:id', (req, res) => {
	db
		.findByID(req.params.id)
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'User information can not be retrieved' });
		});
});

router.post('/api/register', (req, res) => {
	const newUser = req.body;

	if (!newUser.hasOwnProperty('username') || !newUser.hasOwnProperty('password')) {
		res.status(400).json({ error: 'Please provide name and password for the user.' });
	}

	const hash = bcrypt.hashSync(newUser.password, 10);
	newUser.password = hash;

	db
		.addNewUser(newUser)
		.then((addedUser) => {
			res.status(201).json(addedUser);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'The was an error while saving new user' });
		});
});

/*Use the credentials sent inside the body to authenticate the user.
 On successful login, create a new session for the user and send back a 'Logged in' message
 and a cookie that contains the user id.
 If login fails, respond with the correct status code and the message: 'You shall not pass!' */
router.post('/api/login', (req, res) => {});

module.exports = router;
