const express = require('express');
const applyGlobalMiddleware = require('./config/middleware/global.js');
const bcrypt = require('bcryptjs');
const userDb = require('./data/models/userDb.js');

const server = express();
const port = 5000;

applyGlobalMiddleware(server);

// login a user
server.post('/api/login', (req, res) => {
	const credentials = req.body;
	if (!credentials.username) {
		return res.status(401).json({ error: 'Username cannot be empty.' });
	}
	if (!credentials.password) {
		return res.status(401).json({ error: 'Password cannot be empty.' });
	}
	return userDb
		.getUser(credentials.username)
		.then(user => {
			if (user) {
				return bcrypt
					.compare(credentials.password, user.password)
					.then((match) => {
						if (match) {
							return res.status(201).json({ message: `You are now logged in as ${ credentials.username }` });
						}
						return res.status(404).json({ error: 'You shall not pass!' });
					});
			}
			return res.status(404).json({ error: 'You shall not pass!' });
		})
		.catch(err => res.status(500).json({ error: `Server failed to login user: ${ err }` }));
});

// register a new user
server.post('/api/register', (req, res) => {
	const credentials = req.body;
	if (!credentials.username) {
		return res.status(401).json({ error: 'Username cannot be empty.' });
	}
	if (!credentials.password) {
		return res.status(401).json({ error: 'Password cannot be empty.' });
	}
	return bcrypt
		.hash(credentials.password, 14, function(bcryptErr, hash) {
			if (bcryptErr) {
				return res.status(500).json({ error: `Bcrypt hashing failed: ${ bcryptErr }` });
			}
			credentials.password = hash;
			return userDb
				.registerNewUser(credentials)
				.then(id => res.status(201).json(id.id[0]))
				.catch(err => res.status(500).json({ error: `Server failed to register new user: ${ err }` }));
		});
});

server.listen(port, () => { console.log(`\n=== Listening on port ${ port } ===`) });
