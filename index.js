const express = require('express');
const applyGlobalMiddleware = require('./config/middleware/global.js');
const bcrypt = require('bcryptjs');
const userDb = require('./data/models/userDb.js');

const server = express();
const port = 5000;

applyGlobalMiddleware(server);

// register a new user
server.post('/api/register', (req, res) => {
	const credentials = req.body;
	if (!credentials.username) {
		return res.status(401).json({ error: 'Username cannot be empty.' });
	}
	if (!credentials.password) {
		return res.status(401).json({ error: 'Password cannot be empty.' });
	}
	bcrypt.hash(credentials.password, 14, function(err, hash) {
		if (err) {
			return res.status(400).json({ error: `Registration failed: ${ err }` });
		}
		credentials.password = hash;
		userDb
			.registerNewUser(credentials)
			.then(id => res.status(201).json(id.id[0]))
			.catch(err => res.status(500).json({ error: `Server failed to register new user: ${ err }` }));
	});
});

server.listen(port, () => { console.log(`\n=== Listening on port ${ port } ===`) });
